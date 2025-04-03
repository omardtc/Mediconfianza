import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {AlertController} from '@ionic/angular';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import { Inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SignupPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private alertController: AlertController, private router: Router) { }

  async onSubmit(){
    try{
      await this.authService.signUp(this.email, this.password);
      const alert = await this.alertController.create({
        header: 'Sign up successful',
        message: 'Account created',
        buttons: ['OK'],
      });
      await alert.present();
      this.router.navigate(['/login']); 
    }catch (error){
      const alert = await this.alertController.create({
        header: 'Sign up failed',
        message: 'An error occurred',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  onSignUp() {
    this.router.navigateByUrl("login")
  }

  ngOnInit() {
  }

}