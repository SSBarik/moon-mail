import { Routes } from '@angular/router';
import { InboxComponent } from './pages/inbox/inbox.component';
import { EmailListComponent } from './components/email-list/email-list.component';
import { EmailDetailsComponent } from './components/email-details/email-details.component';

export const routes: Routes = [
	{
		path: 'inbox',
		component: InboxComponent,
		children: [
			{ path: '', component: EmailListComponent },
			{ path: 'id/:id', component: EmailDetailsComponent }
		]
	},
	{ path: '', redirectTo: 'inbox', pathMatch: 'full' }
];
