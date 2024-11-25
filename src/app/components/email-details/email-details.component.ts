import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { EmailBody } from '../../models/email.model';
import { catchError, EMPTY, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { EmailStateService } from '../../services/email-state.service';

@Component({
  selector: 'app-email-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './email-details.component.html',
  styleUrl: './email-details.component.scss'
})
export class EmailDetailsComponent {
  emailDetails: EmailBody | null = null;
  isLoading = false;
  errorMessage: string = '';
  isFavourite: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private emailService: EmailService,
    private emailStateService: EmailStateService
  ) {}
  
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const emailId: string | null = this.activatedRoute.snapshot.paramMap.get('id');
      console.log("from route id: ", emailId);

      if (emailId) {
        this.loadEmailDetail(emailId);
      } else {
        console.log('Email ID is null');
      }
    });
  }

  loadEmailDetail(id: string) {
    this.isLoading = true;
    this.emailService
      .getEmailDeatils(id)
      .pipe(
        finalize(() => (this.isLoading = false)),
        catchError((error) => {
          this.errorMessage = 'Failed to load email details';
          return EMPTY;
        })
      )
      .subscribe((response) => {
        this.emailDetails = response;
        this.setIsFavourite(this.emailDetails.id);
        this.emailStateService.markReadById(id);
      });
  }

  setIsFavourite(id: string): void {
    this.isFavourite = this.getIsFavourite(id);
  }

  getIsFavourite(id: string): boolean {
    const email = this.emailStateService.emailListValue.find(email => email.id === id);
    return email ? email.isFavourite?? false : false;
  }

  toggleFavourite(id: string): void {
    this.emailStateService.toggleFavouriteById(id);
    this.isFavourite = !this.isFavourite;
  }
}
