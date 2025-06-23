import { Injectable, signal } from '@angular/core';

interface BackgroundStyle {
  color: string;
  blur: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  private backgroundStyle = signal<BackgroundStyle>({
    color: '0, 0, 0, 0.3',
    blur: '8px',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    textColor: 'rgba(255, 255, 255, 1)',
    accentColor: 'rgba(255, 255, 255, 1)'
  });

  constructor() {}

  setBackgroundStyle(style: Partial<BackgroundStyle>) {
    this.backgroundStyle.update(current => ({
      ...current,
      ...style
    }));
  }

  getBackgroundStyle() {
    return this.backgroundStyle;
  }

  // Monochromatic styles with white text
  getStyleForRoute(route: string): BackgroundStyle {
    switch (route) {
      case '/photos':
        return {
          color: '0, 0, 0, 0.85', // black
          blur: '12px',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          textColor: 'rgba(255, 255, 255, 1)',
          accentColor: 'rgba(255, 255, 255, 1)'
        };
      case '/videos':
        return {
          color: '17, 24, 39, 0.85', // gray-900
          blur: '10px',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          textColor: 'rgba(255, 255, 255, 1)',
          accentColor: 'rgba(255, 255, 255, 1)'
        };
      case '/chatbot':
        return {
          color: '31, 41, 55, 0.85', // gray-800
          blur: '8px',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          textColor: 'rgba(255, 255, 255, 1)',
          accentColor: 'rgba(255, 255, 255, 1)'
        };
      case '/timeline':
        return {
          color: '55, 65, 81, 0.85', // gray-700
          blur: '10px',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          textColor: 'rgba(255, 255, 255, 1)',
          accentColor: 'rgba(255, 255, 255, 1)'
        };
      case '/music':
        return {
          color: '55, 65, 81, 0.85', // gray-700
          blur: '10px',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          textColor: 'rgba(255, 255, 255, 1)',
          accentColor: 'rgba(255, 255, 255, 1)'
        };
      default:
        return {
          color: '75, 85, 99, 0.85', // gray-600
          blur: '8px',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          textColor: 'rgba(255, 255, 255, 1)',
          accentColor: 'rgba(255, 255, 255, 1)'
        };
    }
  }
} 