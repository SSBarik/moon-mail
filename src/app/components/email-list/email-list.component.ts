import { Component, Input } from '@angular/core';
import { Email, EmailListResponse } from '../../models/email.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmailStateService } from '../../services/email-state.service';
import { EmailCardComponent } from "../email-card/email-card.component";

@Component({
  selector: 'app-email-list',
  standalone: true,
  imports: [CommonModule, EmailCardComponent],
  templateUrl: './email-list.component.html',
  styleUrl: './email-list.component.scss'
})
export class EmailListComponent {
  emails: Email[] = [];
  selectedEmailId: string | null = null;

  constructor(private router: Router,  private emailStateService: EmailStateService ) {}
  
  ngOnInit(): void {
    this.loadEmails();
  }

  loadEmails(): void {
    this.emailStateService.filteredEmailList$.subscribe(
      emails => (this.emails = emails)
    );
  }

  handleEmailClick(id: string) {
    console.log("email id: ", id);
    this.selectedEmailId = id; 

    // TODO: improve perf
    this.emailStateService.masterTile.cols = 4;
    this.emailStateService.slaveTile.cols = 8;
  
    this.emailStateService.markReadById(id);
    this.router.navigate([`/inbox/id/${id}`]);
  }
}
