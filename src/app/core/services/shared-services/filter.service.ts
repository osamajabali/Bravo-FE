import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Grade, Section, Subject } from '../../models/header-models/header.model';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSection {
  id: number;
  name: string;
  expanded: boolean;
  options: any[];
  selectedOption: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterSectionsSubject = new BehaviorSubject<FilterSection[]>([
    {
      id : 1,
      name: 'Select Grade',
      expanded: false,
      options: [],
      selectedOption: null
    },
    {
      id : 2,
      name: 'Select Section',
      expanded: false,
      options: [],
      selectedOption: null
    },
    {
      id : 3,
      name: 'Select Subject',
      expanded: false,
      options: [],
      selectedOption: null
    }
  ]);

  private selectedFiltersTextSubject = new BehaviorSubject<string>('Choose properties');

  constructor() { }

  getFilterSections(): Observable<FilterSection[]> {
    return this.filterSectionsSubject.asObservable();
  }

  getCurrentFilterSections(): FilterSection[] {
    return this.filterSectionsSubject.getValue();
  }

  updateFilterSections(sections: any[]): void {
    this.filterSectionsSubject.next([...sections]);
  }

  getSelectedFiltersText(): Observable<string> {
    return this.selectedFiltersTextSubject.asObservable();
  }

  updateSelectedFiltersText(text: string): void {
    this.selectedFiltersTextSubject.next(text);
  }

  toggleFilterSection(sectionToToggle: any): void {
    const sections = this.getCurrentFilterSections();
    
    // Update the sections by toggling the specified section and closing others
    const updatedSections = sections.map(section => ({
      ...section,
      expanded: section.name === sectionToToggle.name 
        ? !section.expanded 
        : false
    }));
    
    this.updateFilterSections(updatedSections);
  }

  applyFilters(): void {
    const sections = this.getCurrentFilterSections();
    const selectedOptions = sections
      .filter(section => section.selectedOption !== null)
      .map(section => {
        const selectedOption = section.options.find(opt => opt.value === section.selectedOption);
        return selectedOption ? selectedOption.label : '';
      })
      .filter(label => label !== '');

    const text = selectedOptions.length > 0 
      ? selectedOptions.join(', ') 
      : 'Choose properties';
    
    this.updateSelectedFiltersText(text);
  }

  clearAllFilters(): void {
    const sections = this.getCurrentFilterSections();
    
    const resetSections = sections.map(section => ({
      ...section,
      expanded: false,
      selectedOption: null
    }));
    
    this.updateFilterSections(resetSections);
    this.updateSelectedFiltersText('Choose properties');
  }
} 