import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { Email } from '../../models/email.model';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-email-card',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, MatButtonModule, MatChipsModule],
  templateUrl: './email-card.component.html',
  styleUrl: './email-card.component.scss'
})
export class EmailCardComponent {
  @Input() email!: Email;
}
