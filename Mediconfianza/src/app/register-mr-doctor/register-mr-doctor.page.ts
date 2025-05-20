import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonButton } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Medico, MedicoService } from '../medico.service';

@Component({
  selector: 'app-register-mr-doctor',
  templateUrl: './register-mr-doctor.page.html',
  styleUrls: ['./register-mr-doctor.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, IonList, IonItem, IonLabel, IonInput, IonDatetime, IonButton]
})
export class RegisterMrDoctorPage implements OnInit {

  email: string = '';
  password: string = '';

  apellido = new FormControl('',[Validators.required,Validators.minLength(1)]);
  cedula = new FormControl('',[Validators.required,Validators.minLength(1)]);
  direccion = new FormControl('',[Validators.required,Validators.minLength(1)]);
  especialidad = new FormControl('',[Validators.required,Validators.minLength(1)]);
  estado = new FormControl('',[Validators.required,Validators.minLength(1)]);
  fecha = new FormControl('',[Validators.required,Validators.minLength(1)]);
  nombre = new FormControl('',[Validators.required,Validators.minLength(1)]);
  telefono = new FormControl('',[Validators.required,Validators.minLength(1)]);

  constructor(
    private authService: AuthService, 
    private alertController: AlertController, 
    private router: Router,
    private mS: MedicoService,
  ) { }

  ngOnInit() {
  }

  userE: string | null = null;
  userID: string = '';

  async onSubmit() {
    if (this.validate()){
    try {
      await this.authService.signUp(this.email, this.password);
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'You have signed up successfully!',
        buttons: ['OK']
      });
      await alert.present();
      const user = await this.authService.currentUser();
      if (user){
        this.userE = user.email;
        this.userID = user.uid;
      }
      console.log(this.userE + ": " + this.userID);
      //this.router.navigate(['/home']);
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Invalid email or password.',
        buttons: ['OK']
      });
      await alert.present();
    }//registra el gmail
      try {
        const nmedico: Medico = {
          apellido: this.apellido.value!,
          cedula: this.cedula.value!,
          direccion: this.direccion.value!,
          especialidad: this.especialidad.value!,
          estado: this.estado.value!,
          fecha: this.fecha.value!,
          uid: this.userID,
          mail: this.email,
          nombre: this.nombre.value!,
          password: this.password,
          telefono: this.telefono.value!,
          status: 'MEDICO',
          horario: '',
        };
        await this.mS.addMedico(nmedico, this.userID);
        const alerta = await this.alertController.create({
          header: 'SUCCESS',
          message: 'Funny joke, eh?',
          buttons: ['HAHAHA'],
        });
        alerta.present();

        try {
      await this.authService.login(this.email, this.password);
      const alert = await this.alertController.create({
        header: 'Success',
        message: 'You have logged in successfully!',
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

      } catch (error) {
        const alerta = await this.alertController.create({
          header: 'FUNNY FAIL',
          message: 'Bruno joke, eh?',
          buttons: ['WhYyYyy????'],
        });
        alerta.present();
        this.reset();
      }
    }else{
      console.log('INVALIDO');
    }

    if (this.validate())console.log('VALIDO');
    else console.log('INVALIDO X2');
  }

  validate(){
    console.log(this.apellido.value + ' ' + this.apellido.valid);
    console.log(this.cedula.value + ' ' + this.cedula.valid);
    console.log(this.direccion.value + ' ' + this.direccion.valid);
    console.log(this.especialidad.value + ' ' + this.especialidad.valid);
    console.log(this.estado.value + ' ' + this.estado.valid);
    console.log(this.fecha.value + ' ' + this.fecha.valid);
    console.log(this.nombre.value + ' ' + this.nombre.valid);
    console.log(this.telefono.value + ' ' + this.telefono.valid);
    return this.apellido.valid && this.cedula.valid && this.direccion.valid && this.especialidad.valid && this.estado.valid && this.fecha.valid && this.nombre.valid && this.telefono.valid;
  }

  reset(){
    console.log('----->  RESET  <-----');
    this.apellido.reset;
    this.cedula.reset;
    this.direccion.reset;
    this.especialidad.reset;
    this.estado.reset;
    this.fecha.reset;
    this.nombre.reset;
    this.telefono.reset;
  }


}
