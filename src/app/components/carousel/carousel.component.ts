import { NgFor, NgStyle } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MusicService } from '../../services/music.service';
import { YearService } from '../../services/year.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgFor, NgStyle, RouterModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {
  protected readonly musicService = inject(MusicService);
  private readonly yearService = inject(YearService);

  // Array of image paths
  images = [
    'assets/2024.png',
    'assets/2023.png',
    'assets/2022.png',
    'assets/2021.png',
  ];

  // Array of icon paths (one for each image)
  icons = [
    'assets/24.png',
    'assets/23.png',
    'assets/22.png',
    'assets/21.png'
  ];

  // Array of text descriptions (one for each image)
  texts = [
    "Love Stands Strong During Life's Trials",
    "Unbreakable Bond: Love That Thrives",
    "Discovering Each Other, Day by Day",
    "Love Blooms Amidst the Pandemic"
  ];

  currentIndex = 0; // Current image index
  private autoplayInterval: any = null;
  private resumeTimeout: any = null;
  private readonly AUTOPLAY_DELAY = 5000; // 5 seconds
  private readonly RESUME_DELAY = 5000; // 5 seconds
  noTransition = false;
  backgroundImage = '';

  ngOnInit(): void {
    // Restore carousel index based on the last selected year
    const lastYear = this.yearService.getYear()();
    const idx = this.images.findIndex(img => img.includes(lastYear));
    if (idx !== -1) {
      this.currentIndex = idx;
    }
    this.setBackgroundImage();
    this.yearService.setYear(this.getCurrentYear());
    this.startAutoplay();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('resize', this.setBackgroundImage);
  }

  ngOnDestroy(): void {
    this.clearAutoplay();
    this.clearResumeTimeout();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('resize', this.setBackgroundImage);
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      this.clearAutoplay();
      this.clearResumeTimeout();
    } else if (document.visibilityState === 'visible') {
      this.startAutoplay();
    }
  };

  private startAutoplay(): void {
    this.clearAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextImage(false);
    }, this.AUTOPLAY_DELAY);
  }

  private clearAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  private clearResumeTimeout(): void {
    if (this.resumeTimeout) {
      clearTimeout(this.resumeTimeout);
      this.resumeTimeout = null;
    }
  }

  private pauseAndResumeAutoplay(): void {
    this.clearAutoplay();
    this.clearResumeTimeout();
    this.resumeTimeout = setTimeout(() => {
      this.startAutoplay();
    }, this.RESUME_DELAY);
  }

  // Extract the year from the current image filename
  getCurrentYear(): string {
    const img = this.images[this.currentIndex];
    if (!img) {
      return '2024'; // fallback year
    }
    return img.split('/').pop()?.split('.')[0] || '2024';
  }

  // Move to the previous image
  prevImage(user = true): void {
    if (this.currentIndex === 0) {
      this.noTransition = false;
      this.currentIndex = this.images.length;
      setTimeout(() => {
        this.noTransition = true;
        // Use requestAnimationFrame to ensure the DOM updates before resetting
        requestAnimationFrame(() => {
          this.currentIndex = this.images.length - 1;
          this.yearService.setYear(this.getCurrentYear());
          setTimeout(() => {
            this.noTransition = false;
          }, 500); // match transition duration
        });
      }, 20);
    } else {
      this.currentIndex = this.currentIndex - 1;
      this.yearService.setYear(this.getCurrentYear());
    }
    if (user) this.pauseAndResumeAutoplay();
  }

  // Move to the next image
  nextImage(user = true): void {
    if (this.currentIndex === this.images.length - 1) {
      this.noTransition = false;
      this.currentIndex++;
      setTimeout(() => {
        this.noTransition = true;
        // Use requestAnimationFrame to ensure the DOM updates before resetting
        requestAnimationFrame(() => {
          this.currentIndex = 0;
          this.yearService.setYear(this.getCurrentYear());
          setTimeout(() => {
            this.noTransition = false;
          }, 500); // match transition duration
        });
      }, 500); // match transition duration
    } else {
      this.currentIndex = this.currentIndex + 1;
      this.yearService.setYear(this.getCurrentYear());
    }
    if (user) this.pauseAndResumeAutoplay();
  }

  // Go to a specific image
  goToImage(index: number): void {
    this.currentIndex = index;
    this.yearService.setYear(this.getCurrentYear());
    this.pauseAndResumeAutoplay();
  }

  // Get the transform style for the image container
  getTransform(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  // Change the song when a new option is selected
  changeSong(event: Event | number): void {
    if (typeof event === 'number') {
      this.musicService.setCurrentSong(event);
    } else {
      const target = event.target as HTMLSelectElement;
      if (target) {
        this.musicService.setCurrentSong(target.selectedIndex);
      }
    }
  }

  setBackgroundImage = () => {
    const year = this.getCurrentYear();
    if (window.innerWidth <= 900) {
      this.backgroundImage = `assets/carousels/${year}.jpg`;
    } else {
      this.backgroundImage = '';
    }
  }
}