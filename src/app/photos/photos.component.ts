import { Component, OnInit, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { YearService } from '../services/year.service';

@Component({
  selector: 'app-photos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  // List of all images with associated tags
  allImages: { src: string; tags: string[] }[] = [];
  filteredImages: { src: string; tags: string[] }[] = [];

  // Search term bound to the input field
  searchTerm: string = '';

  // Folder name extracted from the route
  folderName: string = '';

  // Background image URLs for different screen sizes
  backgroundImage: string = '';
  mobileBackgroundImage: string = '';

  // State for showing the full-size image
  showFullImage: boolean = false;
  fullImageSrc: string = '';

  // Base URL for assets
  private baseUrl: string = window.location.origin;

  currentYear = '';

  constructor(
    private route: ActivatedRoute,
    private yearService: YearService
  ) {
    // Create an effect to update the background image when the year changes
    effect(() => {
      const year = this.yearService.getYear()();
      this.currentYear = year;
      this.backgroundImage = `assets/${year}.png`;
      this.mobileBackgroundImage = `assets/backgrounds/${year}.jpg`;
    });
  }

  // Helper method to get absolute URL for images
  getImageUrl(relativePath: string): string {
    return `${this.baseUrl}/${relativePath}`;
  }

  // Helper method to get the appropriate background image based on screen size
  getBackgroundImage(): string {
    if (window.innerWidth <= 768) {
      return this.mobileBackgroundImage;
    }
    return this.backgroundImage;
  }

  // Helper method to check if we're on mobile/small screen
  isMobileScreen(): boolean {
    return window.innerWidth <= 768;
  }

  ngOnInit(): void {
    // Extract folder name and background image from the route parameters and state
    this.route.params.subscribe((params) => {
      this.folderName = params['folderName']; // Get the folder name
      this.loadImagesForFolder(this.folderName); // Load images for the folder
    });
  }

  // Listen for window resize events to update background
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Trigger change detection to update background
    // The getBackgroundImage() method will be called again with the new window size
  }

  // Load images dynamically based on the folder name
  loadImagesForFolder(folderName: string): void {
    // Example: Map folder names to image data
    const folderImages: { [key: string]: { src: string; tags: string[] }[] } = {
      '2021': [
        { src: this.getImageUrl('assets/2021/01.jpg'), tags: ['couple', 'valentines', 'pre-confession'] },
        { src: this.getImageUrl('assets/2021/02.jpg'), tags: ['couple', 'valentines', 'pre-confession'] },
        { src: this.getImageUrl('assets/2021/03.jpg'), tags: ['couple', 'first-date'] },
        { src: this.getImageUrl('assets/2021/04.jpg'), tags: ['couple', 'first-date'] },
        { src: this.getImageUrl('assets/2021/05.jpg'), tags: ['couple', 'first-date'] },
        { src: this.getImageUrl('assets/2021/06.jpg'), tags: ['couple', 'pre-confession'] },
        { src: this.getImageUrl('assets/2021/07.jpg'), tags: ['couple', 'pre-confession'] },
        { src: this.getImageUrl('assets/2021/08.jpg'), tags: ['couple', 'pre-confession'] },
        { src: this.getImageUrl('assets/2021/09.jpg'), tags: ['couple', 'pre-confession', 'group'] },
        { src: this.getImageUrl('assets/2021/10.jpg'), tags: ['couple', 'group'] },
        { src: this.getImageUrl('assets/2021/11.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/12.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/13.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/14.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/15.jpg'), tags: ['zekie', 'date'] },
        { src: this.getImageUrl('assets/2021/16.jpg'), tags: ['zekie', 'date'] },
        { src: this.getImageUrl('assets/2021/17.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/18.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/19.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/20.jpg'), tags: ['couple', 'video-call'] },
        { src: this.getImageUrl('assets/2021/21.jpg'), tags: ['couple', 'video-call'] },
        { src: this.getImageUrl('assets/2021/22.jpg'), tags: ['zekie'] },
        { src: this.getImageUrl('assets/2021/23.jpg'), tags: ['chelle'] },
        { src: this.getImageUrl('assets/2021/24.jpg'), tags: ['chelle'] },
        { src: this.getImageUrl('assets/2021/25.jpg'), tags: ['chelle'] },
        { src: this.getImageUrl('assets/2021/26.jpg'), tags: ['chelle'] },
        { src: this.getImageUrl('assets/2021/27.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/28.jpg'), tags: ['couple', 'video-call'] },
        { src: this.getImageUrl('assets/2021/29.jpg'), tags: ['couple', 'video-call'] },
        { src: this.getImageUrl('assets/2021/30.jpg'), tags: ['couple', 'video-call'] },
        { src: this.getImageUrl('assets/2021/31.jpg'), tags: ['zekie'] },
        { src: this.getImageUrl('assets/2021/32.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/33.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/34.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/35.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/36.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/37.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/38.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/39.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2021/40.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2021/41.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/42.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/43.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/44.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/45.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/46.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/47.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/48.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2021/49.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2021/50.jpg'), tags: ['couple'] },
        { src: this.getImageUrl('assets/2021/51.jpg'), tags: ['couple'] },
        { src: this.getImageUrl('assets/2021/52.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2021/53.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2021/54.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2021/55.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2021/56.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/57.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/58.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2021/59.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2021/60.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2021/61.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2021/62.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/63.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2021/64.jpg'), tags: ['zekie', 'date'] },
        { src: this.getImageUrl('assets/2021/65.jpg'), tags: ['zekie', 'date'] },
        { src: this.getImageUrl('assets/2021/66.jpg'), tags: ['chelle', 'date'] },
        { src: this.getImageUrl('assets/2021/67.jpg'), tags: ['chelle', 'date'] }
      ],
      '2022': [
        { src: this.getImageUrl('assets/2022/001.jpg'), tags: ['couple', 'anniversary'] },
        { src: this.getImageUrl('assets/2022/002.jpg'), tags: ['couple', 'anniversary'] },
        { src: this.getImageUrl('assets/2022/003.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2022/004.jpg'), tags: ['group'] },
        { src: this.getImageUrl('assets/2022/005.jpg'), tags: ['couple'] },
        { src: this.getImageUrl('assets/2022/006.jpg'), tags: ['couple', 'group', 'family'] },
        { src: this.getImageUrl('assets/2022/007.jpg'), tags: ['couple'] },
        { src: this.getImageUrl('assets/2022/008.jpg'), tags: ['zekie'] },
        { src: this.getImageUrl('assets/2022/009.jpg'), tags: ['couple', 'group', 'family'] },
        { src: this.getImageUrl('assets/2022/010.jpg'), tags: ['couple', 'group', 'family'] },
        { src: this.getImageUrl('assets/2022/011.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/012.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/013.jpg'), tags: ['couple', 'valentines'] },
        { src: this.getImageUrl('assets/2022/014.jpg'), tags: ['couple', 'valentines'] },
        { src: this.getImageUrl('assets/2022/015.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/016.jpg'), tags: ['couple', 'birthday'] },
        { src: this.getImageUrl('assets/2022/017.jpg'), tags: ['couple', 'birthday'] },
        { src: this.getImageUrl('assets/2022/018.jpg'), tags: ['couple', 'group', 'birthday'] },
        { src: this.getImageUrl('assets/2022/019.jpg'), tags: ['couple', 'birthday'] },
        { src: this.getImageUrl('assets/2022/020.jpg'), tags: ['group', 'birthday'] },
        { src: this.getImageUrl('assets/2022/021.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2022/022.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2022/023.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2022/024.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2022/025.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2022/026.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/027.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/028.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/029.jpg'), tags: ['zekie', 'date'] },
        { src: this.getImageUrl('assets/2022/030.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/031.jpg'), tags: ['couple', 'valentines'] },
        { src: this.getImageUrl('assets/2022/032.jpg'), tags: ['couple', 'valentines'] },
        { src: this.getImageUrl('assets/2022/033.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/034.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/035.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/036.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/037.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/038.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/039.jpg'), tags: ['couple', 'pic'] },
        { src: this.getImageUrl('assets/2022/040.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/041.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/042.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/043.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/044.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/045.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/046.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/047.jpg'), tags: ['couple', 'anniversary', 'date'] },
        { src: this.getImageUrl('assets/2022/048.jpg'), tags: ['couple', 'date', 'anniversary'] },
        { src: this.getImageUrl('assets/2022/049.jpg'), tags: ['zekie', 'arcade', 'anniversary'] },
        { src: this.getImageUrl('assets/2022/050.jpg'), tags: ['zekie', 'arcade', 'anniversary'] },
        { src: this.getImageUrl('assets/2022/051.jpg'), tags: ['couple', 'date', 'anniversary'] },
        { src: this.getImageUrl('assets/2022/052.jpg'), tags: ['couple', 'date', 'anniversary'] },
        { src: this.getImageUrl('assets/2022/053.jpg'), tags: ['couple', 'date', 'anniversary'] },
        { src: this.getImageUrl('assets/2022/054.jpg'), tags: ['couple', 'arcade', 'anniversary'] },
        { src: this.getImageUrl('assets/2022/055.jpg'), tags: ['couple', 'arcade', 'anniversary'] },
        { src: this.getImageUrl('assets/2022/056.jpg'), tags: ['anniversary'] },
        { src: this.getImageUrl('assets/2022/057.jpg'), tags: ['couple', 'anniversary'] },
        { src: this.getImageUrl('assets/2022/058.jpg'), tags: ['couple', 'anniversary'] },
        { src: this.getImageUrl('assets/2022/059.jpg'), tags: ['couple', 'anniversary', 'date'] },
        { src: this.getImageUrl('assets/2022/060.jpg'), tags: ['couple', 'anniversary', 'date'] },
        { src: this.getImageUrl('assets/2022/061.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/062.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/063.jpg'), tags: ['group', 'date'] },
        { src: this.getImageUrl('assets/2022/064.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/065.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/066.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/067.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/068.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/069.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/070.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/071.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/072.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/073.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/074.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/075.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/076.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/077.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/078.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/079.jpg'), tags: ['group', 'date'] },
        { src: this.getImageUrl('assets/2022/080.jpg'), tags: ['group', 'date'] },
        { src: this.getImageUrl('assets/2022/081.jpg'), tags: ['group', 'date'] },
        { src: this.getImageUrl('assets/2022/082.jpg'), tags: ['couple'] },
        { src: this.getImageUrl('assets/2022/083.jpg'), tags: ['couple'] },
        { src: this.getImageUrl('assets/2022/084.jpg'), tags: ['couple'] },
        { src: this.getImageUrl('assets/2022/085.jpg'), tags: ['couple'] },
        { src: this.getImageUrl('assets/2022/086.jpg'), tags: ['couple'] },
        { src: this.getImageUrl('assets/2022/087.jpg'), tags: ['zekie'] },
        { src: this.getImageUrl('assets/2022/088.jpg'), tags: ['chelle'] },
        { src: this.getImageUrl('assets/2022/089.jpg'), tags: ['couple'] },
        { src: this.getImageUrl('assets/2022/090.jpg'), tags: ['couple'] },
        { src: this.getImageUrl('assets/2022/091.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/092.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/093.jpg'), tags: ['food', 'date'] },
        { src: this.getImageUrl('assets/2022/094.jpg'), tags: ['food', 'date'] },
        { src: this.getImageUrl('assets/2022/095.jpg'), tags: ['group', 'date'] },
        { src: this.getImageUrl('assets/2022/096.jpg'), tags: ['group', 'date'] },
        { src: this.getImageUrl('assets/2022/097.jpg'), tags: ['zekie', 'date'] },
        { src: this.getImageUrl('assets/2022/098.jpg'), tags: ['food', 'date'] },
        { src: this.getImageUrl('assets/2022/099.jpg'), tags: ['kyoto', 'date'] },
        { src: this.getImageUrl('assets/2022/100.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/101.jpg'), tags: ['group', 'date'] },
        { src: this.getImageUrl('assets/2022/102.jpg'), tags: ['group', 'date'] },
        { src: this.getImageUrl('assets/2022/103.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/104.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/105.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/106.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/107.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/108.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/109.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/110.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/111.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/112.jpg'), tags: ['couple', 'date'] },
        { src: this.getImageUrl('assets/2022/113.jpg'), tags: ['couple', 'valentines'] },
        { src: this.getImageUrl('assets/2022/114.jpg'), tags: ['couple', 'valentines'] },
        { src: this.getImageUrl('assets/2022/115.jpg'), tags: ['zekie', 'birthday'] },
        { src: this.getImageUrl('assets/2022/116.jpg'), tags: ['couple', 'birthday'] },
      ],
      '2023': [
        { src: this.getImageUrl('assets/2023/001.jpg'), tags: ['date', 'couple', 'Valentines'] },
        { src: this.getImageUrl('assets/2023/002.jpg'), tags: ['date', 'couple', ] },
        { src: this.getImageUrl('assets/2023/003.jpg'), tags: ['date', 'couple', 'Valentines'] },
        { src: this.getImageUrl('assets/2023/004.jpg'), tags: ['zekie', 'Museum', ] },
        { src: this.getImageUrl('assets/2023/005.jpg'), tags: ['viewpoint', 'Museum'] },
        { src: this.getImageUrl('assets/2023/006.jpg'), tags: ['zekie', 'museum'] },
        { src: this.getImageUrl('assets/2023/007.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/008.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/009.jpg'), tags: ['viewpoint', 'museum'] },
        { src: this.getImageUrl('assets/2023/010.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/011.jpg'), tags: ['viewpoint', 'museum'] },
        { src: this.getImageUrl('assets/2023/012.jpg'), tags: ['zekie', 'museum'] },
        { src: this.getImageUrl('assets/2023/013.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/014.jpg'), tags: ['zekie', 'Valentines'] },
        { src: this.getImageUrl('assets/2023/015.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/016.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/017.jpg'), tags: ['couple', 'Manila'] },
        { src: this.getImageUrl('assets/2023/018.jpg'), tags: ['couple', 'Manila'] },
        { src: this.getImageUrl('assets/2023/019.jpg'), tags: ['couple', 'Manila'] },
        { src: this.getImageUrl('assets/2023/020.jpg'), tags: ['couple', 'Manila'] },
        { src: this.getImageUrl('assets/2023/021.jpg'), tags: ['couple', 'museum'] },
        { src: this.getImageUrl('assets/2023/022.jpg'), tags: ['couple', 'museum'] },
        { src: this.getImageUrl('assets/2023/023.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/024.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/025.jpg'), tags: ['chelle', 'Valentines'] },
        { src: this.getImageUrl('assets/2023/026.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/027.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/028.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/029.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/030.jpg'), tags: ['zekie', 'museum'] },
        { src: this.getImageUrl('assets/2023/031.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/032.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/033.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/034.jpg'), tags: ['chelle', 'museum'] },
        { src: this.getImageUrl('assets/2023/035.jpg'), tags: ['couple', 'museum'] },
        { src: this.getImageUrl('assets/2023/036.jpg'), tags: ['chelle', 'Valentines'] },
        { src: this.getImageUrl('assets/2023/037.jpg'), tags: ['museum', 'couple'] },
        { src: this.getImageUrl('assets/2023/038.jpg'), tags: ['Manila', 'viewpoint'] },
        { src: this.getImageUrl('assets/2023/039.jpg'), tags: ['Manila', 'couple'] },
        { src: this.getImageUrl('assets/2023/040.jpg'), tags: ['Manila', 'couple'] },
        { src: this.getImageUrl('assets/2023/041.jpg'), tags: ['Manila', 'chelle', 'birthday'] },
        { src: this.getImageUrl('assets/2023/042.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/043.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/044.jpg'), tags: ['couple'] },
        { src: this.getImageUrl('assets/2023/045.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/046.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/047.jpg'), tags: ['zekie', 'Valentines'] },
        { src: this.getImageUrl('assets/2023/048.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2023/049.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2023/050.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2023/051.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2023/052.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2023/053.jpg'), tags: ['anniversary', 'zekie'] },
        { src: this.getImageUrl('assets/2023/054.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2023/055.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2023/056.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2023/057.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2023/058.jpg'), tags: ['zekie', 'Valentines'] },
        { src: this.getImageUrl('assets/2023/059.jpg'), tags: ['chelle', 'Anniversary'] },
        { src: this.getImageUrl('assets/2023/060.jpg'), tags: ['couple', 'Valentines'] },
        { src: this.getImageUrl('assets/2023/061.jpg'), tags: ['date', 'zekie'] },
        { src: this.getImageUrl('assets/2023/062.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/063.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/064.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/065.jpg'), tags: ['date', 'chelle'] },
        { src: this.getImageUrl('assets/2023/066.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/067.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/068.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/069.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/070.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/071.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/072.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/073.jpg'), tags: ['zekie', 'luna'] },
        { src: this.getImageUrl('assets/2023/074.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/075.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/076.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/077.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/078.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/079.jpg'), tags: ['date', 'viewpoint'] },
        { src: this.getImageUrl('assets/2023/080.jpg'), tags: ['date', 'viewpoint'] },
        { src: this.getImageUrl('assets/2023/081.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/082.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/083.jpg'), tags: ['date', 'viewpoint'] },
        { src: this.getImageUrl('assets/2023/084.jpg'), tags: ['date', 'zekie'] },
        { src: this.getImageUrl('assets/2023/085.jpg'), tags: ['date', 'chelle'] },
        { src: this.getImageUrl('assets/2023/086.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/087.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/088.jpg'), tags: ['date', 'chelle'] },
        { src: this.getImageUrl('assets/2023/089.jpg'), tags: ['date', 'couple', 'bsu'] },
        { src: this.getImageUrl('assets/2023/090.jpg'), tags: ['bsu', 'viewpoint'] },
        { src: this.getImageUrl('assets/2023/091.jpg'), tags: ['bsu', 'chelle'] },
        { src: this.getImageUrl('assets/2023/092.jpg'), tags: ['bsu', 'couple'] },
        { src: this.getImageUrl('assets/2023/093.jpg'), tags: ['bsu', 'chelle'] },
        { src: this.getImageUrl('assets/2023/094.jpg'), tags: ['bsu', 'viewpoint'] },
        { src: this.getImageUrl('assets/2023/095.jpg'), tags: ['bsu', 'couple'] },
        { src: this.getImageUrl('assets/2023/096.jpg'), tags: ['bsu', 'couple'] },
        { src: this.getImageUrl('assets/2023/097.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/098.jpg'), tags: ['zekie', 'bsu'] },
        { src: this.getImageUrl('assets/2023/099.jpg'), tags: ['bsu', 'couple'] },
        { src: this.getImageUrl('assets/2023/100.jpg'), tags: ['bsu', 'couple'] },
        { src: this.getImageUrl('assets/2023/101.jpg'), tags: ['bsu', 'couple'] },
        { src: this.getImageUrl('assets/2023/102.jpg'), tags: ['bsu', 'zekie'] },
        { src: this.getImageUrl('assets/2023/103.jpg'), tags: ['bsu', 'chelle'] },
        { src: this.getImageUrl('assets/2023/104.jpg'), tags: ['bsu', 'chelle'] },
        { src: this.getImageUrl('assets/2023/105.jpg'), tags: ['bsu', 'chelle'] },
        { src: this.getImageUrl('assets/2023/106.jpg'), tags: ['bsu', 'couple'] },
        { src: this.getImageUrl('assets/2023/107.jpg'), tags: ['bsu', 'couple'] },
        { src: this.getImageUrl('assets/2023/108.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/109.jpg'), tags: ['bsu', 'chelle'] },
        { src: this.getImageUrl('assets/2023/110.jpg'), tags: ['bsu', 'chelle'] },
        { src: this.getImageUrl('assets/2023/111.jpg'), tags: ['bsu', 'chelle'] },
        { src: this.getImageUrl('assets/2023/112.jpg'), tags: ['bsu', 'couple'] },
        { src: this.getImageUrl('assets/2023/113.jpg'), tags: ['bsu', 'couple'] },
        { src: this.getImageUrl('assets/2023/114.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/115.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/116.jpg'), tags: ['date', 'viewpoint'] },
        { src: this.getImageUrl('assets/2023/117.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/118.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/119.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/120.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/121.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/122.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/123.jpg'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2023/124.jpg'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2023/125.jpg'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2023/126.jpg'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2023/127.jpg'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2023/128.jpg'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2023/129.jpg'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2023/130.jpg'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2023/131.jpg'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2023/132.jpg'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2023/133.jpg'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2023/134.jpg'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2023/135.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/136.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/137.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/138.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/139.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/140.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/141.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/142.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/143.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2023/144.jpg'), tags: ['pandayan', 'couple'] },
        { src: this.getImageUrl('assets/2023/145.jpg'), tags: ['pandayan', 'couple'] }
      ],
      '2024': [
        { src: this.getImageUrl('assets/2024/01.jpg'), tags: ['date', 'arcade', 'couple'] },
        { src: this.getImageUrl('assets/2024/02.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/03.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/04.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/05.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/06.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/07.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/08.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/09.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/10.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/11.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/12.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/13.jpg'), tags: ['pandayan', 'couple'] },
        { src: this.getImageUrl('assets/2024/14.jpg'), tags: ['anniversary', 'viewpoint'] },
        { src: this.getImageUrl('assets/2024/15.jpg'), tags: ['anniversary', 'zekie'] },
        { src: this.getImageUrl('assets/2024/16.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/17.jpg'), tags: ['pandayan', 'couple'] },
        { src: this.getImageUrl('assets/2024/18.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2024/19.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2024/20.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/21.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/22.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/23.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/24.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/25.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/26.jpg'), tags: ['pandayan', 'couple'] },
        { src: this.getImageUrl('assets/2024/27.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2024/28.jpg'), tags: ['pandayan', 'couple'] },
        { src: this.getImageUrl('assets/2024/29.jpg'), tags: ['anniversary', 'viewpoint'] },
        { src: this.getImageUrl('assets/2024/30.jpg'), tags: ['anniversary', 'zekie'] },
        { src: this.getImageUrl('assets/2024/31.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/32.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/33.jpg'), tags: ['anniversary', 'zekie'] },
        { src: this.getImageUrl('assets/2024/34.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/35.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/36.jpg'), tags: ['date', 'coffee'] },
        { src: this.getImageUrl('assets/2024/37.jpg'), tags: ['date', 'coffee'] },
        { src: this.getImageUrl('assets/2024/38.jpg'), tags: ['anniversary', 'viewpoint'] },
        { src: this.getImageUrl('assets/2024/39.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/40.jpg'), tags: ['anniversary', 'zekie'] },
        { src: this.getImageUrl('assets/2024/41.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/42.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/43.jpg'), tags: ['anniversary', 'viewpoint'] },
        { src: this.getImageUrl('assets/2024/44.jpg'), tags: ['anniversary', 'zekie'] },
        { src: this.getImageUrl('assets/2024/45.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/46.jpg'), tags: ['panda'] },
        { src: this.getImageUrl('assets/2024/47.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2024/48.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/49.jpg'), tags: ['anniversary', 'viewpoint'] },
        { src: this.getImageUrl('assets/2024/50.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/51.jpg'), tags: ['anniversary', 'zekie'] },
        { src: this.getImageUrl('assets/2024/52.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/53.jpg'), tags: ['anniversary', 'zekie'] },
        { src: this.getImageUrl('assets/2024/54.jpg'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2024/55.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/56.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2024/57.jpg'), tags: ['anniversary', 'viewpoint'] },
        { src: this.getImageUrl('assets/2024/58.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2024/59.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/60.jpg'), tags: ['anniversary', 'viewpoint'] },
        { src: this.getImageUrl('assets/2024/61.jpg'), tags: ['anniversary', 'zekie'] },
        { src: this.getImageUrl('assets/2024/62.jpg'), tags: ['anniversary', 'viewpoint'] },
        { src: this.getImageUrl('assets/2024/63.jpg'), tags: ['anniversary', 'couple', 'arcade'] },
        { src: this.getImageUrl('assets/2024/64.jpg'), tags: ['anniversary', 'zekie'] },
        { src: this.getImageUrl('assets/2024/65.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/66.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/67.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/68.jpg'), tags: ['anniversary', 'zekie'] },
        { src: this.getImageUrl('assets/2024/69.jpg'), tags: ['anniversary', 'viewpoint'] },
        { src: this.getImageUrl('assets/2024/70.jpg'), tags: ['anniversary', 'chelle'] },
        { src: this.getImageUrl('assets/2024/71.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2024/72.jpg'), tags: ['date', 'zekie', 'ramen'] },
        { src: this.getImageUrl('assets/2024/73.jpg'), tags: ['valentines', 'couple'] },
        { src: this.getImageUrl('assets/2024/74.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/75.jpg'), tags: ['date', 'zekie', 'samg'] },
        { src: this.getImageUrl('assets/2024/76.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/77.jpg'), tags: ['anniversary', 'couple'] },
        { src: this.getImageUrl('assets/2024/78.jpg'), tags: ['pandayan', 'couple'] },
        { src: this.getImageUrl('assets/2024/79.jpg'), tags: ['date', 'samg'] },
        { src: this.getImageUrl('assets/2024/80.jpg'), tags: ['date', 'ramen'] },
        { src: this.getImageUrl('assets/2024/81.jpg'), tags: ['date', 'ramen'] },
        { src: this.getImageUrl('assets/2024/82.jpg'), tags: ['pandayan', 'couple'] },
        { src: this.getImageUrl('assets/2024/83.jpg'), tags: ['date', 'samg'] },
        { src: this.getImageUrl('assets/2024/84.jpg'), tags: ['date', 'samg'] },
        { src: this.getImageUrl('assets/2024/85.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/86.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/87.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/88.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/89.jpg'), tags: ['birthday', 'karaoke', 'couple'] },
        { src: this.getImageUrl('assets/2024/90.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/91.jpg'), tags: ['birthday', 'viewpoint'] },
        { src: this.getImageUrl('assets/2024/92.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/93.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/94.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/95.jpg'), tags: ['birthday', 'couple'] },
        { src: this.getImageUrl('assets/2024/96.jpg'), tags: ['birthday', 'couple'] },
        { src: this.getImageUrl('assets/2024/97.jpg'), tags: ['birthday', 'karaoke', 'couple'] },
        { src: this.getImageUrl('assets/2024/98.jpg'), tags: ['birthday', 'karaoke', 'couple'] },
        { src: this.getImageUrl('assets/2024/99.jpg'), tags: ['birthday', 'couple', 'coffee'] },
        { src: this.getImageUrl('assets/2024/100.jpg'), tags: ['birthday', 'couple'] },
        { src: this.getImageUrl('assets/2024/101.jpg'), tags: ['birthday', 'couple', 'coffee'] },
        { src: this.getImageUrl('assets/2024/102.jpg'), tags: ['birthday', 'couple', 'coffee'] },
        { src: this.getImageUrl('assets/2024/103.jpg'), tags: ['birthday', 'coffee'] },
        { src: this.getImageUrl('assets/2024/104.jpg'), tags: ['birthday', 'chelle'] },
        { src: this.getImageUrl('assets/2024/105.jpg'), tags: ['date', 'couple', 'prc'] },
        { src: this.getImageUrl('assets/2024/106.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/107.jpg'), tags: ['birthday', 'couple'] },
        { src: this.getImageUrl('assets/2024/108.jpg'), tags: ['birthday', 'coffee'] },
        { src: this.getImageUrl('assets/2024/109.jpg'), tags: ['birthday', 'coffee'] },
        { src: this.getImageUrl('assets/2024/110.jpg'), tags: ['date', 'couple', 'prc'] },
        { src: this.getImageUrl('assets/2024/111.jpg'), tags: ['date', 'prc'] },
        { src: this.getImageUrl('assets/2024/112.jpg'), tags: ['date', 'couple', 'prc'] },
        { src: this.getImageUrl('assets/2024/113.jpg'), tags: ['date', 'couple', 'prc'] },
        { src: this.getImageUrl('assets/2024/114.jpg'), tags: ['date', 'couple', 'prc'] },
        { src: this.getImageUrl('assets/2024/115.jpg'), tags: ['date', 'chelle', 'prc'] },
        { src: this.getImageUrl('assets/2024/116.jpg'), tags: ['birthday', 'chelle', 'coffee'] },
        { src: this.getImageUrl('assets/2024/117.jpg'), tags: ['date', 'couple', 'prc'] },
        { src: this.getImageUrl('assets/2024/118.jpg'), tags: ['date', 'couple', 'prc'] },
        { src: this.getImageUrl('assets/2024/119.jpg'), tags: ['date', 'prc'] },
        { src: this.getImageUrl('assets/2024/120.jpg'), tags: ['date', 'zekie', 'prc'] },
        { src: this.getImageUrl('assets/2024/121.jpg'), tags: ['date', 'family'] },
        { src: this.getImageUrl('assets/2024/122.jpg'), tags: ['date', 'family'] },
        { src: this.getImageUrl('assets/2024/123.png'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2024/124.png'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2024/125.png'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2024/126.png'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2024/127.png'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2024/128.png'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2024/129.png'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2024/130.png'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2024/131.png'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2024/132.png'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2024/133.png'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2024/134.png'), tags: ['anniversary', 'couple', 'photoshoot'] },
        { src: this.getImageUrl('assets/2024/135.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/136.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/137.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/138.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/139.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/140.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/141.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/142.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/143.jpg'), tags: ['date', 'couple'] },
        { src: this.getImageUrl('assets/2024/144.jpg'), tags: ['pandayan', 'couple'] },
        { src: this.getImageUrl('assets/2024/145.jpg'), tags: ['pandayan', 'couple'] }
      ]
    };

    // Set the images for the current folder
    this.allImages = folderImages[folderName] || [];
    this.filteredImages = [...this.allImages]; // Initialize filtered images
  }

  // Filter images based on the search term
  filterImages(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (term === '') {
      this.filteredImages = [...this.allImages];
    } else {
      this.filteredImages = this.allImages.filter((image) =>
        image.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }
  }

  // Open the full-size image in a modal
  openFullImage(imageSrc: string): void {
    this.fullImageSrc = imageSrc;
    this.showFullImage = true;
    document.body.style.overflow = 'hidden'; // Disable scrolling
  }

  // Close the full-size image modal
  closeFullImage(): void {
    this.showFullImage = false;
    this.fullImageSrc = '';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }

  // Navigate between images in the modal
  navigateImages(direction: number): void {
    const currentIndex = this.filteredImages.findIndex(img => img.src === this.fullImageSrc);
    const nextIndex = (currentIndex + direction + this.filteredImages.length) % this.filteredImages.length;
    this.fullImageSrc = this.filteredImages[nextIndex].src;
  }

  // Listen for Escape key press to close the modal
  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent): void {
    this.closeFullImage();
  }

  // Listen for Left Arrow key press to navigate to the previous image
  @HostListener('document:keydown.arrowleft', ['$event'])
  onArrowLeft(event: KeyboardEvent): void {
    this.navigateImages(-1);
  }

  // Listen for Right Arrow key press to navigate to the next image
  @HostListener('document:keydown.arrowright', ['$event'])
  onArrowRight(event: KeyboardEvent): void {
    this.navigateImages(1);
  }

  // Helper function to extract the image name from the path
  getImageName(imagePath: string): string {
    return imagePath.split('/').pop() || '';
  }

  getBackgroundSize(): string {
    if (this.isMobileScreen()) {
      // Mobile backgrounds should cover the full viewport
      return 'cover';
    } else {
      // Desktop backgrounds use the original sizing logic
      return this.currentYear === '2022' ? '250% auto' : '200% auto';
    }
  }
}