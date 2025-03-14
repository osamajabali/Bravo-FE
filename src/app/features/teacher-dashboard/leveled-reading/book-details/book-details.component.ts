import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { BookInfoComponent } from './tabs/book-info/book-info.component';
import { BookQuestionsComponent } from './tabs/book-questions/book-questions.component';
import { BookComprehensionComponent } from './tabs/book-comprehension/book-comprehension.component';

interface BookDetail {
  subject: string;
  title: string;
  coverImage: string;
}

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    TabMenuModule,
    ButtonModule,
    BookInfoComponent,
    BookQuestionsComponent,
    BookComprehensionComponent
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent {
  activeTab: string = 'book-details';
  
  book: BookDetail = {
    subject: 'Arabic',
    title: 'القراءة للمبتدئين - المستوى الأول',
    coverImage: 'assets/images/book-image.svg'
  };

  tabs: MenuItem[] = [
    { label: 'Book Details', icon: 'pi pi-book' },
    { label: 'Questions', icon: 'pi pi-question-circle' },
    { label: 'Comprehension Skills', icon: 'pi pi-chart-bar' }
  ];

  readNow() {
    // TODO: Implement read now functionality
  }
} 