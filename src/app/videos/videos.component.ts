import { Component, effect, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YearService } from '../services/year.service';
import { SafeUrlPipe } from '../safe-url.pipe';
import { MusicService } from '../services/music.service';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {
  backgroundImage = '';
  mobileBackgroundImage = '';
  currentYear = '';

  videoUrls: string[] = [
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/3JZ_D3ELwOQ',
    'https://www.youtube.com/embed/l482T0yNkeo',
    'https://www.youtube.com/embed/tVj0ZTS4WF4',
    'https://www.youtube.com/embed/ysz5S6PUM-U',
    'https://www.youtube.com/embed/e-ORhEE9VVg',
    'https://www.youtube.com/embed/9bZkp7q19f0'
  ];

  selectedVideo: string = this.videoUrls[0];

  // For mobile slider
  sliderIndex = 0;
  readonly SLIDER_SIZE = 3;

  constructor(
    private yearService: YearService,
    private musicService: MusicService
  ) {
    effect(() => {
      const year = this.yearService.getYear()();
      this.currentYear = year;
      this.backgroundImage = `assets/${year}.png`;
      this.mobileBackgroundImage = `assets/backgrounds/${year}.jpg`;
    });
  }

  ngOnInit(): void {
    // Ensure background is set on load
    this.updateBackground();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateBackground();
  }

  updateBackground() {
    // This method is here in case you want to do more in the future
  }

  getResponsiveBackground(): string {
    return window.innerWidth <= 900
      ? this.mobileBackgroundImage
      : this.backgroundImage;
  }

  getBackgroundSize(): string {
    return this.currentYear === '2022' ? '250% auto' : '200% auto';
  }

  setMainVideo(url: string) {
    this.selectedVideo = url;
    // Pause the music when a video is selected
    this.musicService.pause();
  }

  // --- Slider logic for mobile ---
  isMobile(): boolean {
    return window.innerWidth <= 900;
  }

  getVisibleVideos(): string[] {
    if (!this.isMobile()) {
      return this.videoUrls;
    }
    return this.videoUrls.slice(this.sliderIndex, this.sliderIndex + this.SLIDER_SIZE);
  }

  canSlideLeft(): boolean {
    return this.sliderIndex > 0;
  }

  canSlideRight(): boolean {
    return this.sliderIndex + this.SLIDER_SIZE < this.videoUrls.length;
  }

  slideLeft(): void {
    if (this.canSlideLeft()) {
      this.sliderIndex--;
    }
  }

  slideRight(): void {
    if (this.canSlideRight()) {
      this.sliderIndex++;
    }
  }
}
