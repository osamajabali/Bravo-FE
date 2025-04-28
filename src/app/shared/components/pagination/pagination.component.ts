import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, PaginatorModule, TranslateModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() first: number = 1;
  @Input() rows: number = 0;
  @Input() totalRecords: number = 0;
  @Input() itemLabel: string = 'items';

  @Output() pageChange = new EventEmitter<PaginatorState>();

  protected Math = Math;

  onPageChange(event: PaginatorState) {
    event.page += 1;
    if (event.first > this.first) {
      event.first += 1;
    }
    this.pageChange.emit(event);
  
    if (typeof window !== 'undefined') { // SSR safe
      const unitContainer = document.querySelector('.content-area-white');
      if (unitContainer) {
        unitContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
  
}
