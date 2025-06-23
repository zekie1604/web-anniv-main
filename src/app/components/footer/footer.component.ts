import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { BackgroundService } from '../../services/background.service';
import { MusicService } from '../../services/music.service';

interface CountdownEvent {
  name: string;
  date: Date;
  isPast: boolean;
  image: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="relative py-8 transition-all duration-500" 
            [style.background]="'rgba(' + style().color + ')'" 
            [style.backdrop-filter]="'blur(' + style().blur + ')'"
            [style.border-top]="'1px solid ' + style().borderColor">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Daily 4:44 PM Countdown - Left Side -->
          <div class="md:w-1/3 flex items-center justify-center relative">
            <div class="text-center">
              <h3 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-serif tracking-wide transition-colors duration-500"
                  [style.color]="style().accentColor">
                4:44 PM
              </h3>
              <div class="countdown-container transition-all duration-500"
                   [style.border-color]="style().borderColor"
                   [style.background]="'rgba(' + style().color + ', 0.5)'">
                <p class="text-2xl md:text-3xl lg:text-4xl font-light font-mono tracking-wider transition-colors duration-500"
                   [style.color]="style().textColor">
                  {{ dailyCountdown }}
                </p>
              </div>
              <!-- Hearts Container -->
              <div class="hearts-container" *ngIf="showHearts">
                <div *ngFor="let heart of hearts" 
                     class="heart"
                     [style.left]="heart.left + '%'"
                     [style.animation-delay]="heart.delay + 's'">
                  ❤️
                </div>
              </div>
            </div>
          </div>

          <!-- Special Days Countdown - Right Side -->
          <div class="md:w-2/3">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div *ngFor="let event of events" 
                   class="text-center p-4 rounded-xl transition-all duration-500 backdrop-blur-sm border hover:scale-105"
                   [style.background]="'rgba(' + style().color + ', 0.5)'"
                   [style.border-color]="style().borderColor">
                <div class="mb-3 h-24 w-24 mx-auto rounded-full overflow-hidden transition-all duration-500"
                     [style.background]="'rgba(' + style().color + ', 0.3)'"
                     [style.border]="'2px solid ' + style().accentColor">
                  <img *ngIf="event.image" 
                       [src]="event.image" 
                       [alt]="event.name"
                       class="w-full h-full object-cover hover:scale-110 transition-transform duration-300">
                </div>
                <h3 class="text-lg font-medium mb-1 font-serif tracking-wide transition-colors duration-500"
                    [style.color]="style().textColor">
                  {{ event.name }}
                </h3>
                <p class="text-sm mb-2 font-light transition-colors duration-500"
                   [style.color]="style().accentColor">
                  {{ formatDate(event.date) }}
                </p>
                <p *ngIf="!event.isPast" class="text-sm font-mono tracking-wide transition-colors duration-500"
                   [style.color]="style().accentColor">
                  {{ getCountdown(event.date) }}
                </p>
                <p *ngIf="event.isPast" class="text-sm font-light italic transition-colors duration-500"
                   [style.color]="style().textColor + '80'">
                  Already passed this year
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-8 text-sm font-light tracking-wide transition-colors duration-500"
             [style.color]="style().textColor + '80'">
          &copy; {{ currentYear }} Labidabs. All rights reserved.
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .container {
      max-width: 1400px;
    }

    .countdown-container {
      background: rgba(255, 255, 255, 0.05);
      padding: 1.5rem;
      border-radius: 1.5rem;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;
    }

    .hearts-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .heart {
      position: absolute;
      bottom: 0;
      font-size: 1.5rem;
      animation: float-up 3s ease-in forwards;
      opacity: 0;
    }

    @keyframes float-up {
      0% {
        transform: translateY(0) scale(0.5);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-200px) scale(1.5) rotate(360deg);
        opacity: 0;
      }
    }

    /* Add custom font classes */
    .font-serif {
      font-family: 'Playfair Display', serif;
    }

    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }

    .font-light {
      font-weight: 300;
    }

    .font-medium {
      font-weight: 500;
    }
  `]
})
export class FooterComponent implements OnInit, OnDestroy {
  events: CountdownEvent[] = [
    {
      name: 'Anniversary',
      date: new Date(new Date().getFullYear(), 5, 25), // June 25
      isPast: false,
      image: 'assets/Anniversary.png'
    },
    {
      name: "Bestfriend's Day",
      date: new Date(new Date().getFullYear(), 8, 25), // September 25
      isPast: false,
      image: 'assets/best-friends-vector.jpg'
    },
    {
      name: "Chelle's Birthday",
      date: new Date(new Date().getFullYear(), 10, 4), // November 4
      isPast: false,
      image: 'assets/chellechib.jpg'
    },
    {
      name: "Zekie's Birthday",
      date: new Date(new Date().getFullYear(), 1, 16), // February 16
      isPast: false,
      image: 'assets/zekechib.jpg'
    }
  ];

  currentYear = new Date().getFullYear();
  dailyCountdown = '';
  private subscription: Subscription = new Subscription();
  public style: any;
  showHearts = false;
  hearts: { left: number; delay: number }[] = [];
  private heartsTimeout: any;

  constructor(
    private backgroundService: BackgroundService,
    private musicService: MusicService
  ) {
    // Subscribe to route changes to update background
    effect(() => {
      const currentRoute = window.location.pathname;
      const newStyle = this.backgroundService.getStyleForRoute(currentRoute);
      this.backgroundService.setBackgroundStyle(newStyle);
    });
  }

  ngOnInit() {
    // Initialize the style signal
    this.style = this.backgroundService.getBackgroundStyle();

    // Update countdown every second
    this.subscription = interval(1000).subscribe(() => {
      this.updateCountdowns();
    });

    // Check for 4:44 PM every minute
    this.subscription.add(
      interval(60000).subscribe(() => {
        this.checkFor444();
      })
    );

    // Initial update
    this.updateCountdowns();
    const initialStyle = this.backgroundService.getStyleForRoute(window.location.pathname);
    this.backgroundService.setBackgroundStyle(initialStyle);

    // Initial check
    this.checkFor444();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.heartsTimeout) {
      clearTimeout(this.heartsTimeout);
    }
  }

  private updateCountdowns() {
    const now = new Date();

    // Update special days
    this.events = this.events.map(event => ({
      ...event,
      isPast: now > event.date
    }));

    // Update daily 4:44 PM countdown
    const target = new Date();
    target.setHours(16, 44, 0, 0);
    
    if (now > target) {
      target.setDate(target.getDate() + 1);
    }

    this.dailyCountdown = this.getCountdown(target);
  }

  formatDate(date: Date): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }

  getCountdown(targetDate: Date): string {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      return '';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  private checkFor444() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (hours === 16 && minutes === 44) {
      this.triggerHeartsExplosion();
      this.showNotification();
      this.playPaninindiganKita();
    }
  }

  private triggerHeartsExplosion() {
    // Clear any existing hearts
    this.showHearts = false;
    this.hearts = [];

    // Generate 20 hearts with random positions and delays
    for (let i = 0; i < 20; i++) {
      this.hearts.push({
        left: Math.random() * 80 + 10, // Random position between 10% and 90%
        delay: Math.random() * 2 // Random delay between 0 and 2 seconds
      });
    }

    // Show hearts
    this.showHearts = true;

    // Hide hearts after animation
    if (this.heartsTimeout) {
      clearTimeout(this.heartsTimeout);
    }
    this.heartsTimeout = setTimeout(() => {
      this.showHearts = false;
    }, 5000);
  }

  private showNotification() {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return;
    }

    // Request permission if needed
    if (Notification.permission === "granted") {
      this.createNotification();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          this.createNotification();
        }
      });
    }
  }

  private createNotification() {
    const notification = new Notification("4:44 PM", {
      body: "It's our special time! ❤️",
      icon: "assets/favicon.ico",
      badge: "assets/favicon.ico"
    });

    // Play a gentle sound if available
    const audio = new Audio('assets/notification.mp3');
    audio.play().catch(() => {
      // Ignore errors if sound can't be played
    });

    // Close notification after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  }

  private async playPaninindiganKita() {
    // Find the index of Paninindigan Kita in the songs array
    const paninindiganIndex = this.musicService.songs.findIndex(
      song => song.name === 'Ben&Ben - Paninindigan Kita'
    );

    if (paninindiganIndex !== -1) {
      // Fade out any currently playing music
      if (this.musicService.isPlaying()) {
        await this.musicService.fadeOut();
      }
      
      // Set and play Paninindigan Kita with fade
      await this.musicService.setCurrentSong(paninindiganIndex);
      await this.musicService.playWithFade();
    }
  }
} 