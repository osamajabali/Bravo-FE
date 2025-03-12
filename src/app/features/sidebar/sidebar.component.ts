import { Component } from '@angular/core';
import { MenuItem } from '../../core/models/shared-models/menu-item.interface';
import { filter } from 'rxjs';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar', // Ensure this is correct
  standalone : true,
  imports : [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  activeMenuItem: MenuItem | null = null;
  currentUrl: string = '';
  
  menuItems: MenuItem[] = [
    {
      label: 'Quick Actions',
      route: '/ds',
      icon: 'quick-actions'
    },
    {
      label: 'Skills',
      route: '/ds',
      icon: 'skills',
      expanded: false,
      children: [
        {
          label: 'Units',
          route: 'features/units',
          icon: 'cubes'
        },
        {
          label: 'All Skills',
          route: 'features',
          icon: 'list'
        }
      ]
    },
    {
      label: 'Learn',
      route: '/ds',
      icon: 'learn',
      expanded: false,
      children: [
        {
          label: 'Assignments',
          route: '/ds',
          icon: 'tasks'
        },
        {
          label: 'Exams',
          route: '/ds',
          icon: 'file-alt'
        },
      ]
    },
    {
      label: 'Students',
      route: '/ds',
      icon: 'students'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Set initial URL
    this.currentUrl = this.router.url;
    
    // Update active menu item based on current URL
    this.setActiveItemByUrl(this.currentUrl);
    
    // Subscribe to router events to update active menu item when URL changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl = event.url;
      this.setActiveItemByUrl(this.currentUrl);
    });
  }

  toggleSubMenu(item: MenuItem): void {
    // If the item doesn't have children, set it as active and collapse all items
    if (!item.children || item.children.length === 0) {
      this.activeMenuItem = item;
      this.collapseAllItems();
      return;
    }
    
    // If the item has children, toggle its expanded state
    // and collapse all other items
    if (item.children && item.children.length > 0) {
      // Collapse all other items first
      this.menuItems.forEach(menuItem => {
        if (menuItem !== item && menuItem.expanded) {
          menuItem.expanded = false;
        }
      });
      
      // Toggle the current item's expanded state
      item.expanded = !item.expanded;
      
      // If expanding, check if any child matches current URL and set as active
      if (item.expanded && item.children) {
        const activeChild = item.children.find(child => 
          this.currentUrl.includes('/' + child.route)
        );
        if (activeChild) {
          this.activeMenuItem = activeChild;
        }
      }
    }
  }
  
  private collapseAllItems(): void {
    this.menuItems.forEach(item => {
      if (item.expanded) {
        item.expanded = false;
      }
    });
  }
  
  isActive(item: MenuItem): boolean {
    // For parent items without children, check if the route matches exactly
    if (!item.children) {
      return this.currentUrl === '/' + item.route;
    }
    
    // For parent items with children, check if any child route is active
    if (item.children) {
      return item.children.some(child => this.currentUrl.includes('/' + child.route));
    }
    
    return this.activeMenuItem === item;
  }
  
  private setActiveItemByUrl(url: string): void {
    // First check top-level items
    const topLevelMatch = this.menuItems.find(item => 
      !item.children && url === '/' + item.route
    );
    
    if (topLevelMatch) {
      this.activeMenuItem = topLevelMatch;
      this.collapseAllItems();
      return;
    }
    
    // Then check items with children
    for (const item of this.menuItems) {
      if (item.children) {
        const childMatch = item.children.find(child => 
          url.includes('/' + child.route)
        );
        
        if (childMatch) {
          this.activeMenuItem = childMatch;
          // Expand the parent
          item.expanded = true;
          // Collapse other items
          this.menuItems.forEach(menuItem => {
            if (menuItem !== item && menuItem.expanded) {
              menuItem.expanded = false;
            }
          });
          return;
        }
      }
    }
  }
}
