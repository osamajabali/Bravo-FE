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
  @Input() first: number = 0;
  @Input() rows: number = 10;
  @Input() totalRecords: number = 0;
  @Input() itemLabel: string = 'items';

  @Output() pageChange = new EventEmitter<PaginatorState>();

  protected Math = Math;

  onPageChange(event: PaginatorState) {
    event.page += 1
    this.pageChange.emit(event);
  }
}
