import { Routes } from '@angular/router';
import { InboxComponent } from './pages/inbox/inbox.component';
import { EmailListComponent } from './components/email-list/email-list.component';
import { EmailDetailsComponent } from './components/email-details/email-details.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
	{
		path: 'inbox',
		component: InboxComponent,
		children: [
			{ path: 'id/:id', component: EmailDetailsComponent }
		]
	},
	{ path: '', redirectTo: 'inbox', pathMatch: 'full' },
	{ path: '**', component: NotFoundComponent }
];
