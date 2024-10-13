import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community';
import { MapDialogComponent } from '../map-dialog/map-dialog.component';
import { AppStore } from '../app-state';

@Component({
  selector: 'app-clinic-table',
  standalone: true,
  imports: [AgGridAngular, CommonModule, MatIcon, MatButtonModule],
  templateUrl: './clinic-table.component.html',
  styleUrl: './clinic-table.component.css',
})
export class ClinicTableComponent implements OnInit, OnChanges {
  @ViewChild('clinicGrid') grid!: AgGridAngular;
  @Input() city: string = 'Dehradun';

  isPhotoViewerOpen: boolean = false;
  activeClinicPhotos: string[] = [];
  selectedCity: any;

  appStore = inject(AppStore);

  clinicList: any[] = [];
  colDefs: ColDef[] = [
    {
      headerName: 'S.No',
      valueGetter: (params: any) => {
        return params.node.rowIndex + 1;
      },
      width: 50,
    },
    {
      field: 'place_id',
      filter: true,
      width: 100,
    },
    {
      field: 'name',
      filter: true,
      editable: true,

    },
    {
      field: 'rating',
      filter: true,
      editable: true,
      width: 100,
    },

    {
      field: 'user_ratings_total',
      filter: true,
      editable: true,
      width: 100,
    },

    {
      field: 'formatted_address',
      filter: true,
      editable: true,
    },
    {
      field: 'formatted_phone_number',
      filter: true,
      editable: true,
    },
    {
      field: 'website',
      filter: true,
      editable: true,
    },
    {
      field: 'Action',
      filter: false,
      sortable: false,
      cellRenderer: (params: any) => {
        return `<button>View Photos (${
          params.data.photos?.length || 0
        })</button>`;
      },
      onCellClicked: (params: any) => {
        this.openPhotoViewer(params);
      },
    },
    {
      field: "ViewOnMap",
      filter: false,
      sortable: false,
      cellRenderer: (params: any) => {
        return `<button>View on Map</button>`;
      },
      onCellClicked: (params: any) => {
        this.openGoogleMapDialog(params.data);
      },
    },
    {
      field: "Remarks",
      filter: true,
      sortable: true,
      editable: true,
      cellEditor: "agLargeTextCellEditor",
      cellEditorPopup: true,
    }
    
  ];

  constructor(public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['city']) {
      const city = changes['city']['currentValue'];
      this.loadClinicList(city);
    }
  }

  ngOnInit() {
    const city = this.city;
  }

  loadClinicList(city: string) {
    if (!city) {
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
    console.log('View Photos', photo);
  }

  openPhotoViewer(context: any) {
    this.isPhotoViewerOpen = true;
    this.selectedCity = context.data;
    const photosList = context.data.photos;
    const photos = photosList.map((photo: any) => {
      const url = this.createPhotoUrl(photo.photo_reference);
      return url;
    });

    this.activeClinicPhotos = photos;
  }

  createPhotoUrl(photo_reference: string) {
    const API_KEY = this.appStore.accessToken();
    const reference = photo_reference;
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${reference}&key=${API_KEY}`;
    return url;
  }

  openGoogleMapDialog(data: any) {
    const dialogRef = this.dialog.open(MapDialogComponent, {
      width: '800px',
      data: { ...data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  exportToCSV() {
    this.grid.api.exportDataAsCsv();
  }

  exportToJSON() {
    // export clinic list as JSON
    const data = JSON.stringify(this.clinicList);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clinic-list.json';  // download file name
    a.click();
    // remove a tag
    window.URL.revokeObjectURL(url);

  }

  updateClinicList(clinicList: any) {
    this.clinicList = clinicList;
    this.grid.api.redrawRows();

  }

  importFromCSV(csv: any) {
    // this.grid.api.
  }

  openInGoogleMaps(place_id: string) {
    const url = `https://www.google.com/maps/place/?q=place_id:${place_id}`;
    window.open(url, '_blank');
  }
}
