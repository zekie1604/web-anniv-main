import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { MusicControlComponent } from './components/music-control.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, MusicControlComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'labidabs';
  private readonly router = inject(Router);

  isPasscodePage(): boolean {
    // Only hide header on the root path (passcode page)
    return this.router.url === '/' || this.router.url === '';
  }
}