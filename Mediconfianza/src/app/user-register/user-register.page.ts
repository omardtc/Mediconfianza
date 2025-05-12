import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonButton, IonSelectOption} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Paciente, PacienteService } from '../paciente.service';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.page.html',
  styleUrls: ['./user-register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonButton, IonSelectOption, ReactiveFormsModule]
})
export class UserRegisterPage implements OnInit {

  email: string = '';
  password: string = '';

  apellido = new FormControl('',[Validators.required,Validators.minLength(1)]);
  estado = new FormControl('',[Validators.required,Validators.minLength(1)]);
  fecha = new FormControl('',[Validators.required,Validators.minLength(1)]);
  nombre = new FormControl('',[Validators.required,Validators.minLength(1)]);
  sexo = new FormControl('',[Validators.required,Validators.minLength(1)]);
  telefono = new FormControl('',[Validators.required,Validators.minLength(1)]);



  constructor(
    private authService: AuthService, 
    private alertController: AlertController, 
    private router: Router,
    private pS: PacienteService,
  ) { }

  ngOnInit() {
  }

  userID: string = '';
  userE: string | null = null;

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
    if(this.validate()){
      try {
        const nPaciente: Paciente = {
          apellido: this.apellido.value!,
          estado: this.estado.value!,
          fecha: this.fecha.value!,
          id: this.userID!,
          nombre: this.nombre.value!,
          sexo: this.sexo.value!,
          telefono: this.telefono.value!,
          password: this.password!,
          mail: this.email!,
        };
        await this.pS.addPaciente(nPaciente);
        const alerta = await this.alertController.create({
          header: 'SUCCESS',
          message: 'hola',
          buttons: ['adios'],
        });
        alerta.present();
      } catch (error) {
        const alerta = await this.alertController.create({
          header: 'FUNNY FAIL',
          message: 'Bruno joke, eh?',
          buttons: ['WhYyYyy????'],
        });
        alerta.present();
        this.reset();
      }
    } else {
      console.log('Invalido');
    }

    if (this.validate())console.log('VALIDO');
    else console.log('INVALIDO X2');
  }

  validate(){
    console.log(this.apellido.value + ' ' + this.apellido.valid);
    console.log(this.estado.value + ' ' + this.estado.valid);
    console.log(this.fecha.value + ' ' + this.fecha.valid);
    console.log(this.nombre.value + ' ' + this.nombre.valid);
    console.log(this.sexo.value + ' ' + this.sexo.valid);
    console.log(this.telefono.value + ' ' + this.telefono.valid);
    return this.apellido.valid && this.estado.valid && this.fecha.valid && this.nombre.valid && this.sexo.valid && this.telefono.valid;
  }

  reset(){
    console.log('----->  RESET  <-----');
    this.apellido.reset;
    this.estado.reset;
    this.fecha.reset;
    this.nombre.reset;
    this.telefono.reset;
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  onSignup() {
    this.router.navigateByUrl("signup");
  }

}