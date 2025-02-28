import { Component } from '@angular/core';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-layout',
  imports: [SidebarComponent , RouterOutlet, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
