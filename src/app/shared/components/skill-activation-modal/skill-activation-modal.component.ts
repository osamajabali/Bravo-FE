import { Component, Input, input, model, OnInit, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { Section } from '../../../core/models/header-models/header.model';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { Subscription } from 'rxjs';

interface SelectedGrades {
  all: boolean;
  grade1: boolean;
  grade2: boolean;
}

@Component({
  selector: 'app-skill-activation-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule, CheckboxModule, FormsModule],
  templateUrl: './skill-activation-modal.component.html',
  styleUrl: './skill-activation-modal.component.scss'
})
export class SkillActivationModalComponent  {
  visible = model<boolean>(false);
  visibleChange = output<boolean>();
  modal = input<boolean>(true);
  closable = input<boolean>(true);
  closeOnEscape = input<boolean>(true);
  header = input<string>('');
  activateSections = output<number[]>();
  @Input() sections: Section[] = [];
  private refreshSubscription!: Subscription;
  selectedIds: number[] = [];
  allSelected: boolean = false;


  close() {
    this.visible.set(false);
    this.visibleChange.emit(this.visible());
  }

  _activateSkill() {
    this.selectedIds = this.sections
    .filter(section => section.isSelected)
    .map(section => section.courseSectionId);
    this.activateSections.emit(this.selectedIds);
    this.close();
  }

  toggleAll() {
    this.sections.forEach(section => {
      section.isSelected = this.allSelected;
    });

    this.selectedIds = this.sections
    .filter(section => section.isSelected)
    .map(section => section.courseSectionId);

    console.log(this.selectedIds)
  }

  onCheckboxChange() {
    this.selectedIds = this.sections
      .filter(section => section.isSelected)
      .map(section => section.courseSectionId);
  }
}
