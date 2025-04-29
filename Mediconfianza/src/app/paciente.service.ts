import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Paciente {
  apellido: string;
  direccion: string;
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
export class PacienteService {

  constructor(private firestore: Firestore) { }

    private pacienteC = collection(this.firestore, 'paciente');
  
    getPacientes(): Observable<Paciente[]>{
      return collectionData(this.pacienteC,{idField: 'id'}) as Observable <Paciente[]>;
    }
  
    addPaciente(paciente: Paciente){
      return addDoc(this.pacienteC, paciente);
    }
  
    updatePaciente(id: string, data: Partial <Paciente>){
      const esPaciente = doc(this.firestore, `paciente/${id}`);
      return updateDoc(esPaciente, data);
    }
  
    deletePaciente(id: string){
      const esPaciente = doc(this.firestore, `paciente/${id}`);
      return deleteDoc(esPaciente);
    }
}
