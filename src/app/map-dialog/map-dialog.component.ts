import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppStore } from '../app-state';

@Component({
  selector: 'app-map-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './map-dialog.component.html',
  styleUrl: './map-dialog.component.css',
})
export class MapDialogComponent {
  appStore = inject(AppStore);

  placeId: string = '';
  placeName: string = '';
  API_KEY: string | null = this.appStore.accessToken();
  placeUrl: string = `https://www.google.com/maps/embed/v1/place?key=${this.API_KEY}&q=new+delhi`;
  sanitizedUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    this.API_KEY = this.appStore.accessToken();
    this.placeUrl = `https://www.google.com/maps/embed/v1/place?key=${this.API_KEY}&q=place_id:${data.placeDetail.place_id}`;

    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.placeUrl
    );
    this.placeId = data.placeDetail.place_id;
    this.placeName = data.name;
  }
}
