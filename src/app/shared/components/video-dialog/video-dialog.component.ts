import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { Videos } from '../../../core/models/shared-models/resources.model';

@Component({
  selector: 'app-video-dialog',
  standalone: true,
  imports: [DialogModule, GalleriaModule],
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent implements OnInit {
  @Input() videoUrls: Videos[] = [];  // Video URLs from parent
  @Input() showVideoDialog: boolean = false;  // Dialog visibility controlled by parent
  activeIndex = 0;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // Sanitize the URLs upon initialization
    this.videoUrls = this.videoUrls.map(video => ({
      ...video,
      safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(video.url)
    }));
  }

  // Function to sanitize the URL for iframe src
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  closeDialog() {
    this.showVideoDialog = false;
  }
}
