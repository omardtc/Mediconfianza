import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Medico {
  apellido: string;
  cedula: string;
  direccion: string;
  especialidad: string;
  estado: string;
  fecha: string;
  id: string;
  mail: string;
  nombre: string;
  password: string;
  telefono: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private firestore: Firestore) { }

  private medicoC = collection(this.firestore, 'medico');

  getMedicos(): Observable<Medico[]>{
    return collectionData(this.medicoC,{idField: 'id'}) as Observable <Medico[]>;
  }

  addMedico(medico: Medico){
    return addDoc(this.medicoC, medico);
  }

  updateMedico(id: string, data: Partial <Medico>){
    const medicoDoc = doc(this.firestore, `medico/${id}`);
    return updateDoc(medicoDoc, data);
  }

  deleteMedico(id: string){
    const medicoDoc = doc(this.firestore, `medico/${id}`);
    return deleteDoc(medicoDoc);
  }

}
