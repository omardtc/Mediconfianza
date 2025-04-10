// src/app/pages/search/search.page.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, startWith, tap } from 'rxjs/operators';

// Importa el servicio (que ahora usa Firestore)
import { SearchService } from '../../services/search.service';

// Interfaz definida aquí DENTRO (se mantiene igual)
// Asegúrate que coincida con los campos de tu Firestore que quieres usar
export interface Doctor {
    id: string; // Firestore document ID
    nombre: string;
    apellido: string;
    especialidad: string;
    estado: string;
    cedula?: string; // Campo opcional
    direccion?: string; // Campo opcional
    mail?: string; // Campo opcional
    telefono?: string; // Campo opcional
    // Agrega aquí cualquier otro campo que necesites de Firestore
}

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        FormsModule
    ]
})
export class SearchPage implements OnInit {

    private searchService = inject(SearchService); // Inyecta el servicio actualizado

    // --- Variables del componente (sin cambios) ---
    searchTerm: string = '';
    selectedState: string = 'todos';
    selectedSpecialty: string = 'todos';

    // Subject para manejar cambios en los filtros
    private filterChanges = new Subject<void>();

    // Observables para los resultados y opciones
    doctors$: Observable<Doctor[]> | undefined;
    states$: Observable<string[]> | undefined;
    specialties$: Observable<string[]> | undefined;
    isLoading: boolean = false;
    searchPerformed: boolean = false; // Para saber si mostrar "no hay resultados"

    ngOnInit() {
        this.loadFilterOptions();
        this.setupSearchSubscription();
        // Disparar la carga inicial de datos (o esperar al primer cambio de filtro)
        this.filterChanges.next();
    }

    loadFilterOptions() {
        // Obtiene las opciones desde el servicio (que ahora usa Firestore)
        this.states$ = this.searchService.getAvailableStates().pipe(
             startWith([]) // Muestra vacío mientras carga
        );
        this.specialties$ = this.searchService.getAvailableSpecialties().pipe(
             startWith([])
        );
    }

    setupSearchSubscription() {
        this.doctors$ = this.filterChanges.pipe(
            // Usa debounce si quieres esperar un poco tras escribir antes de buscar
             debounceTime(300), // Espera 300ms tras el último cambio
            // distinctUntilChanged() // Podría ser útil si los filtros no cambian realmente
            tap(() => {
                this.isLoading = true;
                this.searchPerformed = true; // Marca que se intenta buscar
            }),
            // Llama al servicio (que ahora usa Firestore) con los valores actuales
            switchMap(() =>
                this.searchService.searchDoctors(
                    this.searchTerm,
                    this.selectedState,
                    this.selectedSpecialty
                )
            ),
            tap(() => this.isLoading = false), // Oculta el spinner
            catchError(error => {
                // Error ya debería manejarse en el servicio, pero podemos hacer algo más aquí si es necesario
                console.error('Error en la suscripción de búsqueda del componente:', error);
                this.isLoading = false;
                // Podrías mostrar un toast o mensaje de error general al usuario
                return of([]); // Devuelve array vacío para evitar romper el template
            })
        );
    }

    // Se llama cuando el valor del ion-searchbar cambia (o cualquier filtro)
    onFilterChange() {
        // Notifica al Subject que los filtros han cambiado para disparar la búsqueda
        this.filterChanges.next();
    }

    // Se llama específicamente desde el ion-searchbar (ionInput)
    // Podríamos unificarlo con onFilterChange si el debounce es suficiente
    onSearchInput(event: any) {
       this.searchTerm = event.target.value ?? '';
       this.onFilterChange(); // Dispara la búsqueda a través del Subject
    }


    // TrackBy para mejorar rendimiento del *ngFor (sin cambios)
    trackById(index: number, item: Doctor): string {
        return item.id;
    }
}
