import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotosComponent } from './photos/photos.component';
import { VideosComponent } from './videos/videos.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { HomeComponent } from './components/home/home.component';
import { SecretCodeComponent } from './components/passcode/secret-code.component';

const routes: Routes = [
  { path: 'photos/:folderName', component: PhotosComponent },
  { path: 'videos/:folderName', component: VideosComponent },
  { path: 'chatbot/:folderName', component: ChatbotComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: SecretCodeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}