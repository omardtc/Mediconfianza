import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, startWith, tap } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonButton, IonSearchbar } from '@ionic/angular/standalone';

import { SearchService } from '../search.service';
import { Medico, MedicoService } from '../medico.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function (): number {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
};

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonList, IonItem,IonSearchbar, IonLabel, IonInput, IonDatetime, IonButton]
})
export class SearchPage implements OnInit {

  medicos: Observable<Medico[]>;
    constructor(private medicoS: MedicoService, private router: Router, private route: ActivatedRoute) { 
      this.medicos = medicoS.getMedicos();
    }

    especialidad = new FormControl('Todas');
    estado = new FormControl('Todos');
    nombre = new FormControl('');

    call(smt:string | null){
      console.log(smt);
    }


//ME LA ULTRA MEGA PELA NO SRIVE DE NADA

especialidadesUnicas: string[] = [];
estadosUnicos: string[] = [];

    userE: string | null = null;
  userID: string | null = null;
  rol = '';

  ngOnInit() {
    this.medicoS.getMedicos().subscribe(medicos => {
    this.especialidadesUnicas = [...new Set(medicos.map(m => m.especialidad))];
    this.estadosUnicos = [...new Set(medicos.map(m => m.estado))];
  });

  this.route.queryParams.subscribe(params => {
      this.userID = params['userID'];
      this.userE = params['userE'];
      this.rol = params['rol'];
    });
    console.log(this.rol);
  }

  Hcita(idM:string){
    this.router.navigate(['/hacercita'], {
    queryParams: {
      id: idM,
      userID: this.userID,
      userE: this.userE,
      rol: this.rol,
    }
  });
  }

  Home() {
    console.log(this.userID);
    console.log(this.userE);
    console.log(this.rol);
    this.router.navigate(['/home'],{
      queryParams: {
        userID: this.userID,
        userE: this.userE,
        rol: this.rol,
      }
    });
  }

}
