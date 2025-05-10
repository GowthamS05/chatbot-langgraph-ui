// services/chat.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

export interface StreamChunk {
  type: string;
  content?: string;
  checkpoint_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // Using signals for reactive state management
  private messagesSignal = signal<any[]>([
    {
      text: "Hello! I'm your Enterprise Assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  private checkpoint_id = signal<string>('')
  
  private isStreamingSignal = signal<boolean>(false);
  private streamingContentSignal = signal<string>('');
  private eventSourceSignal = signal<EventSource | null>(null);
  
  // Expose readonly signals to components
  readonly messages = this.messagesSignal.asReadonly();
  readonly isStreaming = this.isStreamingSignal.asReadonly();
  readonly streamingContent = this.streamingContentSignal.asReadonly();
  
  constructor() {}
  
  sendMessage(userMessage: string): void {
    // Add user message to chat
    this.messagesSignal.update(messages => [
      ...messages,
      {
        text: userMessage,
        isUser: true,
        timestamp: new Date()
      }
    ]);
    
    // Start streaming response from server
    this.streamChatResponse(userMessage);
  }
  
  private streamChatResponse(userQuery: string): void {
    // Close any existing event source
    this.closeEventSource();
    
    // Reset streaming content
    this.streamingContentSignal.set('');
    
    // Set streaming flag
    this.isStreamingSignal.set(true);
    
    
    // In a real app, userQuery would be sent to the backend
    // Here we're assuming the backend API endpoint
    let url = `http://127.0.0.1:8000/stream/${encodeURIComponent(userQuery)}`;

    if(this.checkpoint_id()){
        url = `${url}?checkpoint_id=${this.checkpoint_id()}`
    }
    else{
        this.checkpoint_id.set(uuidv4());
        url = `${url}?checkpoint_id=${this.checkpoint_id()}`
    }
    
    // Create a new event source
    const eventSource = new EventSource(url);
    this.eventSourceSignal.set(eventSource);
    
    // Handle incoming data events
    eventSource.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleStreamChunk(data);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    });
    
    // Handle error events
    eventSource.addEventListener('error', (error) => {
      console.error('EventSource error:', error);
      this.finishStreaming();
    });
  }
  
  // For testing without a backend
  simulateStreamResponse(userQuery: string): void {
    // Close any existing event source
    this.closeEventSource();
    
    // Reset streaming content
    this.streamingContentSignal.set('');
    
    // Set streaming flag
    this.isStreamingSignal.set(true);
    
    // Sample data from the provided format
    const sampleData = [
      { type: 'checkpoint', checkpoint_id: '786f4c4a-cf3a-431c-9206-e21c7f7907e2' },
      { type: 'content', content: '' },
      { type: 'content', content: '###' },
      { type: 'content', content: ' Summary' },
      { type: 'content', content: ' of' },
      { type: 'content', content: ' Sales' },
      { type: 'content', content: ' Data' },
      { type: 'content', content: '\n\n' },
      { type: 'content', content: '**' },
      { type: 'content', content: 'Data' },
      { type: 'content', content: ' Overview' },
      { type: 'content', content: ':' },
      { type: 'content', content: '**\n' },
      // More content chunks would follow...
      { type: 'end' }
    ];
    
    let index = 0;
    
    // Simulate streaming with delays
    const streamInterval = setInterval(() => {
      if (index < sampleData.length) {
        this.handleStreamChunk(sampleData[index]);
        index++;
      } else {
        clearInterval(streamInterval);
        this.finishStreaming();
      }
    }, 100);
  }
  
  private handleStreamChunk(data: StreamChunk): void {
    switch (data.type) {
      case 'checkpoint':
        // Handle checkpoint (could be used for resuming streams)
        console.log('Checkpoint:', data.checkpoint_id);
        break;
        
      case 'content':
        // Append content to the streaming content
        if (data.content !== undefined) {
          this.streamingContentSignal.update(content => content + data.content);
        }
        break;
        
      case 'end':
        // End of stream
        this.finishStreaming();
        break;
        
      default:
        console.warn('Unknown event type:', data.type);
    }
  }
  
  private finishStreaming(): void {
    // Close event source
    this.closeEventSource();
    
    // Get final content
    const finalContent = this.streamingContentSignal();
    
    if (finalContent.trim()) {
      // Add bot message with final content
      this.messagesSignal.update(messages => [
        ...messages,
        {
          text: finalContent,
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
    
    // Reset streaming state
    this.isStreamingSignal.set(false);
    this.streamingContentSignal.set('');
  }
  
  private closeEventSource(): void {
    const currentEventSource = this.eventSourceSignal();
    if (currentEventSource) {
      currentEventSource.close();
      this.eventSourceSignal.set(null);
    }
  }
}