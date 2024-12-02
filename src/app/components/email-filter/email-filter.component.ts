import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatChipsModule } from '@angular/material/chips';

import { EmailStateService } from '../../services/email-state.service';
import { FilterType } from '../../enums/common';

@Component({
  selector: 'app-email-filter',
  standalone: true,
  imports: [CommonModule, MatChipsModule, FormsModule],
  templateUrl: './email-filter.component.html',
  styleUrl: './email-filter.component.scss'
})
export class EmailFilterComponent {
  currentFilter: FilterType = FilterType.All; // TODO: refactor
  
  filters = [
    { label: 'All', value: FilterType.All },
    { label: 'Unread', value: FilterType.Unread },
    { label: 'Read', value: FilterType.Read },
    { label: 'Favorites', value: FilterType.Favorite }
  ];

  constructor(private emailStateService: EmailStateService) {}

  applyFilter(filter: FilterType): void {
    this.currentFilter = filter;
    this.emailStateService.applyFilter(filter);
  }
}
