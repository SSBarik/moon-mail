import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Email } from '../models/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailStateService {
  private emailListSubject = new BehaviorSubject<Email[]>([]);
  private filteredEmailListSubject = new BehaviorSubject<any[]>([]);
  private currentFilter = '';

  emailList$ = this.emailListSubject.asObservable();
  filteredEmailList$ = this.filteredEmailListSubject.asObservable();

  masterTile = {
    text: 'Master',
    cols: 4,
    rows: 2,
    color: '#f4f5f9',
  };

  slaveTile = { text: 'Slave 1', cols: 0, rows: 2, color: 'lightblue' };


  setEmailList(emails: any[]): void {
    this.emailListSubject.next(emails);
    this.applyFilter(this.currentFilter);
  }

  applyFilter(filter: string): void {
    this.currentFilter = filter;
    const emails = this.emailListSubject.getValue();
    const filtered = this.filterEmails(emails, filter);
    this.filteredEmailListSubject.next(filtered);
  }

  markFavoriteById(emailId: string): void {
    const updatedEmails = this.updateEmailState(emailId, { isFavorite: true });
    this.emailListSubject.next(updatedEmails);
    this.applyFilter(this.currentFilter);

    console.log("favourite updatedList: ", updatedEmails);
  }

  unmarkFavoriteById(emailId: string): void {
    const updatedEmails = this.updateEmailState(emailId, { isFavorite: false });
    this.emailListSubject.next(updatedEmails);
    this.applyFilter(this.currentFilter);

    console.log("favourite updatedList: ", updatedEmails);
  }

  markReadById(emailId: string): void {
    const updatedEmails = this.updateEmailState(emailId, { isRead: true });
    this.emailListSubject.next(updatedEmails);
    this.applyFilter(this.currentFilter);

    console.log("read updatedList: ", updatedEmails);

  }

  private updateEmailState(emailId: string, changes: Partial<any>): any[] {
    return this.emailListSubject.getValue().map(email => 
      email.id === emailId ? { ...email, ...changes } : email
    );
  }

  private filterEmails(emails: any[], filter: string): any[] {
    switch (filter) {
      case 'read':
        return emails.filter(email => email.isRead);
      case 'unread':
        return emails.filter(email => !email.isRead);
      case 'favorite':
        return emails.filter(email => email.isFavorite);
      default:
        return emails;
    }
  }

  getEmailList(): Observable<Email[]> {
    return this.emailList$;
  }

  get emailListValue(): Email[] {
    return this.emailListSubject.getValue(); 
  }

  getEmailById(id: string): Email {
    return this.emailListSubject.getValue().find(email => email.id === id)!;  // TODO: fix Non-null assertion
  }
}
