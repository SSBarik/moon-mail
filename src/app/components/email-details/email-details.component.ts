import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, EMPTY, finalize } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { EmailService } from '../../services/email.service';
import { EmailStateService } from '../../services/email-state.service';
import { Email, EmailBody } from '../../models/email.model';

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
  emailId: string = '';
  previousEmailId: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private emailService: EmailService,
    private emailStateService: EmailStateService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.emailStateService.updateMasterTileCols(4);
    this.emailStateService.updateSlaveTileCols(8);
    
    this.emailDetails = null;

    this.activatedRoute.paramMap.subscribe(params => {
      this.emailId = params.get('id') ?? '';
     
      if (this.emailId) {
        if (this.previousEmailId && this.previousEmailId !== this.emailId) {
          this.emailStateService.markReadById(this.previousEmailId);
        }
        
        this.loadEmailDetail(this.emailId);

        this.previousEmailId = this.emailId;
        this.emailStateService.setSelectedEmailId(this.emailId);
          
        this.emailStateService.emailList$.subscribe(emails => {
          this.email = this.emailStateService.getEmailById(this.emailId);
        });
      } else {
        // TODO: alert
      }
    });
  }

  ngOnDestroy() {
    this.emailStateService.updateMasterTileCols(12);
    this.emailStateService.updateSlaveTileCols(0);
    this.emailStateService.setSelectedEmailId('');
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
         
          if (this.emailStateService.currentFilter !== 'unread') {
            this.emailStateService.markReadById(id);
          }
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

  markFavorite(id: string): void {
    this.emailStateService.markFavoriteById(id);
    this.isFavorite = true;
  }

  unmarkFavorite(id: string): void {
    this.emailStateService.unmarkFavoriteById(id);
    this.isFavorite = false;
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }
}
