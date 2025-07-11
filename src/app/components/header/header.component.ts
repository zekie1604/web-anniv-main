import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { YearService } from '../../services/year.service';
import { inject } from '@angular/core';

  @Component({
    selector: 'app-header',
    standalone: true,
  imports: [RouterModule, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
  })
  export class HeaderComponent {
  showNews = false;
  showGames = false;
  showMobileMenu = false;

  @ViewChild('headerRef', { static: true }) headerRef!: ElementRef;

  public yearService = inject(YearService);

  constructor(
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showGames = false;
        this.showNews = false;
        this.showMobileMenu = false;
      }
    });
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    this.showGames = false;
    this.showNews = false;
  }

  navigateToMemoryGame() {
    this.showGames = false;
    this.showMobileMenu = false;
    this.router.navigate(['/memory-game']);
  }

  navigateToTimeline() {
    const currentYear = this.yearService.getYear()();
    this.showMobileMenu = false;
    this.router.navigate(['/timeline', currentYear]);
  }

  navigateToHome() {
    const currentYear = this.yearService.getYear()();
    this.showMobileMenu = false;
    this.router.navigate(['/home']);
    this.yearService.setYear(currentYear);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.headerRef?.nativeElement.contains(target)) {
      this.showNews = false;
      this.showGames = false;
      this.showMobileMenu = false;
    }
  }
  }
