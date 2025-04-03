import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonItem, 
  IonButton, 
  IonInput 
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonButton, IonInput]
})
export class PasswordPage implements OnInit {
  email: string = ''; 

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async onResetPassword() {
    if (!this.email || !this.validateEmail(this.email)) {
      this.showAlert('Error', 'Por favor, introduce un correo electrónico válido.');
      return;
    }

    try {
      await this.authService.resetPassword(this.email);
      await this.showAlert('Éxito', 'Revisa tu correo para restablecer tu contraseña.');
      this.router.navigate(['/login']);
    } catch (error) {
      const errorMessage = this.getFirebaseErrorMessage(error);
      this.showAlert('Error', errorMessage);
    }
  }

  validateEmail(email: string): boolean {
    // Expresión regular para validar correos electrónicos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  getFirebaseErrorMessage(error: any): string {
    if (error.code === 'auth/invalid-email') {
      return 'El correo electrónico no es válido.';
    } else if (error.code === 'auth/user-not-found') {
      return 'No se encontró una cuenta con este correo.';
    } else {
      return 'Hubo un error. Inténtalo de nuevo más tarde.';
    }
  }
}