import { Component } from '@angular/core';
import { EmailStateService } from '../../services/email-state.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-email-filter',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './email-filter.component.html',
  styleUrl: './email-filter.component.scss'
})
export class EmailFilterComponent {
  currentFilter: 'all' | 'read' | 'unread' | 'favorite' = 'all'; // TODO: refactor

  constructor(private emailStateService: EmailStateService) {}

  applyFilter(filter: 'all' | 'read' | 'unread' | 'favorite'): void {
    this.currentFilter = filter;
    this.emailStateService.applyFilter(filter);
  }
}
