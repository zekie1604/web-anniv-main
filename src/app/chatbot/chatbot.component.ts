import { Component, effect, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ChatService } from '../services/chat.service';
import { YearService } from '../services/year.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
  animated?: boolean; // For assistant typing animation
}

interface ChatResponse {
  text: string;
  image: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements AfterViewInit, OnDestroy {
  private GEMINI_API_KEY = environment.geminiApiKey;
  private GEMINI_API_URL = environment.geminiApiUrl;
  
  messages: ChatMessage[] = [];
  zekieMessages: ChatMessage[] = [];
  chelleMessages: ChatMessage[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  backgroundImage: string = '';
  mobileBackgroundImage: string = '';
  currentYear: string = '';
  selectedAvatar: 'ZEKIE' | 'CHELLE' = 'ZEKIE';
  showHelp: boolean = true;
  helpShown: boolean = false;
  currentAvatarImage: string = 'assets/zekie bot/default.jpg';
  previousAvatarImage: string | null = null;
  isMorphing = false;
  
  // Jealous Zekie animation properties
  jealousZekieVisible: boolean = false;
  jealousZekieCurrentImage: string = '';
  jealousZekieIsClicked: boolean = false;
  jealousZekieIsLeft: boolean = true;
  private jealousZekieCheckInterval: any = null;

  placeholderText: string = 'Ask anything';

  private zekieQuestions: string[] = [
    'What is your full name?',
    'How old are you?',
    'When is your birthday?',
    'Where are you from?',
    'How tall are you?',
    'What is your weight?',
    'Where did you go to school?',
    'What did you major in?',
    'Are you a licensed teacher?',
    'What are your skills?',
    'What are your hobbies?',
    'Do you like gaming?',
    'What is your favorite game?',
    'Who is your favorite Pokémon?',
    'What is your favorite snack?',
    'What is your favorite chocolate?',
    'What is your favorite ulam?',
    'What are your favorite drinks?',
    'What is your favorite fast food?',
    'What is your favorite fruit?',
    'What is your favorite vegetable?',
    'What are your favorite animes?',
    'What is your favorite song?',
    'What is your favorite movie?',
    'What is your MBTI?',
    'Who is your partner?',
    'When is your anniversary?',
    'How did you and Chelle meet?',
    'Tell me a trivia about you.'
  ];
  private chelleQuestions: string[] = [
    'What is your full name?',
    'How old are you?',
    'Where did you go to school?',
    'What did you major in?',
    'Are you a licensed teacher?',
    'What are your skills?',
    'What are your hobbies?',
    'Do you like gaming?',
    'What are your favorite games?',
    'Who is your favorite Pokémon?',
    'What is your favorite Wild Rift character?',
    'What is your favorite snack?',
    'What is your favorite chocolate?',
    'What is your favorite ulam?',
    'What are your favorite drinks?',
    'What is your favorite fast food restaurant?',
    'What is your favorite fruit?',
    'What is your favorite vegetable?',
    'What are your favorite animes?',
    'Who are your favorite anime characters?',
    'What is your favorite song?',
    'What are your favorite movies?',
    'What is your favorite Harry Potter film?',
    'What is your Hogwarts house?',
    'What is your MBTI?',
    'Who is your partner?',
    'When is your anniversary?',
    'How did you and Zekie meet?',
    'Tell me a fun fact about you.'
  ];

  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('chatInput') chatInput!: ElementRef<HTMLInputElement>;

  constructor(
    private chatService: ChatService,
    private yearService: YearService
  ) {
    effect(() => {
      const year = this.yearService.getYear()();
      this.currentYear = year;
      this.backgroundImage = `assets/${year}.png`;
      this.mobileBackgroundImage = `assets/backgrounds/${year}.jpg`;
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
    // Show help message automatically for 5 seconds on first visit
    if (!this.helpShown) {
    setTimeout(() => {
      this.showHelp = false;
        this.helpShown = true;
    }, 5000);
    }
    
    // Start checking jealous Zekie state
    this.startJealousZekieCheck();
  }

  ngOnDestroy() {
    if (this.jealousZekieCheckInterval) {
      clearInterval(this.jealousZekieCheckInterval);
    }
    this.chatService.stopJealousZekieAnimation();
  }

  getBackgroundSize(): string {
    return this.currentYear === '2022' ? '250% auto' : '200% auto';
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }

  selectAvatar(avatar: 'ZEKIE' | 'CHELLE') {
    // If switching to Zekie and he is sleeping, preserve the sleeping avatar
    if (avatar === 'ZEKIE' && this.chatService['zekieIsSleeping']) {
      this.selectedAvatar = 'ZEKIE';
      this.messages = this.zekieMessages;
      this.currentAvatarImage = 'assets/zekie bot/sleeping.jpg';
      this.scrollToBottom();
      this.showHelp = false;
      this.chatService.stopJealousZekieAnimation();
      this.jealousZekieVisible = false;
      return;
    }
    if (avatar === 'ZEKIE' && this.currentAvatarImage === 'assets/zekie bot/default.jpg') {
      this.selectedAvatar = 'ZEKIE';
      this.messages = this.zekieMessages;
      this.scrollToBottom();
      this.showHelp = false;
      this.chatService.stopJealousZekieAnimation();
      this.jealousZekieVisible = false;
      return;
    }
    if (avatar === 'CHELLE' && this.currentAvatarImage === 'assets/chelle bot/default.jpg') {
      this.selectedAvatar = 'CHELLE';
      this.messages = this.chelleMessages;
      this.scrollToBottom();
      this.showHelp = false;
      this.chatService.startJealousZekieAnimation();
      return;
    }
    this.previousAvatarImage = this.currentAvatarImage;
    this.currentAvatarImage = avatar === 'ZEKIE' ? 'assets/zekie bot/default.jpg' : 'assets/chelle bot/default.jpg';
    this.isMorphing = true;
    this.selectedAvatar = avatar;
    this.messages = avatar === 'ZEKIE' ? this.zekieMessages : this.chelleMessages;
    this.scrollToBottom();
    this.showHelp = false;
    if (avatar === 'CHELLE') {
      this.chatService.startJealousZekieAnimation();
    } else {
      this.chatService.stopJealousZekieAnimation();
      this.jealousZekieVisible = false;
    }
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;
    this.showHelp = false;
    this.chatService.userInteracted();
    const userMessage: ChatMessage = {
      text: this.userInput,
      isUser: true
    };
    this.messages.push(userMessage);
    if (this.selectedAvatar === 'ZEKIE') {
      this.zekieMessages = [...this.messages];
    } else {
      this.chelleMessages = [...this.messages];
    }
    this.scrollToBottom();
    const userMessageText = this.userInput;
    this.userInput = '';
    this.isLoading = true;
    try {
      const response: ChatResponse = await this.chatService.getResponse(userMessageText, this.selectedAvatar);
      if (response.image !== this.currentAvatarImage) {
        this.previousAvatarImage = this.currentAvatarImage;
        this.currentAvatarImage = response.image;
        this.isMorphing = true;
      } else {
      this.currentAvatarImage = response.image;
      }
      await this.animateAssistantMessage(response.text);
    } catch (error) {
      console.error('Error getting response:', error);
      await this.animateAssistantMessage("I'm sorry, there was an error processing your request.");
    } finally {
      this.isLoading = false;
      setTimeout(() => {
        this.chatInput?.nativeElement.focus();
      }, 0);
    }
  }

  private async animateAssistantMessage(fullText: string) {
    let displayed = '';
    const message: ChatMessage = { text: '', isUser: false, animated: true };
    this.messages.push(message);
    
    // Update the appropriate message history
    if (this.selectedAvatar === 'ZEKIE') {
      this.zekieMessages = [...this.messages];
    } else {
      this.chelleMessages = [...this.messages];
    }
    
    this.scrollToBottom();
    for (let i = 0; i < fullText.length; i++) {
      displayed += fullText[i];
      message.text = displayed;
      await this.delay(5); // Typing speed (ms per character) - now faster
    }
    message.animated = false;
    this.scrollToBottom();
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  toggleHelp() {
    this.showHelp = !this.showHelp;
    if (this.showHelp) {
      this.helpShown = true;
    }
  }

  closeHelp() {
    this.showHelp = false;
    this.helpShown = true;
  }

  onJealousZekieClick() {
    this.chatService.handleJealousZekieClick();
  }

  startJealousZekieCheck() {
    this.jealousZekieCheckInterval = setInterval(() => {
      if (this.selectedAvatar === 'CHELLE') {
        const state = this.chatService.getJealousZekieState();
        this.jealousZekieVisible = state.visible;
        this.jealousZekieCurrentImage = state.currentImage;
        this.jealousZekieIsClicked = state.isClicked;
        this.jealousZekieIsLeft = state.isLeft;
      } else {
        this.jealousZekieVisible = false;
        this.jealousZekieIsClicked = false;
        this.chatService.stopJealousZekieAnimation();
      }
    }, 100); // Check every 100ms for smooth updates
  }

  onAvatarLoaded() {
    if (this.isMorphing) {
      setTimeout(() => {
        this.previousAvatarImage = null;
        this.isMorphing = false;
      }, 600);
    }
  }

  // Responsive background getter
  getResponsiveBackground(): string {
    return window.innerWidth <= 900
      ? this.mobileBackgroundImage
      : this.backgroundImage;
  }

  isMobile(): boolean {
    return window.innerWidth <= 900;
  }

  // Listen for window resize events to update background
  @HostListener('window:resize')
  onResize() {
    // This will trigger Angular change detection and update the background
  }
}
