import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  private currentYear = signal<string>('2024');

  setYear(year: string) {
    this.currentYear.set(year);
  }

  getYear() {
    return this.currentYear;
  }
} 