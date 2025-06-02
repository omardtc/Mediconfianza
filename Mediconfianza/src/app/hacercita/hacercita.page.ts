import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon,IonCol,IonRow } from '@ionic/angular/standalone'; // Import IonButtons and IonIcon
import { CalendarService } from '../calendar.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Medico, MedicoService } from '../medico.service';
import { Paciente, PacienteService } from '../paciente.service';
import { Observable } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { arrayUnion } from '@angular/fire/firestore';

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

export interface Cita {
  id: string;
  dia: string;
  hora: string;
  diaN: number;
  mes: number;
  ano: number;
  accepted: boolean;
}

@Component({
  selector: 'app-hacercita',
  templateUrl: './hacercita.page.html',
  styleUrls: ['./hacercita.page.scss'],
  standalone: true,
  imports: [
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      CommonModule,
      IonButton,
      ReactiveFormsModule,
      FormsModule,
      IonButtons, 
      IonIcon,
      IonCol,
      IonRow,
    ],
})

export class HacercitaPage implements OnInit {

  semanaActual = new Date().getWeek();
  anioActual = new Date().getFullYear();
  diasSemana: Date[] = [];
  diaActual = new Date().getDate();
  mesActual = new Date().getMonth();
  ano = new Date().getFullYear();
  semanaHoy = new Date().getWeek();

  rol = '';

  nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  pacientesList: Paciente[] = [];
  
  medicoI  = '';
  horario: { [dia: string]: string[] } = {};
  citasM: Cita[] = [];
  citasP: Cita[] = [];
  wan = false;

  userE: string | null = null;
  userID: string | null = null;
  async ionViewWillEnter() {
    const user = await this.authS.currentUser();
    if (user) {
      this.userE = user.email;
      this.userID = user.uid;
    }
    console.log("Página visitada" + this.userE);
    console.log(this.userID);
  }

  medicos: Observable<Medico[]>;
  pacientes: Observable<Paciente[]>;
  constructor(private mS: MedicoService,private authS: AuthService,private calendarService: CalendarService, private pacienteS: PacienteService,private pS: PacienteService, private firestore: Firestore = inject(Firestore), private router: Router, private route: ActivatedRoute) { 
    this.medicos = mS.getMedicos();
    this.pacientes = pS.getPacientes();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params['id']);      // medico.id
      this.medicoI = params['id'];
      console.log(this.medicoI);
      this.userID = params['userID'];
      console.log(this.userID);
      this.userE = params['userE'];
      this.rol = params['rol'];
    });

    combineLatest([this.medicos, this.pacientes]).subscribe(([medicos, pacientes]) => {
  this.pacientesList = pacientes;
    });

    this.medicos.subscribe(medicos => {
      const medico = medicos.find(m => m.uid === this.medicoI);
      if (medico && this.wan==false) {
        console.log(medico.horario);
        console.log(medico.apellido);
        const entradas = medico.horario.split(';');
        console.log('ENTRA '+entradas + ' -->');
        for (const entrada of entradas) {
          const partes = entrada.split(':');
          console.log('PARTES'+partes+"-->")
          const dia = partes[0]; 
          const horas = partes.slice(1);
          if (!this.horario[dia]) {
            this.horario[dia] = [];
          }
          this.horario[dia].push(...horas);
        }
        console.log(this.horario);
        this.wan=true;
        this.citasM = Array.isArray(medico.citas) ? medico.citas : [];
      }
    });

    this.pacientes.subscribe(pacientes => {
      const paciente = pacientes.find(p => p.uid === this.userID);
      if (paciente && this.wan==false) {
       this.citasP = Array.isArray(paciente.citas) ? paciente.citas : [];
      }
    });

    this.diasSemana = this.calendarService.getDiasDeSemana(this.anioActual, this.semanaActual);
  }

  grita(){
    console.log(this.rol);
    console.log(this.userID);
  }

  CambiarSemana(num: number) {
    this.semanaActual = this.semanaActual + num;
    if (this.semanaActual == 53) {
      this.anioActual++;
      console.log('CAMBIO ANIO +');
      this.semanaActual = 1;
    }
    if (this.semanaActual == 0) {
      this.anioActual--;
      console.log('CAMBIO ANIO -');
      this.semanaActual = 52;
    }
    console.log('semana actual:' + this.semanaActual);
    this.ngOnInit(); // Recargar el calendario para la nueva semana/año
  }

  ShowDate(dia: number, mes: number, ano: number, dia2: number, mes2: number, ano2: number) {
    if (ano2 > ano) {
      return true;
    } else {
      if (mes2 > mes) {
        return true;
      } else {
        if (mes2 < mes) {
          return false;
        } else {
          if (dia2 >= dia) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  }

  Search() {
    this.router.navigate(['/search'], {
      queryParams:{
        userID: this.userID,
        userE: this.userE,
        rol: this.rol,
      }
    });
  }
  Home() {
    this.router.navigate(['/home'],{
      queryParams: {
        userID: this.userID,
        userE: this.userE,
        rol: this.rol,
      }
    });
  }

  getNombreDia(d: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[d.getDay()];
  }

  tieneHorario(d: Date): boolean {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const nombreDia = dias[d.getDay()];
    return this.horario.hasOwnProperty(nombreDia);
  }

  async Anadir(dia:string,hora:string,diaN:number,mes:number,ano:number){
    console.log('añadiendo'+dia+'->'+hora+'('+this.userID+')'+'['+this.medicoI+']');
    const docRefM = doc(this.firestore, `medico/${this.medicoI}`);
        console.log("bien");
        const nuevaCita = {
          id: this.userID,
          dia: dia,
          hora: hora,
          diaN: diaN,
          mes: mes,
          ano: ano,
          accepted: false,
        };
        try {
          await updateDoc(docRefM, {
            citas: arrayUnion(nuevaCita)
          });
          console.log('Horario actualizado correctamente');
        } catch (error) {
          console.error('Error al actualizar el horario:', error);
        }
        this.medicos.subscribe(medicos => {
        const medico = medicos.find(m => m.uid === this.medicoI);
          if (medico) {
            this.citasM = Array.isArray(medico.citas) ? medico.citas : [];
          }
        });

    const docRefP = doc(this.firestore, `paciente/${this.userID}`);
        nuevaCita.id = this.medicoI;
        try {
          await updateDoc(docRefP, {
            citas: arrayUnion(nuevaCita)
          });
          console.log('Horario actualizado correctamente');
        } catch (error) {
          console.error('Error al actualizar el horario:', error);
        }
    this.Search();
  }

  existeCita(hora: string, dia: Date): boolean {
    return this.citasM.some(cita =>
      cita.hora === hora &&
      Number(cita.diaN) === dia.getDate() &&
      Number(cita.mes) === dia.getMonth() &&
      Number(cita.ano) === dia.getFullYear() &&
      cita.accepted === true
    );
  }

  horaDisponible(dia: Date, hora: string): boolean {
  return !this.citasM.some(cita =>
    cita.hora === hora &&
    Number(cita.diaN) === dia.getDate() &&
    Number(cita.mes) === dia.getMonth() &&
    Number(cita.ano) === this.ano &&
    cita.accepted === true
  );
}

getPacientePorId(id: string, pacientes: any[]): any {
  return pacientes.find(p => p.uid === id);
}

async aceptar(cita: Cita, pacienteID: string) {
  try {
    cita.accepted = true;

    const docRefM = doc(this.firestore, `medico/${this.medicoI}`);
    const citasActualizadasMedico = this.citasM.map(c =>
      c.dia === cita.dia &&
      c.hora === cita.hora &&
      c.diaN === cita.diaN &&
      c.mes === cita.mes &&
      c.ano === cita.ano &&
      c.id === pacienteID ? { ...c, accepted: true } : c
    );

    await updateDoc(docRefM, {
      citas: citasActualizadasMedico
    });

    const docRefP = doc(this.firestore, `paciente/${pacienteID}`);
    const paciente = this.pacientesList.find(p => p.uid === pacienteID);
    const citasActualizadasPaciente = paciente?.citas?.map(c =>
      c.dia === cita.dia &&
      c.hora === cita.hora &&
      c.diaN === cita.diaN &&
      c.mes === cita.mes &&
      c.ano === cita.ano &&
      c.id === this.medicoI ? { ...c, accepted: true } : c
    );

    if (citasActualizadasPaciente) {
      await updateDoc(docRefP, {
        citas: citasActualizadasPaciente
      });
    }

    console.log('Cita aceptada correctamente');
  } catch (error) {
    console.error('Error al aceptar la cita:', error);
  }
}

todasAceptadas(): boolean {
  return this.citasM.length > 0 && this.citasM.every(cita => cita.accepted === true);
}


  
}
