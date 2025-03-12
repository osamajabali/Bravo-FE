import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';

export interface UserSection {
  title: string;
  count: number;
  status: string;
  users: User[];
}

interface User {
  id: number;
  name: string;
  avatar?: string;
  status: number;
}

@Component({
  selector: 'app-user-drawer',
  standalone: true,
  imports: [CommonModule, SidebarModule, ButtonModule],
  templateUrl: './user-drawer.component.html',
  styleUrl: './user-drawer.component.scss'
})
export class UserDrawerComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  
  @Input() sections: UserSection[]  = []
   staticsections: UserSection[]  = [
    {
      title: 'Beginner',
      count: 5,
      status: 'Mastered',
      users: [
        { id: 1, name: 'Michael Miller', avatar: 'icon-user.svg', status: 1 },
        { id: 2, name: 'Sarah Johnson', avatar: 'icon-user.svg', status: 1 },
        { id: 3, name: 'David Brown', avatar: 'icon-user.svg', status: 1 },
        { id: 4, name: 'Emma Smith', avatar: 'icon-user.svg', status: 0 },
        { id: 5, name: 'Robert Garcia', avatar: 'icon-user.svg', status: 0 },
      ],
    },
    {
      title: 'Average',
      count: 3,
      status: 'Mastered',
      users: [
        { id: 6, name: 'Olivia Jones', avatar: 'icon-user.svg', status: 1 },
        { id: 7, name: 'John Williams', avatar: 'icon-user.svg', status: 0 },
        { id: 8, name: 'Jane Davis', avatar: 'icon-user.svg', status: 1 },
      ],
    },
    {
      title: 'Advanced',
      count: 2,
      status: 'Mastered',
      users: [
        { id: 9, name: 'Emma Johnson', avatar: 'icon-user.svg', status: 1 },
        { id: 10, name: 'David Smith', avatar: 'icon-user.svg', status: 0 },
      ],
    },
  ];
  
  closeDrawer(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
} 