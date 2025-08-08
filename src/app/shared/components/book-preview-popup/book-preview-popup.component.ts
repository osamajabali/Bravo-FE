import { ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';

interface Question {
  id: number;
  image: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-book-preview-popup',
  imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, DialogModule, TranslateModule],
  templateUrl: './book-preview-popup.component.html',
  styleUrl: './book-preview-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookPreviewPopupComponent {
  @Input() visible: boolean = false;
  @Input() skillName: string = '';
  @Input() difficultyLevel: string = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() questionsSelected = new EventEmitter<Question[]>();

  selectedFilter: string = 'Show All';
  currentSlideIndex: number = 0;
  
  filterOptions = ['Show All', 'Split Characters', 'Drag & Drop', 'Multiple Choice'];
  
  // Sample questions data - in real app, this would come from API
  questions: Question[] = [
    { id: 1, image: 'assets/images/book-image.svg', isSelected: false },
    { id: 2, image: 'assets/images/book-image.svg', isSelected: false },
    { id: 3, image: 'assets/images/book-image.svg', isSelected: false },
    { id: 4, image: 'assets/images/book-image.svg', isSelected: false },
    { id: 5, image: 'assets/images/book-image.svg', isSelected: false }
  ];

  get totalSelectedQuestions(): number {
    return this.questions.filter(q => q.isSelected).length || 0;
  };

  get currentQuestion(): Question {
    return this.questions[this.currentSlideIndex];
  }

  get currentPages(): Question[] {
    const pages = [];
    // Left page (even index)
    if (this.currentSlideIndex < this.questions.length) {
      pages.push(this.questions[this.currentSlideIndex]);
    }
    // Right page (odd index)
    if (this.currentSlideIndex + 1 < this.questions.length) {
      pages.push(this.questions[this.currentSlideIndex + 1]);
    }
    return pages;
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    // In real app, this would filter the questions based on type
  }

  previousSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex -= 2; // Move back by 2 pages
      if (this.currentSlideIndex < 0) {
        this.currentSlideIndex = 0;
      }
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.questions.length - 1) {
      this.currentSlideIndex += 2; // Move forward by 2 pages
      if (this.currentSlideIndex >= this.questions.length) {
        this.currentSlideIndex = this.questions.length - 1;
      }
    }
  }

  toggleQuestionSelection(question: Question, isSelected?: boolean) {
    if (isSelected !== undefined) {
      question.isSelected = isSelected;
    } else {
      question.isSelected = !question.isSelected;
    }
  }

  onCancel() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onSubmit() {
    const selectedQuestions = this.questions.filter(q => q.isSelected);
    this.questionsSelected.emit(selectedQuestions);
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onHide() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
} 