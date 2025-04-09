import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SharedService } from '../../../core/services/shared-services/shared.service';

@Component({
  selector: 'app-leveled-reading',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './leveled-reading.component.html',
  styleUrl: './leveled-reading.component.scss',
})
export class LeveledReadingComponent implements OnInit {

  router = inject(Router);
  sharedService = inject(SharedService);

  ngOnInit(): void {
    this.sharedService.removeArray(); 
    this.sharedService.pushTitle('LEVELED_READING')
  }

  showStudentLevel() {
    this.router.navigate(['/features/student-level']);
  }

  showCriteria() {
    this.router.navigate(['/features/reading-criteria']);
  }
}
