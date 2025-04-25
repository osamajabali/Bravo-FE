import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { LeveldReadingService } from '../../../core/services/teacher-dashboard-services/leveld-reading.service';
import { StoryPageResponseArray, StoryPages } from '../../../core/models/reading-models/story-summary.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Standalone Component Configuration
@Component({
  selector: 'app-html-dialog',
  standalone: true, // This makes the component standalone
  imports: [DialogModule, GalleriaModule], // Import required modules directly here
  templateUrl: './html-dialog.component.html',
  styleUrls: ['./html-dialog.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HtmlDialogComponent),
      multi: true
    }
  ]
})
export class HtmlDialogComponent implements OnInit, ControlValueAccessor {
  showReader: boolean = false;
  book: any = { title: 'Sample Book' };
  bookPages: string[] = [];
  activeIndex: number = 0;
  responsiveOptions: any[] = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 3 },
    { breakpoint: '768px', numVisible: 2, numScroll: 2 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];
  storyPages: StoryPages = new StoryPages();
  storyPagesResponse: StoryPageResponseArray = new StoryPageResponseArray();
  previousIndex: number =0;

  constructor(private readingService: LeveldReadingService, private sanitizer: DomSanitizer) {
    this.bookPages = [
      "<h1>Page 1</h1><p>This is the content of the first page.</p>",
      "<h1>Page 2</h1><p>This is the content of the second page.</p>",
      "<h1>Page 3</h1><p>This is the content of the third page.</p>"
    ];
  }

  ngOnInit(): void {debugger
    this.storyPages.storyId = 337697;
    this.readingService.getStoryPages(this.storyPages).subscribe(res => {
      if (res.success) {
        this.storyPagesResponse = res.result;
      }
    });
  }

  getSanitizedContent(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // ControlValueAccessor Methods
  writeValue(value: any): void {
    if (value !== undefined) {
      this.showReader = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange(value: any): void { }
  onTouched() { }

  hideDialog() {
    this.showReader = false;
    this.onChange(this.showReader);  // Notify the parent of the change
  }

  nextPage() {
    if(this.storyPagesResponse.pages.length != this.storyPagesResponse.totalRecords){
      if(this.activeIndex != this.storyPagesResponse.totalRecords){
        if ((this.activeIndex + 1) % this.storyPagesResponse.pageSize === 0) {
          if (this.previousIndex < this.activeIndex + 1) {
            this.storyPages.pageNumber = Math.floor((this.activeIndex + 1) / this.storyPagesResponse.pageSize) + 1;
              this.readingService.getStoryPages(this.storyPages).subscribe(res => {
              if (res.success) {
                this.storyPagesResponse.pages.push(...res.result.pages);
                console.log(this.storyPagesResponse.pages)
              }
            });
          }
        }
      }
    }

    this.previousIndex = this.activeIndex + 1;
  }
}
