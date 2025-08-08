import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { MediaPlayerComponent } from '../../media-player/media-player.component';

@Component({
  selector: 'app-question-answer',
  imports: [CommonModule, ButtonModule, FormsModule, TranslateModule, MediaPlayerComponent],
  templateUrl: './question-answer.component.html',
  styleUrl: './question-answer.component.scss',
})
export class QuestionAnswerComponent {
  answerType: 'text' | 'audio' | 'image' = 'image';
  todayDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  mediaFile: any = {
    file: new File([], 'test.mp3'),
    fileName: 'test.mp3',
    fileSize: '100KB',
  };
}
