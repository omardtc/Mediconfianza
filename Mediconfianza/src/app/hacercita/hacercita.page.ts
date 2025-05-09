import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Medico, MedicoService } from '../medico.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hacercita',
  templateUrl: './hacercita.page.html',
  styleUrls: ['./hacercita.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HacercitaPage implements OnInit {

  medicos: Observable<Medico[]>;
  constructor(private medicoS: MedicoService) { 
    this.medicos = medicoS.getMedicos();
  }

  ngOnInit() {
  }

}
