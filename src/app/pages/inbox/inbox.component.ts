import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { catchError, finalize, of, Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { EmailStateService } from '../../services/email-state.service';
import { EmailService } from '../../services/email.service';
import { Email, EmailListResponse } from '../../models/email.model';

import { EmailListComponent } from "../../components/email-list/email-list.component";
import { EmailCardComponent } from '../../components/email-card/email-card.component';
import { EmailFilterComponent } from '../../components/email-filter/email-filter.component';


@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, EmailListComponent, RouterOutlet, MatButtonModule, MatGridListModule, EmailCardComponent, EmailFilterComponent, NgxSkeletonLoaderModule],
  providers: [EmailService],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})
export class InboxComponent {
  emailListResponse: EmailListResponse | null = null;
  emailList: Email[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  masterTile: any;
  slaveTile: any;
  private tileSubscription: Subscription = new Subscription();

  constructor(
    private emailService: EmailService,
    private emailStateService: EmailStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchEmails();

    this.tileSubscription.add(
      this.emailStateService.masterTile$.subscribe(tile => {
        this.masterTile = tile;
        this.cdr.detectChanges();
      })
    );

    this.tileSubscription.add(
      this.emailStateService.slaveTile$.subscribe(tile => {
        this.slaveTile = tile;
        this.cdr.detectChanges();
      })
    );

    // TODO: unscbscribe
    // Subscribe to changes in the email list
    this.emailStateService.emailList$.subscribe((updatedList) => {
      this.emailList = updatedList;
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  
  ngOnDestroy(): void {
    this.tileSubscription.unsubscribe();
  }

  fetchEmails(): void {
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
          isFavorite: false,
        }));
        this.emailStateService.setEmailList(this.emailList);
      });
  }
}
