import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonCheckbox, IonAccordion, IonItem,IonLabel,IonAccordionGroup,IonList } from '@ionic/angular/standalone';
import { Medico,MedicoService } from '../medico.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Injectable, inject } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCheckbox, IonAccordion, IonItem,IonLabel,IonAccordionGroup,IonList]
})
export class HorariosPage implements OnInit {

  medicos: Observable<Medico[]>;
  constructor(private mS: MedicoService, private authS: AuthService,private firestore: Firestore = inject(Firestore), private router: Router) {
    this.medicos = mS.getMedicos();
   }

   dia5: { [dia: string]: number[] } = {};

  userE: string | null = null;
  userID: string | null = null;

  async ngOnInit() {

    const user = await this.authS.currentUser();
    if (user){
      this.userE = user.email;
      this.userID = user.uid;
    }
    console.log("Página visitada " + this.userE + '-->'+this.userE);

    combineLatest([this.medicos]).subscribe(([medicos]) => {
      const medico = medicos.find(m => m.uid === this.userID);
      console.log('hola'+ this.userID);
      if (medico) {
        medico.horario.split(';').forEach(entry => {
          const partes = entry.split(":");
          const dia = partes[0];
          const hora5 = partes.slice(1).map(h => +h);
          this.dia5[dia] = hora5;

          hora5.forEach(hora => {
            this.shout(dia, hora, true);
          });

        });
        console.log('HORARIO YA ESTABLECIDO:'+medico.horario);
      }
    });
  }

  dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horas: number[] = Array.from({ length: 24 }, (_, i) => i);
  horario: { [dia: string]: number[] } = {};
  actualizado = false;

  async ionViewWillEnter() {
    const user = await this.authS.currentUser();
    if (user){
      this.userE = user.email;
      this.userID = user.uid;
    }
    console.log("Página visitada" + this.userE);
  }

  shout(dia: string, hora: number, checked: boolean) {
  if (!this.horario[dia]) {
    this.horario[dia] = [];
  }

  if (checked) {
    if (!this.horario[dia].includes(hora)) {
      this.horario[dia].push(hora);
    }
  } else {
    this.horario[dia] = this.horario[dia].filter(h => h !== hora);
  }
}

  obtain() {
  if (this.actualizado) return; // Evita múltiples ejecuciones

  let resultado: string = '';
  for (const dia in this.horario) {
    const horas = this.horario[dia].filter(h => h !== null && h !== undefined).sort((a, b) => a - b);

    if (horas.length > 0) {
      resultado += `${dia}:${horas.join(':')};`;
    }
  }

  console.log("Resultado generado: ", resultado);

  // Busca el médico y actualiza
  this.medicos.subscribe(medicos => {
    const medico = medicos.find(m => m.uid === this.userID);
    if (medico && !this.actualizado) {
      this.actualizado = true; // marcamos que ya actualizamos
      this.actualizarHorario(resultado);
    }
  });
  }

  async actualizarHorario(res: string) {
    const docRef = doc(this.firestore, `medico/${this.userID}`);
    console.log("bien");
    try {
      await updateDoc(docRef, {
        horario: res // O cualquier variable que contenga los nuevos horarios
      });
      console.log('Horario actualizado correctamente');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al actualizar el horario:', error);
    }
  }

}
