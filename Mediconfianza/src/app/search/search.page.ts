import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, startWith, tap } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonButton, IonSearchbar } from '@ionic/angular/standalone';

import { SearchService } from '../search.service'; // Adjusted path
import { Medico, MedicoService } from '../medico.service';    // Adjusted path

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonList, IonItem,IonSearchbar, IonLabel, IonInput, IonDatetime, IonButton]
})
export class SearchPage implements OnInit {

  medicos: Observable<Medico[]>;
    constructor(private medicoS: MedicoService) { 
      this.medicos = medicoS.getMedicos();
    }

    especialidad = new FormControl('Todas');
    estado = new FormControl('Todos');
    nombre = new FormControl('');

    call(smt:string | null){
      console.log(smt);
    }


//ME LA ULTRA MEGA PELA NO SRIVE DE NADA

  ngOnInit() {
  }

}
