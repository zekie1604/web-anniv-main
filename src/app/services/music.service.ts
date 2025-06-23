import { Injectable } from '@angular/core';

interface Song {
  name: string;
  src: string;
}

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private audioElement!: HTMLAudioElement;
  public currentSongIndex = 0;
  private isInitialized = false;
  private fadeInterval: any;
  private readonly FADE_DURATION = 3000; // 3 seconds fade
  private readonly FADE_STEPS = 30; // Number of steps in the fade
  private hasPlayedOnce = false;
  public userPaused = false;

  // Array of songs
  public readonly songs: Song[] = [
    { name: 'Cup of Joe - Patutunguhan', src: 'assets/Cup of Joe - Patutunguhan.mp3' },
    { name: '@Dilaw  - Uhaw', src: 'assets/@Dilaw  - Uhaw.mp3' },
    { name: 'Adie - Tahanan', src: 'assets/Adie - Tahanan.mp3' },
    { name: 'PALAGI - TJxKZ Version', src: 'assets/PALAGI - TJxKZ Version.mp3' },
    { name: 'NOBITA - IKAW LANG', src: 'assets/NOBITA - IKAW LANG.mp3' },
    { name: 'TJ Monterde- Walong Bilyon', src: 'assets/TJ Monterde- Walong Bilyon.mp3' },
    { name: 'Pamungkas - To the bone', src: 'assets/Pamungkas - To the bone.mp3' },
    { name: 'SunKissed Lola - Pasilyo', src: 'assets/SunKissed Lola - Pasilyo.mp3' },
    { name: 'Ben&Ben - Paninindigan Kita', src: 'assets/Ben&Ben - Paninindigan Kita.mp3' },
    { name: 'Weathering With You - Grand Escape', src: 'assets/Weathering With You - Grand Escape.mp3' },
    { name: 'Mrs. GREEN APPLE - 青と夏', src: 'assets/Mrs. GREEN APPLE - 青と夏.mp3' },
    { name: '10CM Spring Snow-Lovely Runner OST', src: 'assets/10CM \'Spring Snow-Lovely Runner OST.mp3' }
  ];

  constructor() {
    this.initAudio();
  }

  private initAudio(): void {
    if (this.isInitialized) return;

    try {
      this.audioElement = new Audio();
      this.audioElement.src = this.songs[this.currentSongIndex].src;
      this.audioElement.volume = 0; // Start with volume at 0
      
      // Add error handling
      this.audioElement.addEventListener('error', (e) => {
        console.error('Audio error:', e);
      });

      // Add ended event handler
      this.audioElement.addEventListener('ended', () => {
        this.nextSong();
      });

      // Log when audio is ready
      this.audioElement.addEventListener('canplaythrough', () => {
        console.log('Audio is ready to play');
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  }

  public async playWithFade(): Promise<void> {
    if (!this.isInitialized) {
      this.initAudio();
    }

    try {
      if (this.audioElement.paused) {
        // Set initial volume to 0
        this.audioElement.volume = 0;
        
        // Start playing
        await this.audioElement.play();
        console.log('Now playing with fade:', this.songs[this.currentSongIndex].name);
        
        // Clear any existing fade interval
        if (this.fadeInterval) {
          clearInterval(this.fadeInterval);
        }

        // Calculate volume step
        const volumeStep = 1 / this.FADE_STEPS;
        let currentStep = 0;

        // Start fade in
        this.fadeInterval = setInterval(() => {
          if (currentStep < this.FADE_STEPS) {
            this.audioElement.volume = volumeStep * currentStep;
            currentStep++;
          } else {
            // Ensure we end at exactly volume 1
            this.audioElement.volume = 1;
            clearInterval(this.fadeInterval);
          }
        }, this.FADE_DURATION / this.FADE_STEPS);
      }
    } catch (error) {
      console.error('Error playing audio with fade:', error);
    }
  }

  public async fadeOut(): Promise<void> {
    if (!this.isInitialized || this.audioElement.paused) return;

    return new Promise((resolve) => {
      // Clear any existing fade interval
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }

      // Calculate volume step
      const volumeStep = this.audioElement.volume / this.FADE_STEPS;
      let currentVolume = this.audioElement.volume;

      // Start fade out
      this.fadeInterval = setInterval(() => {
        if (currentVolume > 0) {
          currentVolume -= volumeStep;
          this.audioElement.volume = Math.max(0, currentVolume);
        } else {
          this.audioElement.pause();
          this.audioElement.volume = 0;
          clearInterval(this.fadeInterval);
          resolve();
        }
      }, this.FADE_DURATION / this.FADE_STEPS);
    });
  }

  public async play(): Promise<void> {
    this.userPaused = false;
    if (!this.isInitialized) {
      this.initAudio();
    }

    try {
      if (this.audioElement.paused) {
        if (!this.hasPlayedOnce) {
          this.audioElement.volume = 1;
          this.hasPlayedOnce = true;
        }
        await this.audioElement.play();
        console.log('Now playing:', this.songs[this.currentSongIndex].name);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  public pause(): void {
    this.userPaused = true;
    if (this.isInitialized && !this.audioElement.paused) {
      this.audioElement.pause();
      console.log('Paused:', this.songs[this.currentSongIndex].name);
    }
  }

  public async nextSong(): Promise<void> {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    await this.loadAndPlaySong();
  }

  public async prevSong(): Promise<void> {
    this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
    await this.loadAndPlaySong();
  }

  private async loadAndPlaySong(): Promise<void> {
    if (!this.isInitialized) {
      this.initAudio();
    }

    try {
      console.log('Loading song:', this.songs[this.currentSongIndex].name);
      this.audioElement.src = this.songs[this.currentSongIndex].src;
      this.audioElement.load();
      await this.playWithFade(); // Use fade in instead of regular play
    } catch (error) {
      console.error('Error loading and playing song:', error);
    }
  }

  public getCurrentSongName(): string {
    return this.songs[this.currentSongIndex].name;
  }

  public async setCurrentSong(index: number): Promise<void> {
    if (index >= 0 && index < this.songs.length && index !== this.currentSongIndex) {
      // Fade out current song if playing
      if (!this.audioElement.paused) {
        await this.fadeOut();
      }
      
      this.currentSongIndex = index;
      await this.loadAndPlaySong();
    }
  }

  public isPlaying(): boolean {
    return this.isInitialized && !this.audioElement.paused;
  }
}