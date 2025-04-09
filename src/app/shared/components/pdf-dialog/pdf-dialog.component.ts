import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, PdfViewerModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './pdf-dialog.component.html',
  styleUrls: ['./pdf-dialog.component.scss'],
})
export class PdfDialogComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() set pdfUrl(value: string) {
    if (value) {
      this._pdfUrl = value;
    }
  }
  
  _pdfUrl: string = '';
  zoom: number = 1;
  rotation: number = 0;
  currentPage: number = 1;
  totalPages: number = 0;
  zoomLevel: string = '1';

  constructor(private sanitizer: DomSanitizer) {}

  onPdfLoaded(pdf: any): void {
    this.totalPages = pdf.numPages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  onPageChange(event: any): void {
    const page = parseInt(event.target.value);
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  zoomIn(): void {
    if (this.zoom < 3) {
      this.zoom *= 1.25;
      this.zoomLevel = this.zoom.toString();
    }
  }

  zoomOut(): void {
    if (this.zoom > 0.25) {
      this.zoom *= 0.8;
      this.zoomLevel = this.zoom.toString();
    }
  }

  onZoomChange(value: string): void {
    if (value === 'auto' || value === 'page') {
      this.zoomLevel = value;
      this.zoom = 1;
    } else {
      this.zoom = parseFloat(value);
      this.zoomLevel = value;
    }
  }

  rotateClockwise(): void {
    this.rotation = (this.rotation + 90) % 360;
  }

  downloadPdf(): void {
    const link = document.createElement('a');
    link.href = this._pdfUrl;
    link.download = 'document.pdf';
    link.click();
  }

  printPdf(): void {
    window.open(this._pdfUrl, '_blank');
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
