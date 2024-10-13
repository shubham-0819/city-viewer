import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AppStore } from '../app-state';


@Component({
  selector: 'app-app-settings',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButton,
    CommonModule,
    FormsModule
  ],
  templateUrl: './app-settings.component.html',
  styleUrl: './app-settings.component.css'
})
export class AppSettingsComponent implements OnInit {

  appStore = inject(AppStore);
  appSettings: any = {
    token: this.appStore.accessToken()
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialog
  ) {}

  closeDialog(): void {
    // this.dialogRef.close();
  }

  saveSettings(): void {
    const { token } = this.appSettings;
    this.appStore.setAccessToken(token);
  }

  ngOnInit(): void {
  }
}
