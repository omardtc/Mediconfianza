import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent,IonButton } from '@ionic/angular/standalone';
import { CalendarService } from '../calendar.service';
import { CommonModule } from '@angular/common';
import { A } from '@angular/core/weak_ref.d-Bp6cSy-X';
import { AuthService } from '../auth.service';
import { Medico, MedicoService } from '../medico.service';
import { Paciente, PacienteService } from '../paciente.service';
import { Observable } from 'rxjs';
import { NgModel } from '@angular/forms';
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
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CommonModule,IonButton,ReactiveFormsModule, FormsModule],
})
export class HomePage {
  
  semanaActual = new Date().getWeek(); // ver nota abajo
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
    if (user){
      this.userE = user.email;
      this.userID = user.uid;
    }
    console.log("Página visitada" + this.userE);
  }

  medicos: Observable<Medico[]>;
  pacientes: Observable<Paciente[]>;
  constructor(private calendarService: CalendarService, private authS: AuthService, private mS: MedicoService, private pS: PacienteService, private router: Router) {
    this.medicos = mS.getMedicos();
    this.pacientes = pS.getPacientes();
  }

  ngOnInit() {
    this.diasSemana = this.calendarService.getDiasDeSemana(this.anioActual, this.semanaActual);
    this.cargarCitas();
    // console.log(this.rol);
    combineLatest([this.medicos, this.pacientes]).subscribe(([medicos, pacientes]) => {
    const medico = medicos.find(m => m.uid === this.userID);
    if (medico) {
      this.rol.setValue('medico');
    } else {
      const paciente = pacientes.find(p => p.uid === this.userID);
      if (paciente) {
        this.rol.setValue('paciente');
      }else{
        this.rol.setValue('medico');
        // this.router.navigate(['/login'])
      }
    }
  });
  }

  cargarCitas() {
    //Simular citas (esto vendría de un backend real)
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

  CambiarSemana(num: number){
    this.semanaActual = this.semanaActual + num;
    if (this.semanaActual==53) {
      this.anioActual++; 
      console.log('CAMBIO ANIO +');
      this.semanaActual = 1;
    }
    if (this.semanaActual==0) {
      this.anioActual--; 
      console.log('CAMBIO ANIO -');
      this.semanaActual = 52;
    }
    console.log('semana actual:' + this.semanaActual);
    this.ngOnInit();
  }
  
  ShowDate(dia: number,mes: number,ano: number,dia2: number,mes2: number,ano2: number){
    // console.log(dia+'/'+mes+'/'+ano);
    // console.log(dia2+'/'+mes2+'/'+ano2);
    // console.log('---');
    if (ano2>ano){
      return true;
    }else{
      if (mes2>mes){
        return true;
      }else{
        if (mes2<mes){
          return false;
        }else{
          if (dia2>=dia){
            return true;
          }else{
            return false;
          }
        }
      }
    }
  }

  Horarios(){
    this.router.navigate(['/horarios']);
  }
  
}

let date: Date = new Date();
  console.log("Date = " + date);