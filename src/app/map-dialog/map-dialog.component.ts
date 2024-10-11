import { Component } from '@angular/core';
import {MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-map-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule],
  templateUrl: './map-dialog.component.html',
  styleUrl: './map-dialog.component.css'
})
export class MapDialogComponent {

  placeId: string = '';
  placeName: string = '';
  API_KEY: string = '';
  placeUrl: string = `https://www.google.com/maps/embed/v1/place?key=${this.API_KEY}&q=new+delhi`;
  sanitizedUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    this.API_KEY = localStorage.getItem('API_KEY') || '';
    this.placeUrl = `https://www.google.com/maps/embed/v1/place?key=${this.API_KEY}&q=place_id:${data.placeDetail.place_id}`;


    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.placeUrl);
    this.placeId = data.placeDetail.place_id;
    this.placeName = data.name;

  }
}
