import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-details',
  standalone: true,
  imports: [],
  templateUrl: './email-details.component.html',
  styleUrl: './email-details.component.scss'
})
export class EmailDetailsComponent {
  email: any;

  constructor(private activatedRoute: ActivatedRoute) {}
  
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
    // TODO: fetch email details
    this.email = {
      id: id,
      from: 'John Doe',
      subject: 'Meeting Reminder',
      body: 'Please remember our meeting tomorrow at 10 AM.',
      date: '2024-11-25T09:00:00'
    };
  }
}
