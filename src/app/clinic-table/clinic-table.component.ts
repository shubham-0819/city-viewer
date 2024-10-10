import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-clinic-table',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './clinic-table.component.html',
  styleUrl: './clinic-table.component.css',
})
export class ClinicTableComponent implements OnInit {
  clinicList: any[] = [];
  colDefs: ColDef[] = [
    { field: 'formatted_address' },
    { field: 'formatted_phone_number' },
    { field: 'name' },
    { field: 'rating' },
    { field: 'user_ratings_total' },
  ];

  constructor() {}

  ngOnInit() {
    this.loadClinicList();
  }

  loadClinicList() {
    //load clinic list from assets folder
    fetch('assets/data/Dehradun.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.clinicList = data.clinics;
      });
  }
}
