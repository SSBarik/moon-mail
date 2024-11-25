import { Component } from '@angular/core';
import { EmailListComponent } from "../../components/email-list/email-list.component";
import { Email, EmailListResponse } from '../../models/email.model';
import { EmailService } from '../../services/email.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, EmailListComponent, RouterOutlet],
  providers: [EmailService],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})
export class InboxComponent {
  emailListResponse: EmailListResponse | null = null;
  emailList: Email[] = [];
  isLoading = false;
  errorMessage: string = '';

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    this.fetchEmails();
  }

  fetchEmails(): void {
    this.isLoading = true;
    this.emailService.getEmailList().subscribe(
      (response) => {
        this.isLoading = false;
        this.emailListResponse = response;
        this.emailList = this.emailListResponse.list;
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load emails';
      }
    );
  }
}
