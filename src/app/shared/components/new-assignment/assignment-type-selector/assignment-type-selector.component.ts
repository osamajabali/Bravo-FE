import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddingAssignmentService } from '../../../../core/services/assignment/adding-assignment.service';
import { AssignmentTypes } from '../../../../core/models/assignment/assignment-types.model';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../../core/services/shared-services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assignment-type-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignment-type-selector.component.html',
  styleUrl: './assignment-type-selector.component.scss'
})
export class AssignmentTypeSelectorComponent implements OnInit, OnDestroy {

  @Input() selectedAssignmentType: AssignmentTypes | null = null;
  @Input() callApi: boolean = false;
  @Output() selectedAssignmentTypeChange = new EventEmitter<AssignmentTypes>();
  @Output() callApiChange = new EventEmitter<boolean>();
  addingAssignmentsService = inject(AddingAssignmentService);
  sharedService = inject(SharedService);
  route = inject(ActivatedRoute);

  assignmentTypes: AssignmentTypes[] = [];
  isFirst: boolean = false;

  ngOnInit(): void {
    if (this.callApi) {
      this.getAssignmentsTypes();
    } else {
      this.sharedService.refresh$.subscribe((data) => {
        if (data) {
          this.getAssignmentsTypes();
        }
      })
    }
  }

  getAssignmentsTypes() {
    this.addingAssignmentsService.getAssignmenttypes().subscribe(res => {
      if (res.success) {
        this.assignmentTypes = res.result;
        if (localStorage.getItem('selectedAssignmentType')) {
          this.selectedAssignmentType = JSON.parse(localStorage.getItem('selectedAssignmentType'))
          this.selectedAssignmentTypeChange.emit(this.selectedAssignmentType);
        }
      }
    });
  }

  changeSelection(assignmentType: AssignmentTypes) {
    this.selectedAssignmentType = assignmentType;
    this.selectedAssignmentTypeChange.emit(assignmentType);
  }

  selectAssignmentType(assignmentType: AssignmentTypes) {
    let lastSelected: AssignmentTypes = JSON.parse(localStorage.getItem('selectedAssignmentType'))
    // if (lastSelected.assignmentTypeId == assignmentType.assignmentTypeId) return;
    localStorage.removeItem('assignmentSetup');
    localStorage.removeItem('AssignmentDomainsAndSkills');
    localStorage.removeItem('SkillsSelectedOptions');
    localStorage.removeItem('assignmentBookReading');
    this.selectedAssignmentType = assignmentType;
    localStorage.setItem('selectedAssignmentType', JSON.stringify(this.selectedAssignmentType))
    this.selectedAssignmentTypeChange.emit(assignmentType);
  }

  ngOnDestroy(): void {
  }
}
