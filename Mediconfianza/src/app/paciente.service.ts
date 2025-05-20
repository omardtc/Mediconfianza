import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Paciente {
  apellido: string;
  estado: string;
  fecha: string;
  uid: string;
  mail: string;
  nombre: string;
  password: string;
  sexo: string;  
  telefono: string;
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
  
    addPaciente(paciente: Paciente, id:string){
      const pacienteRef = doc(this.firestore, 'paciente', id); // UID como ID del documento
        return setDoc(pacienteRef, paciente);
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
