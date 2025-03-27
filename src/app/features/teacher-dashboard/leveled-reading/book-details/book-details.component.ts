import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { MenuItem } from 'primeng/api';
import { BookInfoComponent } from './tabs/book-info/book-info.component';
import { BookQuestionsComponent } from './tabs/book-questions/book-questions.component';
import { ImageDialogComponent } from "../../../../shared/components/image-dialog/image-dialog.component";
import { FormsModule } from '@angular/forms';

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
    DialogModule,
    GalleriaModule,
    BookInfoComponent,
    BookQuestionsComponent,
    ImageDialogComponent,
    FormsModule
],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent {
  activeTab: string = 'book-details';
  showReader = false;
  activeIndex = 0;

  book: BookDetail = {
    subject: 'Arabic',
    title: 'القراءة للمبتدئين - المستوى الأول',
    coverImage: 'assets/images/book-image.svg'
  };

  // Sample pages for the book (using the same image for demo)
  bookPages = [
    'assets/images/book-image.svg',
    'assets/images/book-image.svg',
    'assets/images/book-image.svg',
    'assets/images/book-image.svg',
    'assets/images/book-image.svg'
  ];

  tabs: MenuItem[] = [
    { label: 'Book Details', icon: 'pi pi-book' },
    { label: 'Questions', icon: 'pi pi-question-circle' },
    { label: 'Comprehension Skills', icon: 'pi pi-chart-bar' }
  ];

  readNow() {
    this.showReader = true;
  }

} 