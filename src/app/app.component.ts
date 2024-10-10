import { Component, ViewChild } from '@angular/core';
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

const materialComponents = [
  MatToolbarModule,
  MatInputModule,
  MatSidenavModule,
  MatButtonModule,
  MatIconButton,
  MatIconModule,
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
     ...materialComponents
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  showFiller = false;
  title = 'city-viewer';

  selectedCity: string = '';
  cityList: ICity[] = [];

  @ViewChild('token_input') tokenInput!: HTMLInputElement;

  token: string = '';

  constructor() {
    this.loadCityList();
    localStorage.setItem('API_KEY', '');
  }

  loadCityList() {
    fetch('assets/data/city-list.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.cityList = data.cities;
        console.log(this.cityList);

      });
  }

  viewCity(city:any){
    this.selectedCity = city.name;
  }

  updateToken() {
    localStorage.setItem('API_KEY', this.token);
  }
}

interface ICity {
  name: string;
  filename: string;
}