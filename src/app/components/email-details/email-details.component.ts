import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { EmailBody } from '../../models/email.model';

@Component({
  selector: 'app-email-details',
  standalone: true,
  imports: [],
  templateUrl: './email-details.component.html',
  styleUrl: './email-details.component.scss'
})
export class EmailDetailsComponent {
  emailDeatails: EmailBody | null = null;
  isLoading = false;
  errorMessage: string = '';

  constructor(private activatedRoute: ActivatedRoute, private emailService: EmailService) {}
  
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
    this.emailService.getEmailDeatils(id).subscribe(
      (response) => {
        this.isLoading = false;
        this.emailDeatails = response;
      },
      (error) => {
        this.isLoading = false;
        // TODO: Alerts
        this.errorMessage = 'Failed to load email details';
      }
    );
  }
}
