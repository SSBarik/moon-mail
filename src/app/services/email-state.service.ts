import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Email } from '../models/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailStateService {
  private emailListSubject = new BehaviorSubject<Email[]>([]);
  private filteredEmailListSubject = new BehaviorSubject<Email[]>([]);
  private currentFilter = '';
  private favoriteEmailsKey = 'favoriteEmails';
  private readEmailsKey = 'readEmails';
  private selectedEmailIdSubject = new BehaviorSubject<string>('');
  private masterTileSubject = new BehaviorSubject<any>({
    text: 'Master',
    cols: 12,
    rows: 2,
    color: '#f4f5f9',
  });

  private slaveTileSubject = new BehaviorSubject<any>({
    text: 'Slave 1',
    cols: 0,
    rows: 2,
    color: '#F4F5F9',
  });
  
  selectedEmailId$ = this.selectedEmailIdSubject.asObservable();
  emailList$ = this.emailListSubject.asObservable();
  filteredEmailList$ = this.filteredEmailListSubject.asObservable();
  masterTile$ = this.masterTileSubject.asObservable();
  slaveTile$ = this.slaveTileSubject.asObservable();
  
  constructor() {
    this.loadCachedStates();
  }

  updateMasterTileCols(cols: number): void {
    const updatedTile = { ...this.masterTileSubject.value, cols };
    this.masterTileSubject.next(updatedTile);
  }

  updateSlaveTileCols(cols: number): void {
    const updatedTile = { ...this.slaveTileSubject.value, cols };
    this.slaveTileSubject.next(updatedTile);
  }

  get selectedEmailId(): string {
    return this.selectedEmailIdSubject.getValue();
  }

  setSelectedEmailId(id: string): void {
    this.selectedEmailIdSubject.next(id);
  }


  setEmailList(emails: Email[]): void {
    const favoriteIds = this.getCachedIds(this.favoriteEmailsKey);
    const readIds = this.getCachedIds(this.readEmailsKey);

    const updatedEmails = emails.map((email) => ({
      ...email,
      isFavorite: favoriteIds.includes(email.id),
      isRead: readIds.includes(email.id),
    }));

    this.emailListSubject.next(updatedEmails);
    this.applyFilter(this.currentFilter);
  }

  applyFilter(filter: string): void {
    this.currentFilter = filter;
    const emails = this.emailListSubject.getValue();
    const filtered = this.filterEmails(emails, filter);
    this.filteredEmailListSubject.next(filtered);

    // Check if the selected email ID exists in the filtered list
    if (this.selectedEmailId && !filtered.some(email => email.id === this.selectedEmailId)) {
      // Reset the selected email ID if it's not in the filtered list
      this.setSelectedEmailId('');

      // You can also reset the layout here if needed
      this.resetLayout();
    }
  }

  // applyFilter(filter: string): void {
  //   this.currentFilter = filter;
  //   const emails = this.emailListSubject.getValue();
  //   const filtered = this.filterEmails(emails, filter);
  
  //   // Check if the current selected email is in the filtered list
  //   const selectedEmailId = this.selectedEmailIdSubject.getValue();
  //   const isCurrentEmailVisible = filtered.some(email => email.id === selectedEmailId);
  
  //   if (!isCurrentEmailVisible) {
  //     // If the current email is not in the filtered list, reset layout
  //     this.updateMasterTileCols(12);
  //     this.updateSlaveTileCols(0);
  //     this.setSelectedEmailId(''); // Clear the selected email
  //   }
  
  //   this.filteredEmailListSubject.next(filtered); // Update filtered list
  // }
  

  resetLayout() {
    this.updateMasterTileCols(12);
    this.updateSlaveTileCols(0);
  }

  markFavoriteById(emailId: string): void {
    this.updateCachedIds(this.favoriteEmailsKey, emailId, true);
    this.updateEmailState(emailId, { isFavorite: true });
    this.applyFilter(this.currentFilter);
    // console.log('favorite updatedList: ', updatedEmails);
  }
  unmarkFavoriteById(emailId: string): void {
    this.updateCachedIds(this.favoriteEmailsKey, emailId, false);
    this.updateEmailState(emailId, { isFavorite: false });
    this.applyFilter(this.currentFilter);
  
    // console.log("favourite updatedList: ", updatedEmails);
  }

  markReadById(emailId: string): void {
    this.updateCachedIds(this.readEmailsKey, emailId, true);
    this.updateEmailState(emailId, { isRead: true });
    this.applyFilter(this.currentFilter);
    // console.log("read updatedList: ", updatedEmails);

  }
  
  private updateEmailState(emailId: string, changes: Partial<Email>): void {
    const updatedEmails = this.emailListSubject.getValue().map((email) =>
      email.id === emailId ? { ...email, ...changes } : email
    );
    this.emailListSubject.next(updatedEmails);
  }

  private getCachedIds(key: string): string[] {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : [];
  }

  private updateCachedIds(key: string, emailId: string, add: boolean): void {
    let ids = this.getCachedIds(key);
    if (add) {
      if (!ids.includes(emailId)) ids.push(emailId);
    } else {
      ids = ids.filter((id) => id !== emailId);
    }
    localStorage.setItem(key, JSON.stringify(ids));
  }

  private loadCachedStates(): void {
    // TODO: initialize BehaviorSubject with cached states
    const emails = this.emailListSubject.getValue();
    const favoriteIds = this.getCachedIds(this.favoriteEmailsKey);
    const readIds = this.getCachedIds(this.readEmailsKey);

    if (emails.length > 0) {
      const updatedEmails = emails.map((email) => ({
        ...email,
        isFavorite: favoriteIds.includes(email.id),
        isRead: readIds.includes(email.id),
      }));
      this.emailListSubject.next(updatedEmails);
    }
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

  clearCache() {
    localStorage.removeItem(this.favoriteEmailsKey);
    localStorage.removeItem(this.readEmailsKey);
  }
}
