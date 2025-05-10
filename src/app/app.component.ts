import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { DataTableComponent } from './data-table/data-table.component';
import { ChatbotComponent } from './chatbot/chatbot.component';


@Component({
  selector: 'app-root',
  imports: [HeaderComponent,DataTableComponent,ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chatbot-dashboard';
  markdownContent = `
  # Hello Markdown!
  - This is a list
  - Rendered by **ngx-markdown**
  `;
}
