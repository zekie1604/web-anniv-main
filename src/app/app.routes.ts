import { Routes } from '@angular/router';
import { PhotosComponent } from './photos/photos.component';
import { VideosComponent } from './videos/videos.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { HomeComponent } from './components/home/home.component';
import { SecretCodeComponent } from './components/passcode/secret-code.component';
import { MemoryGameComponent } from './components/memory-game/memory-game.component';
import { TimelineComponent } from './timeline/timeline.component';

export const routes: Routes = [
  { path: 'photos/:folderName', component: PhotosComponent },
  { path: 'videos/:folderName', component: VideosComponent },
  { path: 'chatbot/:folderName', component: ChatbotComponent },
  { path: 'timeline/:folderName', component: TimelineComponent },
  { path: 'memory-game', component: MemoryGameComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: SecretCodeComponent }
];