import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-smart-board',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './smart-board.component.html',
  styleUrl: './smart-board.component.scss'
})
export class SmartBoardComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  
  @Input() skillId: number = 0;
  @Input() skillTitle: string = '';
  closeBoard(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
} 