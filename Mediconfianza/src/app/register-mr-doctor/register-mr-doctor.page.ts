import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-register-mr-doctor',
  templateUrl: './register-mr-doctor.page.html',
  styleUrls: ['./register-mr-doctor.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonButton]
})
export class RegisterMrDoctorPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
