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

  nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  userE: string | null = null;
  userID: string | null = null;
  async ionViewWillEnter() {
    const user = await this.authS.currentUser();
    if (user) {
      this.userE = user.email;
      this.userID = user.uid;
    }
    console.log("Página visitada" + this.userE);
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
    this.cargarCitas();
    combineLatest([this.medicos, this.pacientes]).subscribe(([medicos, pacientes]) => {
      const medico = medicos.find(m => m.uid === this.userID);
      if (medico) {
        this.rol.setValue('medico');
      } else {
        const paciente = pacientes.find(p => p.uid === this.userID);
        if (paciente) {
          this.rol.setValue('paciente');
        } else {
          this.rol.setValue('medico'); // Default to medico if not found, or redirect
          // this.router.navigate(['/login']); // Consider redirecting if user not found
        }
      }
    });
  }

  cargarCitas() {
    // Simular citas (esto vendría de un backend real)
    // this.citas = [
    //   { fecha: '2025-05-06', hora: 10, doctorApellido: 'López' },
    //   { fecha: '2025-05-08', hora: 12, doctorApellido: 'Martínez' },
    // ];
  }

  getCitasDelDia(dia: Date) {
    const fecha = dia.toISOString().split('T')[0];
    return this.citas.filter(c => c.fecha === fecha);
  }

  tieneCitas(dia: Date): boolean {
    return this.getCitasDelDia(dia).length > 0;
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

  Horarios() {
    this.router.navigate(['/horarios']);
  }
  Search() {
    this.router.navigate(['/search']);
  }
  Logout() {
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
}

// let date: Date = new Date(); // This line seems to be residual and can be removed
// console.log("Date = " + date); // This line also can be removed or moved inside a method if needed