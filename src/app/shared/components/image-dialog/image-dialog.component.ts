import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { CarouselModule } from 'primeng/carousel';
import { HeaderService } from '../../../core/services/header-services/header.service';

@Component({
  selector: 'app-image-dialog',
  imports: [ButtonModule , DialogModule , GalleriaModule,CarouselModule],
  templateUrl: './image-dialog.component.html',
  styleUrl: './image-dialog.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageDialogComponent),
      multi: true
    }
  ]
})
export class ImageDialogComponent implements ControlValueAccessor {
  @Input() book: any = {}; // Input book object
  @Input() bookPages: string[] = []; // Array of book pages
  @Input() activeIndex: number = 0; // Active page index
  @Input() isImage: boolean = true; // Active page index
  @Output() hideImageDialog = new EventEmitter<boolean>();  // Emit when dialog is closed
  showReader: boolean = false; // Controls dialog visibility
  
  constructor(public headerService : HeaderService){}
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 1
    }
  ];

  // Placeholder for the value and the function to update it
  private _value: any = null;


  // Functions to implement ControlValueAccessor interface
  writeValue(value: any): void {
    if (value !== undefined) {
      this._value = value;
      this.showReader = value; // Set dialog visibility based on the value
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn; // This is triggered when the value changes
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn; // This is triggered when the control is touched
  }

  // Call this method to notify the form control that the value has changed
  onChange(value: any): void {}
  onTouched() {}

  // Method to toggle visibility of the dialog
  toggleDialog(visible: boolean): void {
    this.showReader = visible;
    this.onChange(this.showReader); // Notify parent component of the change
  }

  hideDialog (){
    this.hideImageDialog.emit(true);
  }
}