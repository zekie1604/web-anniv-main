import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../services/music.service';

@Component({
  selector: 'app-music-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="musicService.isPlaying()"
      class="music-stopper-draggable"
      [ngClass]="{ 'center-stop-btn': !showSongName }"
      [ngStyle]="{ top: stopperY + 'px', left: stopperX + 'px' }"
      (mousedown)="startDrag($event)"
      (touchstart)="startDrag($event)"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      style="position: fixed; z-index: 1001; cursor: grab;"
    >
      <span class="song-name" [class.hide-song-name]="!showSongName">{{ musicService.getCurrentSongName() }}</span>
      <button class="stop-btn" (click)="onStopClick($event)" (touchend)="onStopClick($event)" title="Stop music">
        &#10073;&#10073;
      </button>
    </div>
  `,
  styles: [`
    .music-stopper-draggable {
      position: fixed;
      z-index: 1001;
      cursor: grab;
      background: rgba(30,30,30,0.3);
      color: #fff;
      border-radius: 50px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      font-size: 1.1rem;
      backdrop-filter: blur(4px);
      transition: background 0.2s, box-shadow 0.2s;
      min-width: 60px;
      min-height: 60px;
      justify-content: center;
    }
    .music-stopper-draggable:active {
      cursor: grabbing;
      box-shadow: 0 4px 16px rgba(0,0,0,0.18);
    }
    .song-name {
      font-weight: 500;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      opacity: 1;
      transition: opacity 0.5s;
    }
    .hide-song-name {
      opacity: 0;
      transition: opacity 0.5s;
      pointer-events: none;
      width: 0;
      max-width: 0;
      padding: 0;
    }
    .stop-btn {
      background: transparent;
      border: none;
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: background 0.2s;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stop-btn:hover {
      background: rgba(255,255,255,0.12);
    }
    .center-stop-btn {
      justify-content: center !important;
      align-items: center !important;
      padding: 12px !important;
      gap: 0 !important;
      min-width: 60px !important;
      min-height: 60px !important;
    }
  `]
})
export class MusicControlComponent {
  stopperX = 32;
  stopperY = 32;
  private dragging = false;
  private offsetX = 0;
  private offsetY = 0;
  showSongName = true;
  private hideTimeout: any;
  private hovering = false;

  constructor(public musicService: MusicService) {
    // Restore position from localStorage if available
    const x = localStorage.getItem('musicStopperX');
    const y = localStorage.getItem('musicStopperY');
    if (x && y) {
      this.stopperX = +x;
      this.stopperY = +y;
    }
  }

  ngOnInit() {
    this.resetSongNameTimer();
    this.ensureInViewport();
    window.addEventListener('resize', this.ensureInViewport.bind(this));
  }

  ngOnDestroy() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    window.removeEventListener('resize', this.ensureInViewport.bind(this));
  }

  resetSongNameTimer() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    if (!this.hovering) {
      this.showSongName = true;
      this.hideTimeout = setTimeout(() => {
        this.showSongName = false;
      }, 3000);
    }
  }

  startDrag(event: MouseEvent | TouchEvent) {
    this.dragging = true;
    const clientX = (event instanceof MouseEvent) ? event.clientX : event.touches[0].clientX;
    const clientY = (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;
    this.offsetX = clientX - this.stopperX;
    this.offsetY = clientY - this.stopperY;
    event.preventDefault();
    this.resetSongNameTimer();
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.dragging) return;
    const clientX = (event instanceof MouseEvent) ? event.clientX : event.touches[0].clientX;
    const clientY = (event instanceof MouseEvent) ? event.clientY : event.touches[0].clientY;
    this.stopperX = clientX - this.offsetX;
    this.stopperY = clientY - this.offsetY;
    this.ensureInViewport();
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  endDrag() {
    if (this.dragging) {
      localStorage.setItem('musicStopperX', this.stopperX.toString());
      localStorage.setItem('musicStopperY', this.stopperY.toString());
    }
    this.dragging = false;
  }

  onMouseEnter() {
    this.hovering = true;
    this.showSongName = true;
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  onMouseLeave() {
    this.hovering = false;
    this.resetSongNameTimer();
  }

  onStopClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.musicService.pause();
  }

  ensureInViewport() {
    // Get stopper element size (estimate if not rendered yet)
    const stopperWidth = 220; // estimated width
    const stopperHeight = 48; // estimated height
    const padding = 8;
    const maxX = window.innerWidth - stopperWidth - padding;
    const maxY = window.innerHeight - stopperHeight - padding;
    if (this.stopperX > maxX) this.stopperX = maxX;
    if (this.stopperY > maxY) this.stopperY = maxY;
    if (this.stopperX < padding) this.stopperX = padding;
    if (this.stopperY < padding) this.stopperY = padding;
  }
} 