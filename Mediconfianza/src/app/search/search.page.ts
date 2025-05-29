import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, startWith, tap } from 'rxjs/operators';

import { SearchService } from '../../services/search.service'; // Adjusted path
import { Medico } from '../../services/medico.service';      // Adjusted path

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

  private searchService = inject(SearchService);

  searchTerm: string = '';
  selectedState: string = 'todos';
  selectedSpecialty: string = 'todos';

  private filterChanges = new Subject<void>();

  doctors$: Observable<Medico[]> | undefined;
  states$: Observable<string[]> | undefined;
  specialties$: Observable<string[]> | undefined;

  isLoading: boolean = false;
  searchPerformed: boolean = false;

  ngOnInit() {
    this.loadFilterOptions();
    this.setupSearchSubscription();

    // ---- MODIFICATION FOR DEFAULT DISPLAY ----
    // Set loading and searchPerformed to true for the initial automatic search.
    this.isLoading = true;
    this.searchPerformed = true; // Signifies an initial search attempt is happening.
    // ---- END MODIFICATION ----

    this.filterChanges.next(); // Trigger the initial search (which will fetch all by default)
  }

  loadFilterOptions() {
    this.states$ = this.searchService.getAvailableStates().pipe(
      startWith([])
    );
    this.specialties$ = this.searchService.getAvailableSpecialties().pipe(
      startWith([])
    );
  }

  setupSearchSubscription() {
    this.doctors$ = this.filterChanges.pipe(
      // The first emission will be from ngOnInit.
      // For subsequent emissions (user interaction), debounceTime will apply.
      debounceTime(300), // Wait 300ms after the last filter change
      tap(() => {
        // This tap is now primarily for subsequent searches after the initial load.
        // For initial load, ngOnInit has already set isLoading = true.
        this.isLoading = true;
        this.searchPerformed = true; // Ensure it's true for any search action
      }),
      switchMap(() =>
        this.searchService.searchDoctors(
          this.searchTerm,
          this.selectedState,
          this.selectedSpecialty
        )
      ),
      tap(() => {
        this.isLoading = false; // Hide spinner after search completes
      }),
      catchError(error => {
        console.error('Error in component search subscription:', error);
        this.isLoading = false;
        this.searchPerformed = true; // A search was attempted, even if it failed
        return of([]); // Return empty array to prevent breaking the template
      })
    );
  }

  onFilterChange() {
    this.filterChanges.next();
  }

  onSearchInput(event: any) {
    // event.target.value is correct when ion-searchbar's [debounce] is not used.
    this.searchTerm = event.target.value ?? '';
    this.onFilterChange();
  }

  trackById(index: number, item: Medico): string {
    return item.uid; // Assuming uid is the unique identifier for tracking
  }
}
