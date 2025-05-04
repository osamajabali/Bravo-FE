import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { Videos } from '../../../core/models/shared-models/resources.model';

@Component({
  selector: 'app-video-dialog',
  standalone: true,
  imports: [DialogModule, GalleriaModule],
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VideoDialogComponent),
      multi: true,
    },
  ],
})
export class VideoDialogComponent
  implements OnInit, ControlValueAccessor {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  @Input() videoUrls: Videos[] = []; // Video URLs from parent
  @Input() showVideoDialog: boolean = false; // Dialog visibility controlled by parent
  @Output() showVideoDialogChange = new EventEmitter<boolean>(); // Output to propagate changes to parent
  activeIndex = 0;
  isPlaying: boolean = false;

  private onChange: (value: any) => void = () => {}; // Method for updating form model
  private onTouched: () => void = () => {}; // Method for marking the control as touched

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // Sanitize the URLs upon initialization
    this.videoUrls = this.videoUrls.map((video) => ({
      ...video,
      safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(video.url),
    }));
  }

  // Method to sanitize the URL for iframe src
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url+'?autoplay=1');
  }

  // Toggle play/pause functionality
  togglePlay(): void {
    this.isPlaying = !this.isPlaying;
  }

  // Handle video play
  onVideoPlay(): void {
    this.isPlaying = true;
  }

  // Handle video pause
  onVideoPause(): void {
    this.isPlaying = false;
  }

  // Handle video ended
  onVideoEnded(): void {
    this.isPlaying = false;
  }

  // Close the dialog and notify the parent form
  closeDialog(): void {
    this.showVideoDialog = false;
    this.showVideoDialogChange.emit(this.showVideoDialog); // Emit the change
    this.onChange(this.showVideoDialog); // Update the form model when dialog visibility changes
  }

  // ControlValueAccessor Methods

  // Write value to the component (for setting initial value)
  writeValue(value: boolean): void {
    if (value !== undefined) {
      this.showVideoDialog = value;
    }
  }

  // Register the change function to be called when the value changes
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  // Register the touched function to be called when the control is touched
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
