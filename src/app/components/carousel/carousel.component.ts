import { NgFor, NgStyle } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, effect } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
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
  private readonly router = inject(Router);
  private routerSubscription: any;

  // Array of image paths
  public images = [
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
  noTransition = true; // Start with no transition
  backgroundImage = '';
  private transitionsEnabled = false; // Flag to track if transitions should be enabled
  private firstRender = true; // Prevent transition on first render
  public transitionEnabled = false;

  constructor() {
    effect(() => {
      const currentYear = this.yearService.getYear();
      const idx = this.images.findIndex(img => img.includes(currentYear()));
      if (idx !== -1 && idx !== this.currentIndex) {
        this.noTransition = true;
        this.currentIndex = idx;
        this.transitionEnabled = false;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.transitionEnabled = true;
            this.noTransition = false;
          });
        });
      }
      this.setBackgroundImage();
    });
  }

  private forceReflow(callback: () => void) {
    requestAnimationFrame(() => {
      requestAnimationFrame(callback);
    });
  }

  ngOnInit(): void {
    // Restore carousel index based on the last selected year
    const lastYear = this.yearService.getYear()();
    let idx = this.images.findIndex(img => img.includes(lastYear));
    if (idx === -1) {
      idx = 0;
      this.yearService.setYear(this.getCurrentYear());
    }
    this.transitionEnabled = false;
    this.noTransition = true;
    this.currentIndex = idx;
    this.setBackgroundImage();
    this.preloadBackgroundImages();
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.transitionEnabled = true;
        this.noTransition = false;
        this.transitionsEnabled = true;
        this.firstRender = false;
      });
    });

    // Check for passcode login flag to start autoplay after login
    if (sessionStorage.getItem('startCarouselAutoplay') === 'true') {
      this.startAutoplay(this.RESUME_DELAY);
      sessionStorage.removeItem('startCarouselAutoplay');
    }
    console.log('Carousel ngOnInit called');
    this.startAutoplay(this.RESUME_DELAY); // Always start autoplay after 5s
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/home') {
          console.log('NavigationEnd to /home, forcing autoplay');
          this.startAutoplay(this.RESUME_DELAY);
        }
      }
    });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('resize', this.setBackgroundImage);
  }

  ngOnDestroy(): void {
    this.clearAutoplay();
    this.clearResumeTimeout();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('resize', this.setBackgroundImage);
  }

  private handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      this.clearAutoplay();
      this.clearResumeTimeout();
    } else if (document.visibilityState === 'visible') {
      this.startAutoplay(this.RESUME_DELAY);
    }
  };

  private startAutoplay(delay = 0): void {
    this.clearAutoplay();
    this.clearResumeTimeout();
    this.resumeTimeout = setTimeout(() => {
      this.nextImage(false); // Immediately advance after delay
      this.autoplayInterval = setInterval(() => {
        this.nextImage(false);
      }, this.AUTOPLAY_DELAY);
    }, delay);
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
    this.startAutoplay(this.RESUME_DELAY);
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
      // Instantly jump to last image, no transition
      this.transitionEnabled = false;
      this.noTransition = true;
      this.currentIndex = this.images.length - 1;
      this.yearService.setYear(this.getCurrentYear());
      this.setBackgroundImage();
      setTimeout(() => {
        this.transitionEnabled = true;
        this.noTransition = false;
      }, 20);
    } else {
      this.transitionEnabled = true;
      this.noTransition = false;
      this.currentIndex = this.currentIndex - 1;
      this.yearService.setYear(this.getCurrentYear());
      this.setBackgroundImage();
    }
    if (user) this.pauseAndResumeAutoplay();
  }

  // Move to the next image
  nextImage(user = true): void {
    if (this.currentIndex === this.images.length - 1) {
      // Instantly jump to first image, no transition
      this.transitionEnabled = false;
      this.noTransition = true;
      this.currentIndex = 0;
      this.yearService.setYear(this.getCurrentYear());
      this.setBackgroundImage();
      setTimeout(() => {
        this.transitionEnabled = true;
        this.noTransition = false;
      }, 20);
    } else {
      this.transitionEnabled = true;
      this.noTransition = false;
      this.currentIndex = this.currentIndex + 1;
      this.yearService.setYear(this.getCurrentYear());
      this.setBackgroundImage();
    }
    if (user) this.pauseAndResumeAutoplay();
  }

  // Go to a specific image
  goToImage(index: number): void {
    this.transitionEnabled = true;
    this.noTransition = false;
    this.currentIndex = index;
    this.yearService.setYear(this.getCurrentYear());
    this.setBackgroundImage();
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

  private preloadBackgroundImages(): void {
    const years = ['2021', '2022', '2023', '2024'];
    years.forEach(year => {
      const img = new Image();
      img.src = `assets/carousels/${year}.jpg`;
    });
  }
}