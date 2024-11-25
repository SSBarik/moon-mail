import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Email } from '../models/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailStateService {
  private emailListSubject = new BehaviorSubject<Email[]>([]);
  emailList$ = this.emailListSubject.asObservable();

  setEmailList(emails: Email[]): void {
    this.emailListSubject.next(emails);
  }

  get emailListValue(): Email[] {
    return this.emailListSubject.getValue(); 
  }

  updateEmailList(emailList: Email[]): void {
    this.emailListSubject.next(emailList);
  }

  toggleFavouriteById(id: string): void {
    const currentList = this.emailListSubject.value;
    const updatedList = currentList.map((e) =>
      e.id === id ? { ...e, isFavourite: !e.isFavourite } : e
    );
    this.emailListSubject.next(updatedList);

    console.log("favourite updatedList: ", updatedList);
  }

  markReadById(id: string): void {
    const currentList = this.emailListSubject.value;
    const updatedList = currentList.map((e) =>
      e.id === id ? { ...e, isRead: true } : e
    );
    this.emailListSubject.next(updatedList);

    console.log("read updatedList: ", updatedList);
  }
}
