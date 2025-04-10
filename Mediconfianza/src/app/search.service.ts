// src/app/services/doctor-search.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, map, delay } from 'rxjs';
// Importa la interfaz desde el archivo de la PÁGINA ahora
import { Doctor } from '../pages/doctor-search/doctor-search.page'; // *** CAMBIO AQUÍ ***

// --- Mock Data (Reemplazar con tu lógica de Firestore) ---
const MOCK_DOCTORS: Doctor[] = [
  { id: '1', nombre: 'Ana', apellido: 'Gomez', especialidad: 'Cardiología', estado: 'Jalisco', telefono: '3331112222', mail: 'ana.gomez@mail.com' },
  { id: '2', nombre: 'Carlos', apellido: 'Lopez', especialidad: 'Pediatría', estado: 'Jalisco', telefono: '3333334444', mail: 'carlos.lopez@mail.com' },
  { id: '3', nombre: 'Sofia', apellido: 'Martinez', especialidad: 'Dermatología', estado: 'Nuevo León', telefono: '8112223333', mail: 'sofia.m@mail.com' },
  { id: '4', nombre: 'Luis', apellido: 'Hernandez', especialidad: 'Cardiología', estado: 'Nuevo León', telefono: '8114445555', mail: 'luis.h@mail.com' },
  { id: '5', nombre: 'Andrea', apellido: 'Perez', especialidad: 'Pediatría', estado: 'CDMX', telefono: '5556667777', mail: 'andrea.p@mail.com' },
];
// --- Fin Mock Data ---

@Injectable({
  providedIn: 'root'
})
export class DoctorSearchService {

  constructor() { }

  getAllDoctors(): Observable<Doctor[]> {
    // Lógica Firestore o Mock como antes...
    return of(MOCK_DOCTORS).pipe(delay(500));
  }

  searchDoctors(
    searchTerm: string | null | undefined,
    state: string | null | undefined,
    specialty: string | null | undefined
  ): Observable<Doctor[]> {
    // Lógica Firestore o Mock como antes...
    return this.getAllDoctors().pipe(
        map(doctors => {
            let filteredDoctors = doctors;
            const lowerTerm = searchTerm?.toLowerCase() ?? '';
            const lowerState = state?.toLowerCase() ?? '';
            const lowerSpecialty = specialty?.toLowerCase() ?? '';

            if (lowerTerm) {
            filteredDoctors = filteredDoctors.filter(doc =>
                doc.nombre.toLowerCase().includes(lowerTerm) ||
                doc.apellido.toLowerCase().includes(lowerTerm)
            );
            }
            if (state && state !== 'todos') {
                filteredDoctors = filteredDoctors.filter(doc => doc.estado.toLowerCase() === lowerState);
            }
            if (specialty && specialty !== 'todos') {
                filteredDoctors = filteredDoctors.filter(doc => doc.especialidad.toLowerCase() === lowerSpecialty);
            }
            return filteredDoctors;
        }),
        delay(300)
    );
  }

  getAvailableStates(): Observable<string[]> {
    // Lógica Firestore o Mock como antes...
    return of([...new Set(MOCK_DOCTORS.map(d => d.estado))].sort())
      .pipe(delay(100));
  }

  getAvailableSpecialties(): Observable<string[]> {
     // Lógica Firestore o Mock como antes...
     return of([...new Set(MOCK_DOCTORS.map(d => d.especialidad))].sort())
       .pipe(delay(100));
  }
}
