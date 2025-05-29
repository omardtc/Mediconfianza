import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConsultorioService } from '../consultorio.service';

@Component({
  selector: 'app-consultorio',
  templateUrl: './consultorio.page.html',
  styleUrls: ['./consultorio.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ConsultorioPage {

  userInput: string = '';
  respuesta: string = '';
  loading: boolean = false;

  constructor(private consultorioService: ConsultorioService) {}

  enviarPregunta() {
    if (!this.userInput.trim()) return;

    this.loading = true;
    this.respuesta = '';

    this.consultorioService.generateIdea(this.userInput).subscribe({
      next: (respuestaIA) => {
        this.respuesta = respuestaIA;
        this.loading = false;
      },
      error: (error) => {
        this.respuesta = 'Hubo un error procesando tu consulta. Intenta nuevamente.';
        this.loading = false;
        console.error(error);
      }
    });
  }
}
