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
  @Input() emails: Email[] = [];

  constructor(private router: Router,  private emailStateService: EmailStateService ) {}
  
  ngOnInit(): void {
    // this.loadEmails();
  }

  loadEmails(): void {
    this.emailStateService.getEmailList().subscribe((emailList) => {
      this.emails = emailList;
    });
  }

  handleEmailClick(id: string) {
    console.log("email id: ", id);
    this.router.navigate([`/inbox/id/${id}`]);
  }
}
