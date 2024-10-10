import { Component } from '@angular/core';
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
     ...materialComponents
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  showFiller = false;
  title = 'city-viewer';

  
  cityList: ICity[] = [];

  constructor() {
    this.loadCityList();
  }

  loadCityList() {
    //load city from assets folder
    fetch('assets/data/city-list.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.cityList = data.cities;
        console.log(this.cityList);
        
      });
  }

  loadClinicList() {
    //load clinic list from assets folder
    fetch('assets/data/Dehradun.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // this.clinicList = data.clinics;
        // console.log(this.clinicList);
      });   
  }

  viewCity(city:any){
    console.log(city);
    
    //navigate to city view
  }
}

interface ICity {
  name: string;
  filename: string;
}