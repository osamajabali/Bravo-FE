import { Component, OnInit, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { LeveldReadingService } from '../../../core/services/teacher-dashboard-services/leveld-reading.service';
import { StoryPageResponseArray, StoryPages } from '../../../core/models/reading-models/story-summary.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Standalone Component Configuration
@Component({
  selector: 'app-html-dialog',
  standalone: true,
  imports: [DialogModule, GalleriaModule],
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
  activeIndex: number = 0;
  previousIndex: number = 0;
  storyPages: StoryPages = new StoryPages();
  storyPagesResponse: StoryPageResponseArray = new StoryPageResponseArray();
  storyId = input<number>(0);
  responsiveOptions: any[] = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 3 },
    { breakpoint: '768px', numVisible: 2, numScroll: 2 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];

  constructor(private readingService: LeveldReadingService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.storyPages.storyId = this.storyId();
    this.readingService.getStoryPages(this.storyPages).subscribe(res => {
      if (res.success) {
        this.storyPagesResponse = res.result;
        this.storyPagesResponse.pages.forEach(x => x.htmlContent = this.getSanitizedContent(x.htmlContent) as string)
      }
    });
  }

  getSanitizedContent(html: string): SafeHtml {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const styles = tempDiv.querySelectorAll('style');
    styles.forEach(style => style.remove());

    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    return this.sanitizer.bypassSecurityTrustHtml(tempDiv.innerHTML);
  }

  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
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
    const currentPage = this.activeIndex + 1;
    const totalRecords = this.storyPagesResponse.totalRecords;
    const pageSize = this.storyPagesResponse.pageSize;

    if (this.storyPagesResponse.pages.length < totalRecords && currentPage % pageSize === 0) {
      const nextPageNumber = Math.floor(currentPage / pageSize) + 1;

      if (this.previousIndex < currentPage) {
        this.storyPages.pageNumber = nextPageNumber;
        this.readingService.getStoryPages(this.storyPages).subscribe(res => {
          if (res.success) {
            this.storyPagesResponse.pages.push(...res.result.pages);
            console.log(this.storyPagesResponse.pages);
          }
        });
      }
    }

    this.previousIndex = currentPage;
  }
}
