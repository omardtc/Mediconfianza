// src/app/services/search.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, of, map, catchError, combineLatest, shareReplay } from 'rxjs';
import {
    Firestore,
    collection,
    collectionData,
    query,
    where,
    QueryConstraint // Usado para construir queries dinámicas
} from '@angular/fire/firestore';

// Importa la interfaz desde el archivo de la PÁGINA
// import { Doctor } from '/search/search.page';
import { Medico, MedicoService } from './medico.service';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private firestore: Firestore = inject(Firestore); // Inyección moderna de Firestore
    private doctorsCollectionRef = collection(this.firestore, 'medico'); // Referencia a la colección

    // Observable para obtener todos los doctores una vez y reutilizarlo
    // Útil para obtener estados/especialidades sin múltiples lecturas completas
    private allDoctors$ = (collectionData(this.doctorsCollectionRef, { idField: 'id' }) as Observable<Medico[]>).pipe(
        catchError(error => {
            console.error("Error fetching all doctors for options: ", error);
            return of([]); // Devuelve array vacío en caso de error
        }),
        shareReplay(1) // Cachea el último valor emitido y lo comparte entre suscriptores
    );

    constructor() { }

    // Método principal de búsqueda con Firestore
    searchDoctors(
        searchTerm: string | null | undefined,
        state: string | null | undefined,
        specialty: string | null | undefined
    ): Observable<Medico[]> {
        console.log('Searching with:', { searchTerm, state, specialty }); // Para depuración

        // Array para guardar las condiciones 'where' de Firestore
        const constraints: QueryConstraint[] = [];

        // Añadir filtros de Firestore si se seleccionaron
        if (state && state !== 'todos') {
            constraints.push(where('estado', '==', state));
        }
        if (specialty && specialty !== 'todos') {
            constraints.push(where('especialidad', '==', specialty));
        }

        // Construir la query final
        const finalQuery = query(this.doctorsCollectionRef, ...constraints);

        // Obtener los datos filtrados por Firestore (estado/especialidad)
        return (collectionData(finalQuery, { idField: 'id' }) as Observable<Medico[]>).pipe(
            // Inside SearchService - searchDoctors method - map operator

// ...
map((doctors: Medico[]) => {
    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase().trim(); // trim searchTerm as well
        // if (lowerTerm === '') return doctors; // Optional: if trimmed searchTerm is empty, don't filter by name

        return doctors.filter((doc: Medico) =>
            (doc.nombre?.trim().toLowerCase() || '').includes(lowerTerm) ||
            (doc.apellido?.trim().toLowerCase() || '').includes(lowerTerm)
        );
    }
    return doctors;
}),
// ...
            catchError(error => {
                console.error("Error searching doctors in Firestore: ", error);
                // Considera mostrar un mensaje al usuario aquí
                return of([]); // Devuelve array vacío en caso de error
            })
        );
    }

    // Obtener estados únicos usando el observable cacheado allDoctors$
    getAvailableStates(): Observable<string[]> {
        return this.allDoctors$.pipe(
            map(doctors => [...new Set(doctors.map(d => d.estado))].sort()),
            catchError(error => {
                console.error("Error getting available states: ", error);
                return of([]);  
                        })
        );
    }

    // Obtener especialidades únicas usando el observable cacheado allDoctors$
    getAvailableSpecialties(): Observable<string[]> {
        return this.allDoctors$.pipe(
            map(doctors => [...new Set(doctors.map(d => d.especialidad))].sort()),
            catchError(error => {
                console.error("Error getting available specialties: ", error);
                return of([]);
            })
        );
    }
}
