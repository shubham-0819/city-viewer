import { Component, OnInit, ViewChild } from '@angular/core';
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

const materialComponents = [
  MatToolbarModule,
  MatInputModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconButton,
  MatIconModule,
  MatIconModule
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

  token: string = '';

  constructor(
    public dialog: MatDialog
  ) {
    this.loadCityList();
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
    localStorage.setItem('API_KEY', this.token);
  }

  exportData() {
    this.clinicListEl.exportToCSV();
  }

  importData() {
    // this.clinicListEl.importFromCSV();
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
