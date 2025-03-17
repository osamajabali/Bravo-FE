import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Book } from '../../../../core/models/teacher-dashboard-models/leveled-reading';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-book-list-view',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    DropdownModule, 
    InputTextModule,
    FormsModule,
    PaginationComponent
  ],
  templateUrl: './book-list-view.component.html',
  styleUrl: './book-list-view.component.scss'
})
export class BookListViewComponent {
  router = inject(Router);
  // Search and filters
  searchQuery: string = '';
  showAdvancedSearch = false;
  
  // Basic filters
  mainLevels: any[] = [
    { label: 'All Levels', value: null },
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' }
  ];
  subLevels: any[] = [
    { label: 'All Sub Levels', value: null },
    { label: 'أ', value: 'أ' },
    { label: 'ب', value: 'ب' },
    { label: 'ت', value: 'ت' },
    { label: 'ث', value: 'ث' },
    { label: 'ج', value: 'ج' },
    { label: 'ح', value: 'ح' },
    { label: 'خ', value: 'خ' },
    { label: 'د', value: 'د' }
  ];
  selectedMainLevel: any = null;
  selectedSubLevel: any = null;

  // Advanced filters
  skills: any[] = [{ label: 'Reading Skills', value: 'reading' }];
  grades: any[] = [{ label: 'Grade 1', value: 'grade1' }];
  comprehensionSkills: any[] = [{ label: 'Analysis', value: 'analysis' }];
  subjects: any[] = [{ label: 'Arabic', value: 'arabic' }];
  hubs: any[] = [{ label: 'Main Hub', value: 'main' }];
  ibHubs: any[] = [{ label: 'IB Hub 1', value: 'ib1' }];
  ibLearnerProfiles: any[] = [{ label: 'Profile 1', value: 'profile1' }];
  literaryTypes: any[] = [{ label: 'Fiction', value: 'fiction' }];
  authorNames: any[] = [{ label: 'Ahmed Mohammed', value: 'ahmed' }];
  publishers: any[] = [{ label: 'Al-Kitab', value: 'alkitab' }];
  illustrators: any[] = [{ label: 'Sara Ahmed', value: 'sara' }];
  ageGroups: any[] = [{ label: '5-7 years', value: '5-7' }];

  selectedSkills: any = null;
  selectedGrade: any = null;
  selectedComprehensionSkills: any = null;
  selectedSubject: any = null;
  selectedHub: any = null;
  selectedIbHub: any = null;
  selectedIbLearnerProfile: any = null;
  selectedLiteraryType: any = null;
  selectedAuthorName: any = null;
  selectedPublisher: any = null;
  selectedIllustrator: any = null;
  selectedAgeGroup: any = null;
  
  // Pagination
  first: number = 0;
  rows: number = 9;
  totalRecords: number = 0;
  
  // Books data
  books: Book[] = [
    {
      title: 'من معالم القرآن',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'محطة الشباب',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'حجر سقراط في الجبال',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'الأرملة و الصبي',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'لغة، أيها المجد؟',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'بريق طه',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'بريق طه',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'بريق طه',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'بريق طه',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
  ];

  ngOnInit(): void {
    this.totalRecords = this.books.length;
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  onSearch() {
    // TODO: Implement search functionality
  }

  onMainLevelChange() {
    // TODO: Implement main level filter
  }

  onSubLevelChange() {
    // TODO: Implement sub level filter
  }

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  onAdvancedSearch() {
    // TODO: Implement advanced search
    this.showAdvancedSearch = false;
  }

  onCancelAdvancedSearch() {
    this.showAdvancedSearch = false;
  }

  onResetAdvancedSearch() {
    this.selectedSkills = null;
    this.selectedGrade = null;
    this.selectedComprehensionSkills = null;
    this.selectedSubject = null;
    this.selectedHub = null;
    this.selectedIbHub = null;
  }

  viewBook(book: Book) {
    this.router.navigate(['/features/book-details']);
  }
} 