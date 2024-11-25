import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EmailListResponse } from '../models/email.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://flipkart-email-mock.vercel.app/';

  constructor(private http: HttpClient) { }

  getEmailList(): Observable<EmailListResponse> {
    return this.http.get<EmailListResponse>(this.apiUrl);
  }
}
