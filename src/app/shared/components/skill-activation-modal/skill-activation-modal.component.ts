import { Component, input, model, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

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
export class SkillActivationModalComponent {
  visible = model<boolean>(false);
  visibleChange = output<boolean>();
  modal = input<boolean>(false);
  closable = input<boolean>(false);
  closeOnEscape = input<boolean>(false);
  header = input<string>('');

  activateSkill = output<SelectedGrades>();

  selectedGrades: SelectedGrades = {
    all: false,
    grade1: false,
    grade2: false
  };

  close() {
    this.visible.set(false);
    this.visibleChange.emit(this.visible());
  }

  _activateSkill() {
    this.close();
    this.activateSkill.emit(this.selectedGrades);
  }
}
