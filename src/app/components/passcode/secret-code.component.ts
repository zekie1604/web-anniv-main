import { Component, OnInit } from '@angular/core';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../services/music.service';

@Component({
  selector: 'app-secret-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './secret-code.component.html',
  styleUrl: './secret-code.component.scss'
})
export class SecretCodeComponent implements OnInit {
  private readonly correctCode = '0625';
  readonly inputCode = signal('');
  readonly error = signal('');

  constructor(private readonly router: Router, private readonly musicService: MusicService) {}

  ngOnInit(): void {
    if (sessionStorage.getItem('isAuthenticated') === 'true') {
      this.router.navigate(['/home']);
    }
  }

  onKeyPress(key: string): void {
    if (key === 'clear') {
      this.inputCode.set('');
      this.error.set('');
      return;
    }
    if (key === 'enter') {
      if (this.inputCode() === this.correctCode) {
        sessionStorage.setItem('isAuthenticated', 'true');
        const randomIndex = Math.floor(Math.random() * this.musicService.songs.length);
        this.musicService.setCurrentSong(randomIndex).then(() => {
          this.musicService.play();
        });
        this.router.navigate(['/home']);
      } else {
        this.error.set('Incorrect code. Try again!');
        this.inputCode.set('');
      }
      return;
    }
    if (/^[0-9]$/.test(key)) {
      if (this.inputCode().length < 4) {
        this.inputCode.set(this.inputCode() + key);
        this.error.set('');
      }
    }
  }
}
