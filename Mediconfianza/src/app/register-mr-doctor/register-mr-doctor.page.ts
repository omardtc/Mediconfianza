import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonButton } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register-mr-doctor',
  templateUrl: './register-mr-doctor.page.html',
  styleUrls: ['./register-mr-doctor.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonButton]
})
export class RegisterMrDoctorPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService, 
    private alertController: AlertController, 
    private router: Router
  ) { }

  ngOnInit() {
  }

  async onSubmit() {
    try {
      await this.authService.signUp(this.email, this.password);
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'You have signed up successfully!',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigate(['/home']);
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Invalid email or password.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  onSignup() {
    this.router.navigateByUrl("signup");
  }


}
