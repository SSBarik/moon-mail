import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { Email, EmailListResponse } from '../../models/email.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmailStateService } from '../../services/email-state.service';
import { EmailCardComponent } from "../email-card/email-card.component";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-email-list',
  standalone: true,
  imports: [CommonModule, EmailCardComponent],
  templateUrl: './email-list.component.html',
  styleUrl: './email-list.component.scss'
})
export class EmailListComponent {
  emails: Email[] = [];
  selectedEmailId$: Observable<string | null>;

  constructor(
    private router: Router,
    private emailStateService: EmailStateService,
    private cdr: ChangeDetectorRef
  ) {
    this.selectedEmailId$ = this.emailStateService.selectedEmailId$;
  }
  
  ngOnInit(): void {
    this.loadEmails();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['selectedEmailId$'] && this.selectedEmailId$) {
  //     this.cdr.detectChanges(); // Ensure change detection is triggered if selectedEmailId changes
  //   }
  // }

  loadEmails(): void {
    this.emailStateService.filteredEmailList$.subscribe(
      emails => (this.emails = emails)
    );
  }

  handleEmailClick(id: string) {
    console.log("email id: ", id);
    this.emailStateService.setSelectedEmailId(id);

    // TODO: improve perf
    this.emailStateService.updateMasterTileCols(4);
    this.emailStateService.updateSlaveTileCols(8);
  
    this.emailStateService.markReadById(id);
    this.router.navigate([`/inbox/id/${id}`]);
  }
}
