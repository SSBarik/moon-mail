import { Component, Input } from '@angular/core';
import { Email, EmailListResponse } from '../../models/email.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-list.component.html',
  styleUrl: './email-list.component.scss'
})
export class EmailListComponent {
  @Input() emails: Email[] = [];

  constructor(private router: Router) {}

  handleEmailClick(id: string) {
    console.log("email id: ", id);
    this.router.navigate([`/inbox/id/${id}`]);
  }
}
