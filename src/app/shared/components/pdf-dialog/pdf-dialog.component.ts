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
  @Input() pdfUrls : string[] =[];
  
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

  nextPage() {
    if (this.currentPage < this.pdfUrls.length) {
      this.currentPage++;
    }
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }  

  onPageChange(event: any): void {
      this.currentPage = this.currentPage + 1;
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

  downloadPdf() {
    const link = document.createElement('a');
    link.href = this.pdfUrls[this.currentPage - 1];
    link.download = `Dolch_Sight_Words_Part1_Page_${this.currentPage}.pdf`; // Customize filename
    link.click();
  }

  // Print PDF function
  printPdf() {
    const printWindow = window.open(this.pdfUrls[this.currentPage - 1], '_blank');
    printWindow?.print(); // Trigger print dialog for the PDF
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
