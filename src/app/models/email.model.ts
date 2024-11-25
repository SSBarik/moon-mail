export interface Email {
	id: string;
	from: EmailSender;
	date: number;
	subject: string;
	short_description: string;
}
  
export interface EmailSender {
	email: string;
	name: string;
}

export interface EmailListResponse {
	list: Email[];
	total: number;
}

export interface EmailBody {
  id: string;
  body: string;
}