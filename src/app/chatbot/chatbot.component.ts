import { Component, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule,MarkdownComponent],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss',
  providers:[provideMarkdown()]
})
export class ChatbotComponent {
  @ViewChild('chatMessagesContainer') private messagesContainer!: ElementRef;
  markdownData=`The sales data statistics indicate the following:

- **Minimum Sales**: 950
- **Maximum Sales**: 1650
- **Average Sales**: 1231.25

**Key Insights**:
1. Sales range significantly from a low of 950 to a high of 1650, indicating variability in performance.
2. The average sales figure of 1231.25 suggests that, on average, sales are relatively strong, but there is potential for improvement given the gap between the average and maximum sales.
3. The data may reflect seasonal trends or varying demand, warranting further analysis to understand the factors influencing sales fluctuations. `
  
  // Inject the chat service
  chatService = inject(ChatService);
  
  currentMessage: string = '';
  typingIndicator: string = 'Thinking...';
  
  ngAfterViewInit() {
    this.scrollToBottom();
    
    // Set up MutationObserver to watch for changes in the chat container
    const observer = new MutationObserver(() => {
      this.scrollToBottom();
    });
    
    observer.observe(this.messagesContainer.nativeElement, {
      childList: true,
      subtree: true
    });
  }
  
  sendMessage() {
    if (!this.currentMessage.trim() || this.chatService.isStreaming()) return;
    
    const message = this.currentMessage;
    this.currentMessage = '';
    
    // Send the message to the chat service
    this.chatService.sendMessage(message);
    
    // For development/testing, use this instead of the actual API call
    // Uncomment this and comment the line above when testing without a backend
    // this.chatService.simulateStreamResponse(message);
    
    this.scrollToBottom();
  }
  
  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      } catch (err) { }
    }, 10);
  }
}
