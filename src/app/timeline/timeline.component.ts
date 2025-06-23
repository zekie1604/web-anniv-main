import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { YearService } from '../services/year.service';

interface TimelineEvent {
  id: number;
  image: string;
  title: string;
  description: string;
  date: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent {
  backgroundImage = '';
  currentYear = '';
  currentIndex = 1;

  // Timeline events with 12 slots (you can add actual images and content later)
  timelineEvents: TimelineEvent[] = [
    { id: 0, image: '', title: 'Coming Soon!', description: '', date: 'Future' },
    { id: 14, image: 'assets/timeline/14.jpg', title: 'Third Anniversary', description: '', date: 'June 2025' },
    { id: 13, image: 'assets/timeline/13.jpg', title: '5th Valentine\'s Date', description: '', date: 'February 2025' },
    { id: 12, image: 'assets/timeline/12.jpg', title: 'Chelle\'s Birthday', description: '', date: 'November 2024' },
    { id: 11, image: 'assets/timeline/11.jpg', title: 'Second Anniversary', description: '', date: 'June 2024' },
    { id: 10, image: 'assets/timeline/10.jpg', title: '4th Valentine\'s Day Date', description: '', date: 'February 2024' },
    { id: 9, image: 'assets/timeline/09.jpg', title: 'Chelle\'s Birthday', description: '', date: 'November 2023' },
    { id: 8, image: 'assets/timeline/8.jpg', title: 'First Anniversary', description: '', date: 'June 2023' },
    { id: 7, image: 'assets/timeline/7.jpg', title: '3rd Valentine\'s Day Date', description: '', date: 'February 2023' },
    { id: 6, image: 'assets/timeline/6.jpg', title: 'Chelle\'s Birthday', description: '', date: 'November 2022' },
    { id: 5, image: 'assets/timeline/5.jpg', title: 'First Official Date', description: '', date: 'June 2022' },
    { id: 4, image: 'assets/timeline/4.jpg', title: '2nd Valentine\'s Day Date', description: '', date: 'February 2022' },
    { id: 3, image: 'assets/timeline/3.jpg', title: 'Chelle\'s Birthday', description: '', date: 'November 2021' },
    { id: 2, image: 'assets/timeline/2.jpg', title: 'First Date', description: '', date: 'July 2021' },
    { id: 1, image: 'assets/timeline/1.jpg', title: '1st Valentines as BFF', description: '', date: 'February 2021' }
  ];

  constructor(
    private route: ActivatedRoute,
    private yearService: YearService
  ) {
    effect(() => {
      const year = this.yearService.getYear()();
      this.currentYear = year;
      this.backgroundImage = `assets/${year}.png`;
    });
  }

  getBackgroundSize(): string {
    return this.currentYear === '2022' ? '250% auto' : '200% auto';
  }

  // Get the three visible events (left, center, right)
  getVisibleEvents(): TimelineEvent[] {
    const events = [];
    
    // Left event (previous)
    if (this.currentIndex > 0) {
      events.push(this.timelineEvents[this.currentIndex - 1]);
    } else {
      // If at the first event (Coming Soon!), don't show a previous event
      events.push(this.timelineEvents[0]);
    }
    
    // Center event (current)
    events.push(this.timelineEvents[this.currentIndex]);
    
    // Right event (next)
    if (this.currentIndex < this.timelineEvents.length - 1) {
      events.push(this.timelineEvents[this.currentIndex + 1]);
    } else {
      // If at the last event, don't show a next event
      events.push(this.timelineEvents[this.currentIndex]);
    }
    
    return events;
  }

  // Navigate to a specific event
  goToEvent(index: number): void {
    this.currentIndex = index;
  }

  // Navigate to previous event
  previousEvent(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    // Don't allow going beyond the Coming Soon! event (index 0)
  }

  // Navigate to next event
  nextEvent(): void {
    if (this.currentIndex < this.timelineEvents.length - 1) {
      this.currentIndex++;
    }
    // Don't allow going beyond the last event (index 14)
  }

  // Get current event
  getCurrentEvent(): TimelineEvent {
    return this.timelineEvents[this.currentIndex];
  }
} 