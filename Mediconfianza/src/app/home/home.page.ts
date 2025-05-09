import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent,IonButton } from '@ionic/angular/standalone';
import { CalendarService } from '../calendar.service';
import { CommonModule } from '@angular/common';
import { A } from '@angular/core/weak_ref.d-Bp6cSy-X';


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
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CommonModule,IonButton],
})
export class HomePage {
  
  semanaActual = new Date().getWeek(); // ver nota abajo
  anioActual = new Date().getFullYear();
  diasSemana: Date[] = [];
  citas: any[] = [];
  diaActual = new Date().getDate();
  mesActual = new Date().getMonth();
  ano = new Date().getFullYear();

  nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.diasSemana = this.calendarService.getDiasDeSemana(this.anioActual, this.semanaActual);
    this.cargarCitas();
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
  
  
}

let date: Date = new Date();
  console.log("Date = " + date);