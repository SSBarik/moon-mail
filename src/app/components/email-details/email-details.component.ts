import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { Email, EmailBody } from '../../models/email.model';
import { catchError, EMPTY, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { EmailStateService } from '../../services/email-state.service';
import { MatCardModule } from '@angular/material/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-email-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, NgxSkeletonLoaderModule],
  templateUrl: './email-details.component.html',
  styleUrl: './email-details.component.scss'
})
export class EmailDetailsComponent {
  emailDetails: EmailBody | null = null;
  isLoading = false;
  errorMessage: string = '';
  isFavorite: boolean = false;
  email: Email | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private emailService: EmailService,
    private emailStateService: EmailStateService
  ) {}
  
  ngOnInit() {

    this.emailDetails = null;

    this.activatedRoute.paramMap.subscribe(params => {
      const emailId: string | null = params.get('id');
      console.log("from route id: ", emailId);

      if (emailId) {
        this.loadEmailDetail(emailId);
    
        this.emailStateService.emailList$.subscribe(emails => {
          this.emailStateService.setSelectedEmailId(emailId);
          this.email = this.emailStateService.getEmailById(emailId);
        });

        this.emailStateService.updateMasterTileCols(4);
        this.emailStateService.updateSlaveTileCols(8);
      } else {
        console.log('Email ID is null');
      }
    });
  }

  ngOnDestroy() {
    this.emailStateService.updateMasterTileCols(12);
    this.emailStateService.updateSlaveTileCols(0);
  }

  loadEmailDetail(id: string) {
    this.errorMessage = '';

    this.isLoading = true;
    this.emailService
      .getEmailDetails(id)
      .pipe(
        finalize(() => (this.isLoading = false)),
        catchError((error) => {
          this.errorMessage = 'Failed to load email details';
          return EMPTY;
        })
      )
      .subscribe((response) => {
        if(response.body) {
          this.emailDetails = response;
          this.setIsFavorite(this.emailDetails.id);
          this.emailStateService.markReadById(id);
        } else {
          this.errorMessage = 'The requested email was not found!';
        }
      });
  }

  setIsFavorite(id: string): void {
    this.isFavorite = this.getIsFavorite(id);
  }

  getIsFavorite(id: string): boolean {
    const email = this.emailStateService.emailListValue.find(email => email.id === id);
    return email ? email.isFavorite?? false : false;
  }

  toggleFavourite(id: string): void {
    this.isFavorite ? this.emailStateService.unmarkFavoriteById(id) : this.emailStateService.markFavoriteById(id);
    this.isFavorite = !this.isFavorite;
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }
}
