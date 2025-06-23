import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; // Import the routing module
import { AppComponent } from './app.component';
import { PhotosComponent } from './photos/photos.component';
import { VideosComponent } from './videos/videos.component';

@NgModule({
  declarations: [
    AppComponent,
    PhotosComponent,
    VideosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // Add the routing module here
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}