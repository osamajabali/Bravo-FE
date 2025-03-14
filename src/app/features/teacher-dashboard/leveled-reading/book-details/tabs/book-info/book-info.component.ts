import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BookDetails {
  literaryType: string;
  numberOfPages: number;
  numberOfWords: number;
  authorName: string;
  publisher: string;
  illustrator: string;
  hub: string;
  ibHub: string;
  ibLearnerProfile: string;
  ageGroup: string;
  mainLevel: string;
  subLevel: string;
}

@Component({
  selector: 'app-book-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.scss']
})
export class BookInfoComponent {
  bookDetails: BookDetails = {
    literaryType: 'Fiction',
    numberOfPages: 24,
    numberOfWords: 1200,
    authorName: 'Ahmed Mohammed',
    publisher: 'Al-Kitab',
    illustrator: 'Sara Ahmed',
    hub: 'Main Hub',
    ibHub: 'IB Hub 1',
    ibLearnerProfile: 'Inquirer',
    ageGroup: '5-7 years',
    mainLevel: 'Beginner',
    subLevel: 'أ'
  };
}
