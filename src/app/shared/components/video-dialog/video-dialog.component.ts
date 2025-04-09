import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-video-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss'],
})
export class VideoDialogComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() videoUrl: string = '';
  
  isPlaying: boolean = false;

  togglePlay(): void {
    if (this.videoPlayer?.nativeElement) {
      if (this.isPlaying) {
        this.videoPlayer.nativeElement.pause();
      } else {
        this.videoPlayer.nativeElement.play();
      }
    }
  }

  onVideoPlay(): void {
    this.isPlaying = true;
  }

  onVideoPause(): void {
    this.isPlaying = false;
  }

  onVideoEnded(): void {
    this.isPlaying = false;
  }

  closeDialog(): void {
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.pause();
    }
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
