import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  MatButtonModule,
  MatIconAnchor,
  MatIconButton,
} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CityDetailComponent } from './city-detail/city-detail.component';
import { ClinicTableComponent } from './clinic-table/clinic-table.component';
import { FormsModule } from '@angular/forms';
import { AppSettingsComponent } from './app-settings/app-settings.component';
import { MatDialog } from '@angular/material/dialog';
import { AppStore } from './app-state';
import {MatMenuModule} from '@angular/material/menu';

const materialComponents = [
  MatToolbarModule,
  MatInputModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconButton,
  MatIconModule,
  MatIconModule,
  MatToolbarModule,
  MatInputModule,
  MatMenuModule
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    CityDetailComponent,
    ClinicTableComponent,
    FormsModule,
    AppSettingsComponent,
    ...materialComponents
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  showFiller = false;
  title = 'city-viewer';

  selectedCity: string = '';
  cityList: ICity[] = [];


  @ViewChild('token_input') tokenInput!: HTMLInputElement;
  @ViewChild('clinic_list') clinicListEl!: ClinicTableComponent;

  token: string | null = null;

  appStore = inject(AppStore);

  uploadedFilename: string = this.appStore.uploadedFilename();
  isLocalUpload = this.appStore.isLocalUpload();
  constructor(
    public dialog: MatDialog
  ) {
    this.loadCityList();
    effect(() => {
      this.token = this.appStore.accessToken();
    });

    effect(() => {
      this.isLocalUpload = this.appStore.isLocalUpload(); 
      this.uploadedFilename = this.appStore.uploadedFilename();
    });
  }

  ngOnInit() {
  }

  loadCityList() {
    fetch('assets/data/city-list.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.cityList = data.cities;
      });
  }

  viewCity(city: any) {
    this.selectedCity = city.name;
  }

  updateToken() {
    if (!this.token) {
      this.appStore.setAccessToken(this.token);
      return;
    }
    localStorage.setItem('API_KEY', this.token);
  }

  exportData() {
    this.clinicListEl.exportToCSV();
  }

  exportDataJSON() {
    this.clinicListEl.exportToJSON();
  }


  importData() {
    // uplodaed json data 
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const jsonData = JSON.parse(e.target.result);
            this.clinicListEl.updateClinicList(jsonData);
            this.appStore.setIsLocalUpload(true);
            this.appStore.setUploadedFilename( file.name);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();

  }

  openSettings() {
    this.dialog.open(AppSettingsComponent, {
      width: '600px',
      height: '400px',
      data: { token: this.token }
    }).afterClosed().subscribe(result => {
      if (result) {
        // this.token = result;
        // this.updateToken();
      }
    })
  }

}

interface ICity {
  name: string;
  filename: string;
}
