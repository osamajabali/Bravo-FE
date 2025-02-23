import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'] // Correction in the key name (styleUrl to styleUrls)
})
export class ButtonComponent {
  @Input() text: string; // Define the input property with its type
}