import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  private static readonly STORAGE_KEY = 'selectedYear';
  private currentYear = signal<string>(YearService.getInitialYear());

  private static getInitialYear(): string {
    return localStorage.getItem(YearService.STORAGE_KEY) || '2024';
  }

  setYear(year: string) {
    this.currentYear.set(year);
    localStorage.setItem(YearService.STORAGE_KEY, year);
  }

  getYear() {
    return this.currentYear;
  }
} 