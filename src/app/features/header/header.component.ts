import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private renderer: Renderer2) {}
  notificationCount: number = 3; // Example notification count
  userName: string = 'Laila Aslama';
  position: string = 'Teacher';

  grades = ['Grade 1', 'Grade 2', 'Grade 3'];
  sections = ['Section 1', 'Section 2', 'Section 3'];
  subjects = ['Subject A', 'Subject B', 'Subject C'];

  // Store the selected values
  selectedGrade: string | null = null;
  selectedSection: string | null = null;
  selectedSubject: string | null = null;
  dropdownOpen: boolean = false; // Track dropdown visibility
  displayFilter: string = 'Select filters'; // Initializes the display filter

  // Method to apply the filter
  applyFilter($event) {
    $event.stopPropagation();
    this.displayFilter =
      (this.selectedGrade ? this.selectedGrade : 'Select ') +
      ', ' +
      (this.selectedSection ? this.selectedSection : '') +
      ', ' +
      (this.selectedSubject ? this.selectedSubject : '');

    console.log('Applying filter with:', {
      grade: this.selectedGrade,
      section: this.selectedSection,
      subject: this.selectedSubject,
    });
    this.dropdownOpen = false; // Optionally close after applying the filter
  }

  // Method to clear all selections
  clearAll($event) {
    $event.stopPropagation();
    this.selectedGrade = null;
    this.selectedSection = null;
    this.selectedSubject = null;
    this.displayFilter = 'Select filters'; // Reset display filter
    this.dropdownOpen = false; // Optionally close on clear
  }

  // Update dropdown title dynamically (may not be necessary)
  updateDropdownTitle() {
    // This method can be used to update logic if needed
  }

  // Toggle dropdown visibility
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen; // Toggle the dropdown state
  }
}
