import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

interface CriteriaRow {
  label: string;
  criteria: string[];
  mark: number | null;
  isEditing: boolean;
}

@Component({
  selector: 'app-student-marking-drawer',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DrawerModule,
    FormsModule,
    InputNumberModule,
  ],
  templateUrl: './student-marking-drawer.component.html',
  styleUrl: './student-marking-drawer.component.scss',
})
export class StudentMarkingDrawerComponent {
  @Input() visible: boolean = false;
  @Input() studentName: string = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() submitMarking = new EventEmitter<CriteriaRow[]>();

  criteriaData: CriteriaRow[] = [
    {
      label: 'Content',
      criteria: [
        'Clarity of ideas, creativity in presentation, adherence to instructions, and overall effort.',
        "Each aspect plays a vital role in determining the student's understanding.",
        'Engagement with the material is clearly demonstrated.',
        'Content shows depth of understanding and critical thinking.',
        'Ideas are well-organized and logically structured.',
      ],
      mark: null,
      isEditing: false,
    },
    {
      label: 'Clarity',
      criteria: [
        'Writing is clear and easy to understand.',
        'Ideas are expressed in a logical sequence.',
        'Transitions between ideas are smooth and effective.',
        'Language is appropriate for the intended audience.',
        'Main points are clearly identified and supported.',
      ],
      mark: null,
      isEditing: false,
    },
    {
      label: 'Style & Language',
      criteria: [
        'Writing style is engaging and appropriate.',
        'Vocabulary is varied and sophisticated.',
        'Sentence structure shows variety and complexity.',
        'Tone is consistent and suitable for the purpose.',
        'Language conventions are followed correctly.',
      ],
      mark: null,
      isEditing: false,
    },
    {
      label: 'Literary Style',
      criteria: [
        'Use of literary devices enhances the writing.',
        'Creative expression is evident throughout.',
        'Voice and personality come through clearly.',
        'Imagery and descriptive language are effective.',
        'Overall artistic quality is high.',
      ],
      mark: null,
      isEditing: false,
    },
  ];

  weekDays = [
    {
      name: '[Sunday]',
      backgroundColor: '#FB49A5',
    },
    {
      name: '[Monday]',
      backgroundColor: '#5D4ABA',
    },
    {
      name: '[Tuesday]',
      backgroundColor: '#5D4ABA',
    },
    {
      name: '[Wednesday]',
      backgroundColor: '#2784DE',
    },
    {
      name: '[Thursday]',
      backgroundColor: '#007294',
    },
  ];

  legends = [
    {
      name: 'Pronunciation Error',
      backgroundColor: '#FB49A5',
    },
    {
      name: 'Removed Word',
      backgroundColor: '#5D4ABA',
    },
    {
      name: 'Added Word',
      backgroundColor: '#2784DE',
    },
    {
      name: 'Repeated Word',
      backgroundColor: '#007294',
    },
  ];

  onHide() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  onCancel() {
    this.onHide();
  }

  onSubmit() {
    this.submitMarking.emit(this.criteriaData);
    this.onHide();
  }

  onMarkClick(row: CriteriaRow) {
    row.isEditing = true;
    if (row.mark === null) {
      row.mark = 0;
    }
  }

  onMarkBlur(row: CriteriaRow) {
    if (row.mark === null || row.mark === 0) {
      row.isEditing = false;
      row.mark = null;
    }
  }

  onMarkChange(row: CriteriaRow, value: number | null) {
    row.mark = value;
    if (value !== null && value > 0) {
      row.isEditing = true;
    }
  }
}
