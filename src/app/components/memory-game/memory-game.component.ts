import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YearService } from '../../services/year.service';
import { FormsModule } from '@angular/forms';

interface MemoryCard {
  id: number;
  image: string;
  flipped: boolean;
  matched: boolean;
  transform: string;
  dealt?: boolean;
  scoredBy?: 'user' | 'ai';
}

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 w-full h-full z-0" [ngStyle]="{ 'background-image': 'url(' + backgroundImage + ')', 'background-size': getBackgroundSize(), 'background-position': 'left center', 'background-repeat': 'no-repeat' }"></div>
    <div class="relative flex flex-col items-center justify-center min-h-screen w-full z-10"
         [ngStyle]="isMobile() ? {
           'background-image': 'url(' + mobileBackgroundImage + ')',
           'background-size': 'cover',
           'background-position': 'center center'
         } : {}">
      <div class="memory-game-containers">
        <!-- User Game Container -->
        <div class="flex-1 bg-white bg-opacity-80 rounded-xl shadow-lg p-4 mt-4 max-w-md w-full h-full relative flex flex-col" style="min-height: 650px; max-height: 650px;">
          <h2 class="text-2xl font-bold mb-4 text-center labidabs-title">Memory Game</h2>
          <div class="flex justify-between items-center mb-4">
            <div class="flex flex-col items-center w-1/2">
              <div class="font-semibold text-blue-700 mb-1">You</div>
              <div class="flex h-4 w-28 bg-blue-100 rounded-full overflow-hidden">
                <div *ngFor="let hp of [0,1,2,3,4]" class="flex-1 mx-0.5 rounded-full" [ngClass]="userScore > hp ? 'bg-blue-500' : 'bg-blue-200'" style="transition: background 0.3s;"></div>
              </div>
            </div>
            <div class="flex flex-col items-center w-1/2">
              <div class="font-semibold text-pink-700 mb-1">{{ !aiOpponent ? 'Opponent' : (aiOpponent === 'ZEKIE' ? 'Zekie' : 'Chelle') }}</div>
              <div class="flex h-4 w-28 bg-pink-100 rounded-full overflow-hidden">
                <div *ngFor="let hp of [0,1,2,3,4]" class="flex-1 mx-0.5 rounded-full" [ngClass]="aiScore > hp ? 'bg-pink-500' : 'bg-pink-200'" style="transition: background 0.3s;"></div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-4 gap-3 sm:gap-4">
            <div *ngFor="let card of cards; let i = index"
                 class="relative aspect-square cursor-pointer select-none rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 fade-card"
                 (click)="aiOpponent && canPlay() && userTurn ? flipCard(i) : null"
                 [style.pointerEvents]="aiOpponent && canPlay() ? (card.flipped || isBusy || dealing ? 'none' : 'auto') : 'none'"
                 [style.transform]="card.transform"
                 [class.deal-in]="card.dealt"
                 [class.shake]="(userScore >= 5 || aiScore >= 5)"
                 [class.slide-out-ai]="card.matched && card.scoredBy === 'ai'"
                 [class.slide-out-user]="card.matched && card.scoredBy === 'user'">
              <div class="flip-card-inner w-full h-full border border-gray-300 shadow-sm rounded-lg"
                   [class.flipped]="card.flipped">
                <div class="flip-card-front w-full h-full">
                  <img src="assets/memory/back.jpg" alt="Back" class="w-full h-full object-cover" />
                </div>
                <div class="flip-card-back w-full h-full absolute top-0 left-0">
                  <img [src]="card.image" alt="Card" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="!aiOpponent" class="mt-2 text-center text-red-600 font-semibold">Please choose your opponent to start the game.</div>
          <div *ngIf="aiOpponent && !canPlay() && !gameWon && aiScore < 5 && userScore < 5" class="mt-4 text-center text-yellow-600 font-semibold">You can't change opponent during an ongoing game.</div>
          <div *ngIf="gameWon" class="mt-1 text-center text-green-700 font-semibold text-lg">
            <ng-container *ngIf="userScore === 4 && aiScore === 4; else notDraw">Draw!!! You matched all pairs!</ng-container>
            <ng-template #notDraw>Congratulations! You matched all pairs!</ng-template>
          </div>
          <div *ngIf="userScore >= 5" class="mt-1 text-center text-blue-700 font-bold text-lg">You win!</div>
          <div *ngIf="aiScore >= 5" class="mt-1 text-center text-pink-700 font-bold text-lg">{{ aiOpponent === 'ZEKIE' ? 'Zekie' : 'Chelle' }} wins!</div>
          <div class="flex justify-center mt-2 absolute left-0 right-0 bottom-0 restart-btn-container">
            <button (click)="resetGame()" class="focus:outline-none">
              <img src="assets/memory/restart.png" alt="Restart" class="w-24 h-auto mx-auto" />
            </button>
          </div>
        </div>
        <!-- AI Opponent Container -->
        <div class="flex-1 bg-gray-100 bg-opacity-70 rounded-xl shadow-lg p-4 mt-4 max-w-md w-full flex flex-col items-center justify-between h-full opponent-container-mobile" style="min-height: 650px; max-height: 650px;">
          <div class="w-full flex flex-col items-center">
            <img *ngIf="!aiOpponent" src="assets/memory/before.jpg" alt="Before Choose" class="before-img mb-2" />
            <div *ngIf="!aiOpponent" class="text-4xl font-bold text-center text-gray-700 mb-0 pb-0">Let's Play!!</div>
            <img *ngIf="aiOpponent" [src]="getAiImage()" alt="AI Avatar" class="w-64 h-64 object-cover rounded-full border-4 border-white shadow mb-8" />
            <h2 class="text-xl font-bold mb-4 text-center" [ngClass]="aiOpponent ? 'text-gray-700' : 'text-transparent select-none'">{{ aiOpponent ? (aiOpponent === 'ZEKIE' ? 'Zekie' : 'Chelle') : 'placeholder' }}</h2>
            <div class="text-gray-500 text-center mb-8">
              <span *ngIf="!aiOpponent" class="invisible select-none">Ready to have some fun?</span>
              <span *ngIf="aiOpponent && !gameStarted && !currentAiMessage" [ngSwitch]="aiOpponent">
                <span *ngSwitchCase="'CHELLE'">Ready to have some fun? I hope you're quick, because I'm feeling lucky! ✨</span>
                <span *ngSwitchCase="'ZEKIE'">Let's see if you can outsmart me. I never forget a card. 😉</span>
              </span>
              <span *ngIf="aiOpponent && currentAiMessage" [ngClass]="getMessageClass()">{{ currentAiMessage }}</span>
            </div>
          </div>
          <!-- Opponent Selection -->
          <div class="w-full" [ngClass]="!aiOpponent ? '-mt-2 pt-0 mb-0 pb-0' : 'mt-auto pt-6'">
            <div class="font-semibold mb-1 text-center text-gray-700 text-lg">Choose your opponent</div>
            <div class="flex justify-center gap-3">
              <label [class]="'flex flex-col items-center px-2 py-1 rounded-lg border-2 cursor-pointer transition ' + (aiOpponent === 'ZEKIE' ? 'border-blue-600 bg-blue-50 shadow' : 'border-gray-300 bg-white')">
                <input type="radio" name="aiOpponent" value="ZEKIE" [(ngModel)]="aiOpponent" class="hidden" [disabled]="isOpponentSelectionDisabled()" />
                <img src='assets/memory/zekie ai/default zekie.jpg' alt='Zekie' class='w-16 h-16 rounded-full mb-1 border-2 border-blue-300' />
                <span class="font-semibold text-blue-700">Zekie</span>
              </label>
              <label [class]="'flex flex-col items-center px-2 py-1 rounded-lg border-2 cursor-pointer transition ' + (aiOpponent === 'CHELLE' ? 'border-pink-600 bg-pink-50 shadow' : 'border-gray-300 bg-white')">
                <input type="radio" name="aiOpponent" value="CHELLE" [(ngModel)]="aiOpponent" class="hidden" [disabled]="isOpponentSelectionDisabled()" />
                <img src='assets/memory/chelle ai/default chelle.jpg' alt='Chelle' class='w-16 h-16 rounded-full mb-1 border-2 border-pink-300' />
                <span class="font-semibold text-pink-700">Chelle</span>
              </label>
            </div>
            <div *ngIf="aiOpponent && canPlay() && aiScore < 5 && userScore < 5 && userScore < 5 && aiScore < 5" class="mt-2 text-center text-yellow-600 text-sm">You can't change opponent during an ongoing game.</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .flip-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.8s cubic-bezier(0.4,2,0.6,1);
        transform-style: preserve-3d;
      }
      .flipped {
        transform: rotateY(180deg);
      }
      .just-unflipped {
        /* This class is used to retrigger the flip animation when flipping back */
        /* No extra styles needed, but class is toggled for reflow */
      }
      .flip-card-front, .flip-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        top: 0;
        left: 0;
      }
      .flip-card-front {
        z-index: 2;
        background: #e5e7eb;
      }
      .flip-card-back {
        transform: rotateY(180deg);
        z-index: 3;
      }
      .deal-in {
        animation: dealIn 0.5s cubic-bezier(0.4,2,0.6,1) both;
      }
      .shake {
        animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        animation-iteration-count: 2;
      }
      @keyframes dealIn {
        0% {
          opacity: 0;
          transform: scale(0.5) translateY(-60px) rotate(-10deg);
        }
        80% {
          opacity: 1;
          transform: scale(1.05) translateY(8px) rotate(2deg);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0) rotate(0deg);
        }
      }
      @keyframes shake {
        10%, 90% { transform: translateX(-2px); }
        20%, 80% { transform: translateX(4px); }
        30%, 50%, 70% { transform: translateX(-6px); }
        40%, 60% { transform: translateX(6px); }
      }
      .before-img {
        width: 22rem;
        height: 22rem;
        object-fit: cover;
        object-position: center top;
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      .fade-card {
        transition: opacity 0.3s;
      }
      .slide-out-ai {
        animation: slideOutAi 0.6s cubic-bezier(0.4,2,0.6,1) both;
        pointer-events: none !important;
      }
      .slide-out-user {
        animation: slideOutUser 0.6s cubic-bezier(0.4,2,0.6,1) both;
        pointer-events: none !important;
      }
      @keyframes slideOutAi {
        0% {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
        50% {
          opacity: 0.8;
          transform: scale(0.9) rotate(5deg);
        }
        100% {
          opacity: 0;
          transform: scale(0.7) translateX(120%) rotate(15deg);
        }
      }
      @keyframes slideOutUser {
        0% {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
        50% {
          opacity: 0.8;
          transform: scale(0.9) rotate(5deg);
        }
        100% {
          opacity: 0;
          transform: scale(0.7) translateY(120%) rotate(15deg);
        }
      }
    `,
    `.labidabs-title {
      font-family: 'Poppins', 'Quicksand', 'Montserrat', Arial, sans-serif;
      font-size: 1.7rem;
      font-weight: 900;
      letter-spacing: 0.04em;
      color: #3b3b6d;
      background: none;
      -webkit-background-clip: initial;
      -webkit-text-fill-color: initial;
      background-clip: initial;
      text-shadow: 0 2px 8px rgba(163,194,247,0.08), 0 1px 0 #fff;
      margin-bottom: 0.5em;
    }
    .restart-btn-container {
      bottom: 8px !important;
    }
    .memory-game-containers {
      display: flex;
      flex-direction: row;
      width: 100%;
      max-width: 80rem;
      gap: 2rem;
      align-items: stretch;
      justify-content: center;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
    @media (max-width: 900px) {
      .memory-game-containers {
        flex-direction: column;
        gap: 1.2rem;
        width: 100vw;
        max-width: 100vw;
        align-items: stretch;
        justify-content: flex-start;
        padding: 0 0.2rem;
      }
      .memory-game-containers > div {
        width: 100% !important;
        max-width: 100vw !important;
        min-width: 0 !important;
        margin: 0 auto !important;
        padding: 0.5rem 0.5rem 0.7rem 0.5rem !important;
        min-height: 420px !important;
        max-height: 480px !important;
      }
      .bg-white.bg-opacity-80 {
        background-color: rgba(255,255,255,0.4) !important;
      }
      .labidabs-title {
        font-size: 1.1rem !important;
        margin-bottom: 0.2em !important;
      }
      h2, .font-bold, .font-semibold {
        font-size: 1rem !important;
      }
      .w-64, .h-64 {
        width: 4.5rem !important;
        height: 4.5rem !important;
      }
      .w-16, .h-16 {
        width: 2.5rem !important;
        height: 2.5rem !important;
      }
      .before-img {
        width: 8rem !important;
        height: 8rem !important;
      }
      .grid.grid-cols-4 {
        gap: 0.3rem !important;
      }
      .aspect-square {
        min-width: 48px !important;
        min-height: 48px !important;
        max-width: 60px !important;
        max-height: 60px !important;
      }
      .flip-card-inner, .flip-card-front, .flip-card-back {
        border-radius: 0.5rem !important;
      }
      .p-4 {
        padding: 0.7rem !important;
      }
      .mt-4, .mb-4, .mt-2, .mb-2, .mt-1, .mb-1 {
        margin-top: 0.3rem !important;
        margin-bottom: 0.3rem !important;
      }
      .text-lg, .text-xl, .text-2xl, .text-4xl {
        font-size: 1rem !important;
      }
      .w-24 {
        width: 2.5rem !important;
      }
      .h-auto {
        height: auto !important;
      }
      .rounded-xl, .rounded-lg, .rounded-full {
        border-radius: 0.6rem !important;
      }
      .shadow-lg, .shadow, .shadow-sm {
        box-shadow: 0 1px 4px rgba(0,0,0,0.08) !important;
      }
      /* Make the opponent container appear only when scrolled down */
      .opponent-container-mobile {
        margin-top: 3.5rem !important;
        min-height: 320px !important;
      }
    }
    `
  ]
})
export class MemoryGameComponent {
  backgroundImage = '';
  mobileBackgroundImage = '';
  currentYear = '';

  cards: MemoryCard[] = [];
  flippedIndices: number[] = [];
  isBusy = false;
  gameWon = false;
  dealing = false;
  userScore = 0;
  aiScore = 0;
  aiOpponent: 'ZEKIE' | 'CHELLE' | null = null;
  aiState: 'default' | 'win' | 'lost' | 'turn' = 'default';
  userTurn = true;
  aiMemory: { [image: string]: number[] } = {};
  aiThinking = false;
  currentAiMessage = '';
  gameStarted = false;

  private readonly imagePaths = Array.from({ length: 8 }, (_, i) => `assets/memory/${(i+1).toString().padStart(2, '0')}.jpg`);
  private cardFlipSound = new Audio('assets/memory/memory games sounds/card flip.mp3');
  private flipDownSound = new Audio('assets/memory/memory games sounds/flip down.mp3');
  private matchedSound = new Audio('assets/memory/memory games sounds/matched.mp3');
  private startSound = new Audio('assets/memory/memory games sounds/start.mp3');
  private userWinnerSound = new Audio('assets/memory/memory games sounds/user winner.mp3');
  private userLosesSound = new Audio('assets/memory/memory games sounds/user loses.mp3');

  constructor(private yearService: YearService) {
    effect(() => {
      const year = this.yearService.getYear()();
      this.currentYear = year;
      this.backgroundImage = `assets/${year}.png`;
      this.mobileBackgroundImage = `assets/backgrounds/${year}.jpg`;
    });
    this.resetGame();
  }

  ngOnInit() {
    this.playStartSound();
  }

  private playSound(sound: HTMLAudioElement) {
    sound.currentTime = 0;
    sound.play();
  }

  private playStartSound() {
    this.playSound(this.startSound);
  }

  private playCardFlipSound() {
    this.playSound(this.cardFlipSound);
  }

  private playFlipDownSound() {
    this.playSound(this.flipDownSound);
  }

  private playMatchedSound() {
    this.playSound(this.matchedSound);
  }

  private playUserWinnerSound() {
    this.playSound(this.userWinnerSound);
  }

  private playUserLosesSound() {
    this.playSound(this.userLosesSound);
  }

  getBackgroundSize(): string {
    return this.currentYear === '2022' ? '300% auto' : '250% auto';
  }

  resetGame() {
    this.playStartSound();
    this.cards = this.shuffleCards();
    this.flippedIndices = [];
    this.isBusy = false;
    this.gameWon = false;
    this.dealing = true;
    this.userScore = 0;
    this.aiScore = 0;
    this.userTurn = true;
    this.aiState = 'default';
    this.aiMemory = {};
    this.aiThinking = false;
    this.aiOpponent = null;
    this.currentAiMessage = '';
    this.gameStarted = false;
    // Animate dealing cards in
    this.cards.forEach((card, i) => {
      card.dealt = false;
      setTimeout(() => {
        card.dealt = true;
        if (i === this.cards.length - 1) {
          this.dealing = false;
        }
      }, i * 60 + 100); // staggered delay
    });
  }

  shuffleCards(): MemoryCard[] {
    const pairs = [...this.imagePaths, ...this.imagePaths];
    const shuffled = pairs
      .map((img, idx) => ({ img, sort: Math.random(), idx }))
      .sort((a, b) => a.sort - b.sort)
      .map((item, i) => ({
        id: i,
        image: item.img,
        flipped: false,
        matched: false,
        transform: '', // No rotation or translation
        scoredBy: undefined
      }));
    return shuffled;
  }

  flipCard(index: number) {
    if (this.isBusy || this.cards[index].flipped || this.cards[index].matched || this.dealing) return;
    
    // Set game as started immediately when first card is clicked
    if (!this.gameStarted) {
      this.gameStarted = true;
    }
    
    this.playCardFlipSound();
    this.cards[index].flipped = true;
    this.flippedIndices.push(index);
    // AI remembers this card
    if (!this.userTurn) {
      const img = this.cards[index].image;
      if (!this.aiMemory[img]) this.aiMemory[img] = [];
      if (!this.aiMemory[img].includes(index)) this.aiMemory[img].push(index);
    }
    if (this.flippedIndices.length === 2) {
      this.isBusy = true;
      setTimeout(() => {
        this.checkForMatch();
      }, 800);
    }
  }

  checkForMatch() {
    const [firstIdx, secondIdx] = this.flippedIndices;
    const firstCard = this.cards[firstIdx];
    const secondCard = this.cards[secondIdx];
    let matched = false;
    if (firstCard.image === secondCard.image) {
      firstCard.matched = true;
      secondCard.matched = true;
      matched = true;
      if (this.userTurn) {
        this.userScore++;
        this.updateAiMessage('userRight');
        firstCard.scoredBy = 'user';
        secondCard.scoredBy = 'user';
      } else {
        this.aiScore++;
        this.updateAiMessage('aiRight');
        firstCard.scoredBy = 'ai';
        secondCard.scoredBy = 'ai';
      }
      
      const isGameOver = this.userScore >= 5 || this.aiScore >= 5 || this.cards.every(c => c.matched);

      if (isGameOver) {
        // Don't play matched sound for the final pair, only play win/lose/draw sounds
        setTimeout(() => {
          if (this.userScore > this.aiScore) {
            this.playUserWinnerSound();
            this.updateAiMessage('aiLose');
          } else if (this.aiScore > this.userScore) {
            this.playUserLosesSound();
            this.updateAiMessage('aiWin');
          } else { // Draw
            this.playUserWinnerSound();
            this.updateAiMessage('aiLose');
          }
        }, 400);
      } else {
        // Only play matched sound for non-final pairs
        this.playMatchedSound();
      }
    } else {
      if (this.userTurn) {
        this.updateAiMessage('userWrong');
      } else {
        this.updateAiMessage('aiWrong');
      }
      setTimeout(() => {
        this.playFlipDownSound();
        firstCard.flipped = false;
        secondCard.flipped = false;
      }, 400);
    }
    this.flippedIndices = [];
    this.isBusy = false;
    this.checkGameWon();
    // Switch turn logic
    if (!this.gameWon && this.userScore < 5 && this.aiScore < 5) {
      if (matched) {
        // If matched, same player goes again
        if (!this.userTurn) {
          setTimeout(() => this.aiTurn(), 900);
        }
      } else {
        this.userTurn = !this.userTurn;
        if (!this.userTurn) {
          setTimeout(() => this.aiTurn(), 900);
        } else {
          this.aiState = 'default';
        }
      }
    }
  }

  aiTurn() {
    if (this.gameWon || this.userScore >= 5 || this.aiScore >= 5) return;
    this.aiState = 'turn';
    this.aiThinking = true;
    // Build memory of all seen cards
    this.updateAiMemory();
    let pair: [number, number] | null = null;
    if (this.aiOpponent === 'ZEKIE') {
      // Zekie is dumb until userScore >= 4, then smart
      if (this.userScore < 4) {
        pair = this.pickRandomPair();
      } else {
        pair = this.findKnownPair() || this.pickRandomPair();
      }
    } else if (this.aiOpponent === 'CHELLE') {
      // Chelle is smart until userScore >= 4, then dumb
      if (this.userScore < 4) {
        pair = this.findKnownPair() || this.pickRandomPair();
      } else {
        pair = this.pickRandomPair();
      }
    }
    if (pair) {
      // Flip first card
      setTimeout(() => {
        this.flipCard(pair![0]);
        // Flip second card
        setTimeout(() => {
          this.flipCard(pair![1]);
          this.aiThinking = false;
        }, 700);
      }, 700);
    }
  }

  updateAiMemory() {
    // AI remembers all face-up cards
    this.cards.forEach((card, idx) => {
      if (card.flipped && !card.matched) {
        if (!this.aiMemory[card.image]) this.aiMemory[card.image] = [];
        if (!this.aiMemory[card.image].includes(idx)) this.aiMemory[card.image].push(idx);
      }
    });
  }

  findKnownPair(): [number, number] | null {
    for (const img in this.aiMemory) {
      const indices = this.aiMemory[img].filter(idx => !this.cards[idx].matched && !this.cards[idx].flipped);
      if (indices.length >= 2) {
        return [indices[0], indices[1]];
      }
    }
    // Also check for one seen and one unknown
    for (const img in this.aiMemory) {
      const seen = this.aiMemory[img].find(idx => !this.cards[idx].matched && !this.cards[idx].flipped);
      if (seen !== undefined) {
        for (let i = 0; i < this.cards.length; i++) {
          if (!this.cards[i].matched && !this.cards[i].flipped && this.cards[i].image === img && !this.aiMemory[img].includes(i)) {
            return [seen, i];
          }
        }
      }
    }
    return null;
  }

  pickRandomPair(): [number, number] {
    const available = this.cards
      .map((card, idx) => (!card.matched && !card.flipped ? idx : -1))
      .filter(idx => idx !== -1);
    if (available.length < 2) return [available[0], available[0]];
    const first = available[Math.floor(Math.random() * available.length)];
    let second = first;
    while (second === first && available.length > 1) {
      second = available[Math.floor(Math.random() * available.length)];
    }
    return [first, second];
  }

  checkGameWon() {
    this.gameWon = this.cards.every(card => card.matched);
    if (this.aiScore >= 5) this.aiState = 'win';
    else if (this.userScore >= 5) this.aiState = 'lost';
    // If someone wins, flip all unmatched cards and trigger shake
    if (this.userScore >= 5 || this.aiScore >= 5) {
      this.cards.forEach(card => {
        if (!card.matched) {
          card.flipped = true;
        }
      });
    }
  }

  getAiImage(): string {
    if (!this.aiOpponent) return '';
    // Draw: both scored 4 and all pairs matched
    if (this.userScore === 4 && this.aiScore === 4 && this.gameWon) {
      if (this.aiOpponent === 'ZEKIE') {
        return 'assets/memory/zekie ai/lost zekie.jpg';
      } else {
        return 'assets/memory/chelle ai/lost chelle.jpg';
      }
    }
    if (this.aiOpponent === 'ZEKIE') {
      if (this.aiScore >= 5) return 'assets/memory/zekie ai/win zekie.jpg';
      if (this.userScore >= 5) return 'assets/memory/zekie ai/lost zekie.jpg';
      if (!this.isGameStarted()) return 'assets/memory/zekie ai/default zekie.jpg';
      return 'assets/memory/zekie ai/players turn-zekie.jpg';
    } else {
      if (this.aiScore >= 5) return 'assets/memory/chelle ai/win chelle.jpg';
      if (this.userScore >= 5) return 'assets/memory/chelle ai/lost chelle.jpg';
      if (!this.isGameStarted()) return 'assets/memory/chelle ai/default chelle.jpg';
      return 'assets/memory/chelle ai/players turn-chelle.jpg';
    }
  }

  isGameStarted(): boolean {
    // Game is started if any card is flipped or any score is made
    return this.cards.some(card => card.flipped || card.matched) || this.userScore > 0 || this.aiScore > 0;
  }

  canPlay(): boolean {
    // Can play if the game is ongoing (not won/lost)
    return this.userScore < 5 && this.aiScore < 5 && !this.gameWon;
  }

  isOpponentSelectionDisabled(): boolean {
    return this.gameStarted || this.userScore >= 5 || this.aiScore >= 5 || (this.userScore === 4 && this.aiScore === 4 && this.gameWon);
  }

  getMessageClass(): string {
    if (this.aiOpponent === 'ZEKIE') {
      return 'text-blue-700 text-lg font-semibold';
    } else if (this.aiOpponent === 'CHELLE') {
      return 'text-pink-700 text-lg font-semibold';
    } else {
      return 'invisible select-none';
    }
  }

  private updateAiMessage(event: 'userWrong' | 'userRight' | 'aiWrong' | 'aiRight' | 'aiWin' | 'aiLose') {
    if (!this.aiOpponent) return;
    
    const messages = {
      ZEKIE: {
        userWrong: 'Lol',
        userRight: 'Damn',
        aiWrong: 'Seriously?',
        aiRight: 'Check',
        aiWin: 'Checkmate',
        aiLose: 'NOOOOOO!!'
      },
      CHELLE: {
        userWrong: 'Try again',
        userRight: 'No..',
        aiWrong: 'You\'re lucky I missed',
        aiRight: 'Gotcha!',
        aiWin: 'Yehey! I win!',
        aiLose: 'Nice game! Let\'s play again'
      }
    };

    this.currentAiMessage = messages[this.aiOpponent!][event];
    
    // Only clear message after 1 second for non-final messages
    if (event !== 'aiWin' && event !== 'aiLose') {
      setTimeout(() => {
        if (this.currentAiMessage === messages[this.aiOpponent!][event]) {
          this.currentAiMessage = '';
        }
      }, 1000);
    }
    // Win/lose messages will remain until game restart
  }

  isMobile(): boolean {
    return window.innerWidth <= 900;
  }
} 