import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Detail, FileDetails } from '../../../../core/models/reading-models/story-details.model';


interface WorksheetFile {
  name: string;
  uploadDate: string;
  size: string;
  type?: 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx';
}

@Component({
  selector: 'app-book-info',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './book-info.component.html',
  styleUrls: ['./book-info.component.scss']
})
export class BookInfoComponent {
  constructor(private messageService: MessageService) {}

  @Input() bookDetails: Detail[] = [];

  @Input() uploadedFiles: FileDetails[] = [];

  get numberOfUploadedFiles(): number {
    return this.uploadedFiles?.length;
  }

  getFileIcon(file: FileDetails): string {
    const extensionName = file.fileName.split('.').pop();
    const extension = file.type || this.getFileExtension(extensionName);
    switch (extension) {
      case 'xls':
      case 'xlsx':
        return 'icon-xls.svg';
      case 'doc':
      case 'docx':
        return 'icon-doc.svg';
      case 'pdf':
      default:
        return 'icon-pdf.svg';
    }
  }

  private getFileExtension(filename: string): WorksheetFile['type'] {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'xls':
      case 'xlsx':
      case 'doc':
      case 'docx':
      case 'pdf':
        return ext;
      default:
        return 'pdf';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'File size should not exceed 10MB'
        });
        return;
      }

      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid file type. Please upload PDF, DOC, DOCX, XLS, or XLSX files only.'
        });
        return;
      }

      // Create new worksheet file entry
      
      const newFile: FileDetails = {
        fileName: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: this.formatFileSize(file.size),
        type: this.getFileExtension(file.name),
        fileId: 0,
        fileIcon: '',
        fileURL: ''
      };

      // Simulate upload process
      this.messageService.add({
        severity: 'info',
        summary: 'Upload Started',
        detail: `Uploading ${file.name}...`
      });

      // Simulate API call with setTimeout
      setTimeout(() => {
        this.uploadedFiles = [...this.uploadedFiles, newFile];
        this.messageService.add({
          severity: 'success',
          summary: 'Upload Complete',
          detail: `${file.name} has been uploaded successfully`
        });
      }, 1500);
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  downloadFile(file: FileDetails): void {
    // TODO: Implement actual download functionality
    this.messageService.add({
      severity: 'info',
      summary: 'Download Started',
      detail: `Downloading ${file.fileName}...`
    });

    const link = document.createElement('a');
    link.href = file.fileURL;  // URL or path to the file
    link.download = file.fileName;  // Filename for the download
    link.click();
  }

  deleteFile(file: FileDetails): void {
    const index = this.uploadedFiles.indexOf(file);
    if (index > -1) {
      this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
      this.messageService.add({
        severity: 'success',
        summary: 'File Deleted',
        detail: `${file.fileName} has been deleted successfully`
      });
    }
  }
}
