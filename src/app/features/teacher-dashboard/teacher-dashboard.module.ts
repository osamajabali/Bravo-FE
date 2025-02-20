import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusComponent } from './status/status.component';
import { TeacherDashboardModuleRoutingModule } from './teacher-dashboard-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, TeacherDashboardModuleRoutingModule, StatusComponent],
  exports: [StatusComponent],
})
export class TeacherDashboardModule {}
