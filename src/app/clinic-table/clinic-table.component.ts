import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-clinic-table',
  standalone: true,
  imports: [
    AgGridAngular,
    CommonModule,
    MatIcon
  ],
  templateUrl: './clinic-table.component.html',
  styleUrl: './clinic-table.component.css',
})
export class ClinicTableComponent implements OnInit, OnChanges {


  @ViewChild('clinicGrid') grid!: AgGridAngular;
  @Input() city: string = 'Dehradun';

  isPhotoViewerOpen: boolean = true;

  activeClinicPhotos: string[] = [];

  clinicList: any[] = [];
  colDefs: ColDef[] = [
    {
      field: 'name',
      filter: true,
    },

    {
      field: 'rating',
      filter: true,
    },

    {
      field: 'user_ratings_total',
      filter: true,
    },

    {
      field: 'formatted_address',
      filter: true,
    },

    {
      field: 'formatted_phone_number',
      filter: true,
    },
    {
      field: 'Action',
      filter: false,
      sortable: false,
      cellRenderer: (params:any) => {
        return `<button (click)="openPhotoViewer()">View Photos</button>`;
      },
      onCellClicked: (params:any) => {
        this.openPhotoViewer(params);
      }

    }

  ];


  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['city']) {
      const city = changes['city']['currentValue'];
      this.loadClinicList(city);
    }
  }

  ngOnInit() {
    const city = this.city;
    this.loadClinicList(city);
  }

  loadClinicList(city: string) {
    console.log("Clinic List for ", city);

    if (!city) {
      // fetch all cities
      return;
    }

    //load clinic list from assets folder
    fetch(`assets/data/${city}.json`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.clinicList = data;
        this.grid.api.redrawRows();
      });
  }

  closePhotoViewer() {
    this.isPhotoViewerOpen = false;
  }

  viewPhoto(photo: any) {

    console.log("View Photos", photo);
  }

  openPhotoViewer(context: any) {
    this.isPhotoViewerOpen = true;
    console.log("Open Photo Viewer for ", context);
    const photosList = context.data.photos;
    // console.log("Photos List", photosList);
    const photos = photosList.map((photo: any) => {
      const url = this.createPhotoUrl(photo.photo_reference);
      return url;
    });

    this.activeClinicPhotos = photos;
    console.log("Active Clinic Photos", this.activeClinicPhotos);

  }

  createPhotoUrl(photo_reference: string) {
    const API_KEY = this.getTokenFromLocalStorage();
    const reference = photo_reference;
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${reference}&key=${API_KEY}`;
    return url;
  }

  getTokenFromLocalStorage() {
    const token = localStorage.getItem('API_KEY');
    return token;
  }

}
