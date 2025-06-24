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

  videoUrls2021: string[] = [
    'https://www.youtube.com/embed/mG6yEdCVWqM',
    'https://www.youtube.com/embed/JhEI-4gG8Rw',
    'https://www.youtube.com/embed/oPWlGiRT8E4',
    'https://www.youtube.com/embed/Ddwm_3s3fVU'
  ];
  videoUrls2022: string[] = [
    'https://www.youtube.com/embed/0pBM6B-Ka6c',
    'https://www.youtube.com/embed/_U4SkCpk4AQ',
    'https://www.youtube.com/embed/2HPbuSXtTsM',
    'https://www.youtube.com/embed/R5fUCfLMgQo',
    'https://www.youtube.com/embed/Yi3HeMiw7iA',
    'https://www.youtube.com/embed/CxkVfQ_FpSQ',
    'https://www.youtube.com/embed/wgfjS_bbroc',
    'https://www.youtube.com/embed/o8Qpj8N4weo'
  ];
  videoUrls2023: string[] = [
    'https://www.youtube.com/embed/5oqHkjJINmI',
    'https://www.youtube.com/embed/gDyY56N42BQ',
    'https://www.youtube.com/embed/QN9Di7coC6A',
    'https://www.youtube.com/embed/KJ-vMmvYVBc',
    'https://www.youtube.com/embed/pxfgr45CNTA',
    'https://www.youtube.com/embed/kLrMsUcV8IY',
    'https://www.youtube.com/embed/9UKMUZPQz0Q',
    'https://www.youtube.com/embed/nfSIhkra8Do',
    'https://www.youtube.com/embed/g7E2jUTj7iU',
    'https://www.youtube.com/embed/qjmhqX3SMKU',
    'https://www.youtube.com/embed/3sou0j2fRWk',
    'https://www.youtube.com/embed/b72pjE7lK4g',
  ];
  videoUrls2024: string[] = [
    'https://www.youtube.com/embed/lwftpYQS8X0',
    'https://www.youtube.com/embed/5Mu2n4clOSw',
    'https://www.youtube.com/embed/sAsSCSFEzTE',
    'https://www.youtube.com/embed/w_QCmWvoUgU',
    'https://www.youtube.com/embed/bt4sLypHccU',
    'https://www.youtube.com/embed/V6cAxDyMjdY',
  ];

  get videoUrls(): string[] {
    switch (this.currentYear) {
      case '2021': return this.videoUrls2021;
      case '2022': return this.videoUrls2022;
      case '2023': return this.videoUrls2023;
      case '2024': return this.videoUrls2024;
      default: return this.videoUrls2024;
    }
  }

  selectedVideo: string = this.videoUrls2024[0];

  constructor(
    private yearService: YearService,
    private musicService: MusicService
  ) {
    effect(() => {
      const year = this.yearService.getYear()();
      this.currentYear = year;
      this.backgroundImage = `assets/${year}.png`;
      this.mobileBackgroundImage = `assets/backgrounds/${year}.jpg`;
      this.selectedVideo = this.videoUrls[0];
    });
  }

  ngOnInit(): void {
    // Ensure background is set on load
    this.updateBackground();
    // No need to set selectedVideo here, handled by effect
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
    if (this.isMobile()) {
      return this.videoUrls; // On mobile, show all for horizontal scroll
    }
    // On desktop, you can limit or paginate if needed, or just return all
    return this.videoUrls;
  }
}
