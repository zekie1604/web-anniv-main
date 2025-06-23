import { Component, OnInit } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-home',
  imports: [CarouselComponent, RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private musicService: MusicService) {}

  ngOnInit(): void {
    const shouldPlayMusic = sessionStorage.getItem('playMusicOnHome') === 'true';
    if (shouldPlayMusic && !this.musicService.userPaused) {
      this.musicService.play();
      sessionStorage.removeItem('playMusicOnHome'); // Only play once per login
    }
  }
}
