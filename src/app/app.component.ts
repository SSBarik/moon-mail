import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import { HeaderComponent } from './components/header/header.component';
import { EmailService } from './services/email.service';
import { EmailStateService } from './services/email-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'moon-mail';

  constructor(private emailService: EmailService, private emailStateService: EmailStateService) {}

  clearCache() {
    this.emailService.clearCache();
    this.emailStateService.clearCache();
  }
}
