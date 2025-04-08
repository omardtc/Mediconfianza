import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 

import { WeekService } from '../services/week-calculator.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true, // <-- Marca el componente como standalone
  imports: [
    IonicModule,
    CommonModule,
    FormsModule   
  ],
})
export class HomePage implements OnInit {

  selectedDate: string = new Date().toISOString(); 
  calculatedWeek: number | null = null;
  errorMessage: string | null = null;

  constructor(private weekCalculator: WeekCalculatorService) {}

  ngOnInit() {
    
    this.calculateWeek();
  }

  
  onDateChange(event: any) {
    
    const newDateValue = event.detail.value;
    if (newDateValue) {
      this.selectedDate = newDateValue; 
      this.calculateWeek(); 
    }
  }

 
  calculateWeek() {
    this.errorMessage = null; 
    try {
     
      this.calculatedWeek = this.weekCalculator.getWeekOfYear(this.selectedDate);
    } catch (error: any) {
      console.error("Error calculando la semana:", error);
      this.errorMessage = error.message || 'No se pudo calcular la semana.';
      this.calculatedWeek = null;
    }
  }

   
   calculateWeekFromTimestamp() {
     this.errorMessage = null;
     try {
       const timestamp = Date.now() + (7 * 86400000); 
       this.calculatedWeek = this.weekCalculator.getWeekOfYear(timestamp);
       this.selectedDate = new Date(timestamp).toISOString(); 
     } catch (error: any) {
       console.error("Error calculando la semana desde timestamp:", error);
       this.errorMessage = error.message || 'No se pudo calcular la semana.';
       this.calculatedWeek = null;
     }
   }
}
