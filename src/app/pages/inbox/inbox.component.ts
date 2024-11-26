import { Component } from '@angular/core';
import { EmailListComponent } from "../../components/email-list/email-list.component";
import { Email, EmailListResponse } from '../../models/email.model';
import { EmailService } from '../../services/email.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { EmailStateService } from '../../services/email-state.service';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, EmailListComponent, RouterOutlet, MatButtonModule, MatGridListModule],
  providers: [EmailService],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})
export class InboxComponent {
  emailListResponse: EmailListResponse | null = null;
  emailList: Email[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  isUnread: boolean = false;
  isRead: boolean = false;
  isFavourite: boolean = false;
  masterTile = {
    text: 'Master',
    cols: 4,
    rows: 2,
    color: 'lightgreen',
  };

  slaveTile = { text: 'Slave 1', cols: 0, rows: 2, color: 'lightblue' };

  constructor(private emailService: EmailService, private emailStateService: EmailStateService) {}

  ngOnInit(): void {
    this.fetchEmails();
    
    // Subscribe to changes in the email list
    this.emailStateService.emailList$.subscribe((updatedList) => {
      this.emailList = updatedList;
    });
  }

  fetchEmails(): void {
    console.log("fetching email list...")
    this.isLoading = true;
  
    this.emailService.getEmailList()
      .pipe(
        finalize(() => (this.isLoading = false)),
        catchError((error) => {
          this.errorMessage = 'Failed to load emails';
          return of({ list: [], total: 0 } as EmailListResponse);
        })
      )
      .subscribe((response: EmailListResponse) => {
        this.emailListResponse = response;
        this.emailList = response.list.map((email) => ({
          ...email,
          isRead: false,
          isFavourite: false,
        }));
        this.emailStateService.updateEmailList(this.emailList);
      });
  }

  toggleLayout() {
    this.masterTile.cols = 1;
    this.slaveTile.cols = 3;
  }
}
