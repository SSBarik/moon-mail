import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { EmailStateService } from '../../services/email-state.service';
import { Email } from '../../models/email.model';

import { EmailCardComponent } from "../email-card/email-card.component";

@Component({
  selector: 'app-email-list',
  standalone: true,
  imports: [CommonModule, EmailCardComponent, MatCardModule, MatPaginatorModule],
  templateUrl: './email-list.component.html',
  styleUrl: './email-list.component.scss'
})
export class EmailListComponent {
  emails: Email[] = [];
  paginatedEmails: Email[] = [];
  selectedEmailId$: Observable<string | null>;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private router: Router,
    private emailStateService: EmailStateService,
  ) {
    this.selectedEmailId$ = this.emailStateService.selectedEmailId$;
  }

  ngOnInit(): void {
    this.loadEmails();
  }

  loadEmails(): void {
    this.emailStateService.filteredEmailList$.subscribe(emails => {
      this.emails = emails;
      this.updatePaginatedEmails();
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedEmails();
  }

  updatePaginatedEmails(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEmails = this.emails.slice(startIndex, endIndex);
  }

  handleEmailClick(id: string) {
    this.emailStateService.setSelectedEmailId(id);

    // TODO: improve perf
    this.emailStateService.updateMasterTileCols(4);
    this.emailStateService.updateSlaveTileCols(8);
  
    if (this.emailStateService.currentFilter !== 'unread') {
      this.emailStateService.markReadById(id);
    }
    this.router.navigate([`/inbox/id/${id}`]);
  }
}
