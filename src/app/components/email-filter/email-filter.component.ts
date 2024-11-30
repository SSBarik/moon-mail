import { Component } from '@angular/core';
import { EmailStateService } from '../../services/email-state.service';
import { CommonModule } from '@angular/common';
import { FilterType } from '../../enums/common';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-filter',
  standalone: true,
  imports: [CommonModule, MatChipsModule, FormsModule],
  templateUrl: './email-filter.component.html',
  styleUrl: './email-filter.component.scss'
})
export class EmailFilterComponent {
  // currentFilter: 'all' | 'read' | 'unread' | 'favorite' = 'all'; // TODO: refactor
  currentFilter: FilterType = FilterType.All;
  
  // Define filter options
  filters = [
    { label: 'All', value: FilterType.All },
    { label: 'Read', value: FilterType.Read },
    { label: 'Unread', value: FilterType.Unread },
    { label: 'Favorite', value: FilterType.Favorite }
  ];

  constructor(private emailStateService: EmailStateService) {}

  applyFilter(filter: FilterType): void {
    this.currentFilter = filter;
    this.emailStateService.applyFilter(filter);
  }
}
