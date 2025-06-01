import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone'; // Import IonButtons and IonIcon
import { CalendarService } from '../calendar.service';
import { CommonModule } from '@angular/common';
// import { A } from '@angular/core/weak_ref.d-Bp6cSy-X'; // This import seems incorrect or unused
import { AuthService } from '../auth.service';
import { Medico, MedicoService } from '../medico.service';
import { Paciente, PacienteService } from '../paciente.service';
import { Observable } from 'rxjs';
// import { NgModel } from '@angular/forms'; // NgModel is typically used with FormsModule, but you have ReactiveFormsModule too
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';

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
  accepted: boolean; // Opcional para los pacientes
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
    IonButton,
    ReactiveFormsModule,
    FormsModule,
    IonButtons, // Add IonButtons to imports
    IonIcon // Add IonIcon to imports
  ],
})
export class HomePage {

  semanaActual = new Date().getWeek();
  anioActual = new Date().getFullYear();
  diasSemana: Date[] = [];
  citas: any[] = [];
  diaActual = new Date().getDate();
  mesActual = new Date().getMonth();
  ano = new Date().getFullYear();
  semanaHoy = new Date().getWeek();

  rol = new FormControl('');
  citaz: Cita[] = [];

  nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  medicosList: Medico[] = [];
pacientesList: Paciente[] = [];

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
    console.log(this.rol.value);
  }

  medicos: Observable<Medico[]>;
  pacientes: Observable<Paciente[]>;
  constructor(
    private calendarService: CalendarService,
    private authS: AuthService,
    private mS: MedicoService,
    private pS: PacienteService,
    private router: Router
  ) {
    this.medicos = mS.getMedicos();
    this.pacientes = pS.getPacientes();
  }

  ngOnInit() {
    this.diasSemana = this.calendarService.getDiasDeSemana(this.anioActual, this.semanaActual);
    combineLatest([this.medicos, this.pacientes]).subscribe(([medicos, pacientes]) => {
  this.medicosList = medicos;
  this.pacientesList = pacientes;

  const medico = medicos.find(m => m.uid === this.userID);
  if (medico) {
    this.rol.setValue('medico');
    this.citaz = Array.isArray(medico.citas) ? medico.citas : [];
  } else {
    const paciente = pacientes.find(p => p.uid === this.userID);
    if (paciente) {
      this.rol.setValue('paciente');
      this.citaz = Array.isArray(paciente.citas) ? paciente.citas : [];
    } else {
      this.router.navigate(['/login']);
    }
  }
});

    // if (this.rol.value==null || this.rol.value == '')this.router.navigate([('/login')]);
  }

  grita(){
    console.log(this.rol.value);
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

  Hide(dia: number, mes: number, ano: number, dia2: number, mes2: number, ano2: number): boolean {
  const citaDate = new Date(ano, mes, dia);       // mes ya está indexado en 0-11
  const hoyDate = new Date(ano2, mes2, dia2);
  return citaDate < hoyDate;
}

  Horarios() {
    this.router.navigate(['/horarios']);
  }
  Search() {
    this.router.navigate(['/search'], {
      queryParams: {
      userID: this.userID,
      userE: this.userE,
      rol: this.rol.value,
    }
    });
  }
  Hcita() {
    this.router.navigate(['/hacercita'], {
      queryParams: {
      id: this.userID,
      userID: this.userID,
      userE: this.userE,
      rol: this.rol.value,
    }
    });
  }
  Logout() {
    this.userE = '';
    this.userID = '';
    this.authS.logout();
    this.router.navigate(['/login']);
  }

  // --- Función para cerrar sesión ---
  async logout() {
    try {
      await this.authS.logout(); // Asume que AuthService tiene un método signOut()
      this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Opcional: Mostrar un mensaje al usuario si el cierre de sesión falla
    }
  }

horaDisponible(dia: Date): boolean {
  return !this.citaz.some(cita =>
    Number(cita.diaN) === dia.getDate() &&
    Number(cita.mes) === dia.getMonth() &&
    Number(cita.ano) === this.ano &&
    cita.accepted === true
  );
}

getCitasDelDia(dia: Date,cita: Cita): boolean {
  return (
    Number(cita.diaN) === dia.getDate() &&
    Number(cita.mes) === dia.getMonth() &&
    Number(cita.ano) === dia.getFullYear() &&
    cita.accepted === true
  );
}

}

// let date: Date = new Date(); // This line seems to be residual and can be removed
// console.log("Date = " + date); // This line also can be removed or moved inside a method if needed