import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { EmailBody, EmailListResponse } from '../models/email.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'https://flipkart-email-mock.vercel.app/';
  private cacheKeyPrefix = 'emailDetails_';

  constructor(private http: HttpClient) {}
  
  private getCachedEmail(id: string): EmailBody | null {
    const data = localStorage.getItem(this.cacheKeyPrefix + id);
    return data ? JSON.parse(data) : null;
  }

  private cacheEmail(id: string, data: EmailBody): void {
    localStorage.setItem(this.cacheKeyPrefix + id, JSON.stringify(data));
  }

  getEmailList(): Observable<EmailListResponse> {
    return this.http.get<EmailListResponse>(this.apiUrl);
  }

  getEmailDetails(id: string): Observable<EmailBody> {
    const cachedData = this.getCachedEmail(id);

    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<EmailBody>(`${this.apiUrl}?id=${id}`).pipe(
      tap((response) => this.cacheEmail(id, response)),
      catchError((error) => {
        console.error(`Error fetching email details for ID: ${id}`, error);
        throw error;
      })
    );
  }

  // TODO: reuse
  clearCache(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.cacheKeyPrefix))
      .forEach((key) => localStorage.removeItem(key));
  }
}
