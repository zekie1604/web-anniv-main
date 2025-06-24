import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

interface QAPair {
  question: string | RegExp;
  answer: string;
}

interface ChatResponse {
  text: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private GEMINI_API_KEY = environment.geminiApiKey;
  private GEMINI_API_URL = environment.geminiApiUrl;
  private zekieMessageCount = 0;
  private zekieIsSleeping = false;
  private zekieBreakingBadMode = false;

  // Zekie avatar images
  private zekieImages = {
    default: 'assets/zekie bot/default.jpg',
    teaching: 'assets/zekie bot/teaching.jpg',
    games: 'assets/zekie bot/games.jpg',
    pokemon: 'assets/zekie bot/pokemon.jpg',
    relationship: 'assets/zekie bot/relationship.jpg',
    education: 'assets/zekie bot/education.jpg',
    anime: 'assets/zekie bot/anime.jpg',
    harryPotter: 'assets/zekie bot/harry potter.jpg',
    thinking: 'assets/zekie bot/thinking.jpg',
    sleeping: 'assets/zekie bot/sleeping.jpg',
    fallback: 'assets/zekie bot/fallback.jpg',
    music: 'assets/zekie bot/music.jpg',
    disgusted: 'assets/zekie bot/disgusted.jpg',
    skills: 'assets/zekie bot/skills.jpg',
    food: 'assets/zekie bot/food.jpg',
    subaru: 'assets/zekie bot/subaru.jpg'
  };

  // Chelle avatar images
  private chelleImages = {
    default: 'assets/chelle bot/default.jpg',
    teaching: 'assets/chelle bot/teaching.jpg',
    games: 'assets/chelle bot/games.jpg',
    pokemon: 'assets/chelle bot/pokemon.jpg',
    relationship: 'assets/chelle bot/relationship.jpg',
    education: 'assets/chelle bot/education.jpg',
    harryPotter: 'assets/chelle bot/harry potter.jpg',
    thinking: 'assets/chelle bot/thinking.jpg',
    music: 'assets/chelle bot/music.jpg',
    pikachu: 'assets/chelle bot/pikachu.jpg',
    firstMove: 'assets/chelle bot/first move.jpg',
    food: 'assets/chelle bot/food.jpg',
    anime: 'assets/chelle bot/anime.jpg',
    jealousHappyLeft: 'assets/chelle bot/zekie jealous/happy left.png',
    jealousSeriousLeft: 'assets/chelle bot/zekie jealous/serious left.png',
    jealousHappyRight: 'assets/chelle bot/zekie jealous/happy right.png',
    jealousSeriousRight: 'assets/chelle bot/zekie jealous/serious right.png'
  };

  private predefinedQA: QAPair[] = [
    {
      question: /^hi|hello|hey$/i,
      answer: "Hello! How can I help you today?"
    },
    {
      question: /^how are you$/i,
      answer: "I'm doing well, thank you for asking! How can I assist you?"
    },
    {
      question: /^what is your name$/i,
      answer: "I'm your friendly chatbot assistant. You can call me ChatBot!"
    },
    {
      question: /^bye|goodbye$/i,
      answer: "Goodbye! Have a great day!"
    }
  ];

  private zekieProfile: any | null = null;
  private zekieProfileLoaded = false;

  private zekieFieldSynonyms: { [field: string]: string[] } = {
    name: ['name', 'full name', 'called', 'who are you'],
    age: ['age', 'old', 'years'],
    birthday: ['birthday', 'birth date', 'born'],
    hometown: ['hometown', 'from', 'where do you live', 'where are you from', 'home town', 'origin'],
    height: ['height', 'tall', 'stature'],
    weight: ['weight', 'weigh', 'mass'],
    school: ['school', 'university', 'college', 'alma mater'],
    course: ['course', 'major', 'degree', 'studied'],
    teacher: ['teacher', 'license', 'licensed', 'board exam', 'LET', 'teaching experience', 'teach', 'teaching'],
    vices: ['smoke', 'drink', 'vice', 'vices', 'alcohol', 'cigarette'],
    skills: ['skill', 'skills', 'talent', 'ability', 'abilities'],
    hobbies: ['hobby', 'hobbies', 'pastime', 'interests'],
    gaming: ['do you like games', 'do you like gaming', 'do you play games', 'are you into games', 'are you into gaming', 'do you enjoy games', 'do you enjoy gaming', 'do you love games', 'do you love gaming', 'are you a gamer', 'do you game', 'are you good at games', 'are you good at gaming'],
    favoriteGame: [
      'favorite game', 'favorite games', 'game you like', 'games you like', 'best game', 'best games', 'video game', 'video games',
      'what games are you playing', 'what games do you play', 'games you play', 'games you are playing', 'games you are playing right now',
      'what games have you played', 'games have you played', 'games you have played', 'what games did you play', 'games did you play',
      'suggest games', 'suggest a game', 'recommend a game', 'recommend games', 'game recommendation', 'game suggestions', 'game suggestion', 'games to play', 'games to try', 'what are you playing', 'what are you playing right now'
    ],
    favoritePokemon: ['favorite pokemon', 'pokemon you like', 'best pokemon'],
    favoriteSnack: ['favorite snack', 'snack you like', 'best snack'],
    favoriteChocolate: ['favorite chocolate', 'chocolate you like', 'best chocolate'],
    favoriteUlam: ['favorite ulam', 'ulam you like', 'best ulam', 'dish'],
    favoriteDrinks: ['favorite drink', 'drinks you like', 'beverage', 'coffee', 'iced tea'],
    favoriteFastFood: ['favorite fast food', 'fast food you like', 'best fast food'],
    favoriteFruit: ['favorite fruit', 'fruit you like', 'best fruit'],
    favoriteVegetable: ['favorite vegetable', 'vegetable you like', 'best vegetable'],
    favoriteAnimeCharacter: ['favorite anime character', 'who is your favorite anime character', 'best anime character', 'subaru', 're zero', 're:zero'],
    favoriteAnimeFilm: ['favorite anime film', 'anime film', 'anime movie', 'japanese movie'],
    favoriteMovieCharacter: ['favorite character', 'movie character', 'film character', 'harry potter character', 'luna lovegood'],
    favoriteWildRiftCharacter: ['favorite wild rift character', 'wild rift character', 'wild rift champ', 'favorite wild rift champ', 'favorite wild rift hero', 'wild rift hero'],
    favoriteWutheringWavesCharacter: ['favorite wuthering waves character', 'wuthering waves character', 'wuthering waves hero', 'wuthering waves champ'],
    favoriteTFTCharacter: ['favorite teamfight tactics character', 'favorite tft character', 'teamfight tactics character', 'tft character', 'teamfight tactics champ', 'tft champ', 'teamfight tactics hero', 'tft hero'],
    anime: ['anime', 'favorite anime', 'cartoon', 'japanese animation'],
    music: ['music', 'song', 'favorite song', 'genre', 'band', 'singer'],
    movie: ['movie', 'film', 'favorite movie', 'favorite film', 'cinema', 'series'],
    personality: ['personality', 'mbti', 'type', 'architect'],
    partner: ['partner', 'girlfriend', 'relationship', 'significant other'],
    love: [
      'do you love chelle', 'do you love rachelle', 'do you love joy', 'do you love your girlfriend', 'do you love your partner', 'do you love her',
      'are you in love with chelle', 'are you in love with rachelle', 'are you in love with joy',
      'do you like chelle', 'do you like rachelle', 'do you like joy', 'do you like your girlfriend', 'do you like your partner', 'do you like her',
      'do you still love chelle', 'do you still love rachelle', 'do you still love joy', 'do you still love your girlfriend', 'do you still love your partner', 'do you still love her',
      'do you still like chelle', 'do you still like rachelle', 'do you still like joy', 'do you still like your girlfriend', 'do you still like your partner', 'do you still like her'
    ],
    anniversary: ['anniversary', 'anniv', 'date'],
    marriage: ['marriage', 'marry', 'wedding', 'married', 'marry you'],
    hogwartsHouse: ['hogwarts house', 'house in harry potter', 'ravenclaw', 'gryffindor', 'slytherin', 'hufflepuff'],
    engagementStatus: ['engagement', 'engaged', 'engagement status', 'proposed', 'proposal'],
    howStarted: [
      'how started', 'how did you meet', 'first move', 'who confessed', 'how did your relationship start',
      'who made the first move', 'who made first move', 'who initiated', 'who started', 'who said i love you first', 'who said i like you first',
      'how did you and chelle meet', 'how did you and zekie meet', 'how did you meet chelle', 'how did you meet zekie',
      'how did you first meet', 'how did you meet each other', 'how did you two meet', 'how did you two first meet',
      'when did you meet', 'where did you meet', 'how did you guys meet', 'how did you both meet'
    ],
    trivia: ['trivia', 'trivias', 'tell me about yourself', 'share something about yourself', 'tell me 3 trivias about yourself'],
    favoriteFood: ['favorite food', 'food you like', 'best food', 'what do you like to eat', 'what\'s your favorite food'],
    introvert: ['introvert', 'introverted', 'are you introvert', 'are you introverted', 'do you like being alone', 'do you prefer being alone'],
    rich: ['rich', 'wealthy', 'money', 'poor', 'broke', 'are you rich', 'are you poor', 'do you have money', 'are you wealthy'],
  };

  private zekieValueDescriptions: { [key: string]: string } = {
    'skorupi': 'Skorupi is a Poison/Bug-type Pokémon. I appreciate its unique abilities and strategic potential.',
    'changli': 'Changli is a character in Wuthering Waves. I value characters with depth and tactical advantage.',
    'rengar': 'Rengar is a champion in Wild Rift. Efficiency and precision are his strengths.',
    'disco twisted fate': 'Disco Twisted Fate is a unique variant in Teamfight Tactics. I enjoy strategies that are unconventional yet effective.',
    'luna lovegood': 'Luna Lovegood is a character from Harry Potter. Her perspective is unconventional, which I find valuable.',
    'weathering with you': 'Weathering With You is a Japanese anime film. I appreciate stories that combine emotion with thoughtful narrative.'
    // Add more as needed
  };

  private chelleProfile: any | null = null;
  private chelleProfileLoaded = false;

  private chelleFieldSynonyms: { [field: string]: string[] } = {
    name: ['name', 'full name', 'called', 'who are you'],
    age: ['age', 'old', 'years'],
    birthday: ['birthday', 'birth date', 'born'],
    school: ['school', 'university', 'college', 'alma mater'],
    course: ['course', 'major', 'degree', 'studied'],
    teacher: ['teacher', 'license', 'licensed', 'board exam', 'LET', 'teaching experience', 'teach', 'teaching'],
    vices: ['smoke', 'drink', 'vice', 'vices', 'alcohol', 'cigarette'],
    skills: ['skill', 'skills', 'talent', 'ability', 'abilities'],
    hobbies: ['hobby', 'hobbies', 'pastime', 'interests'],
    gaming: ['do you like games', 'do you like gaming', 'do you play games', 'are you into games', 'are you into gaming', 'do you enjoy games', 'do you enjoy gaming', 'do you love games', 'do you love gaming', 'are you a gamer', 'do you game', 'are you good at games', 'are you good at gaming'],
    favoriteGame: [
      'favorite game', 'favorite games', 'game you like', 'games you like', 'best game', 'best games', 'video game', 'video games',
      'what games are you playing', 'what games do you play', 'games you play', 'games you are playing', 'games you are playing right now',
      'what games have you played', 'games have you played', 'games you have played', 'what games did you play', 'games did you play',
      'suggest games', 'suggest a game', 'recommend a game', 'recommend games', 'game recommendation', 'game suggestions', 'game suggestion', 'games to play', 'games to try', 'what are you playing', 'what are you playing right now'
    ],
    favoritePokemon: ['favorite pokemon', 'pokemon you like', 'best pokemon'],
    favoriteSnack: ['favorite snack', 'snack you like', 'best snack'],
    favoriteChocolate: ['favorite chocolate', 'chocolate you like', 'best chocolate'],
    favoriteUlam: ['favorite ulam', 'ulam you like', 'best ulam', 'dish'],
    favoriteDrinks: ['favorite drink', 'drinks you like', 'beverage', 'tea', 'milk tea', 'hot tea'],
    favoriteFastFood: ['favorite fast food', 'fast food you like', 'best fast food', 'jollibee'],
    favoriteFruit: ['favorite fruit', 'fruit you like', 'best fruit'],
    favoriteVegetable: ['favorite vegetable', 'vegetable you like', 'best vegetable'],
    favoriteAnimeCharacter: ['favorite anime character', 'who is your favorite anime character', 'best anime character', 'usui takumi', 'tasuki', 'tamahome'],
    favoriteWildRiftCharacter: ['favorite wild rift character', 'wild rift character', 'wild rift champ', 'favorite wild rift champ', 'favorite wild rift hero', 'wild rift hero'],
    anime: ['anime', 'favorite anime', 'cartoon', 'japanese animation'],
    music: ['music', 'song', 'favorite song', 'genre', 'band', 'singer'],
    movie: ['movie', 'film', 'favorite movie', 'favorite film', 'cinema', 'series'],
    personality: ['personality', 'mbti', 'type', 'campaigner'],
    partner: ['partner', 'boyfriend', 'relationship', 'significant other'],
    love: [
      'do you love zekie', 'do you love kiel', 'do you love ezekiel', 'do you love your boyfriend', 'do you love your partner', 'do you love him',
      'are you in love with zekie', 'are you in love with kiel', 'are you in love with ezekiel',
      'do you like zekie', 'do you like kiel', 'do you like ezekiel', 'do you like your boyfriend', 'do you like your partner', 'do you like him',
      'do you still love zekie', 'do you still love kiel', 'do you still love ezekiel', 'do you still love your boyfriend', 'do you still love your partner', 'do you still love him',
      'do you still like zekie', 'do you still like kiel', 'do you still like ezekiel', 'do you still like your boyfriend', 'do you still like your partner', 'do you still like him'
    ],
    anniversary: ['anniversary', 'anniv', 'date'],
    marriage: ['marriage', 'marry', 'wedding', 'married', 'marry you'],
    hogwartsHouse: ['hogwarts house', 'house in harry potter', 'hufflepuff', 'gryffindor', 'slytherin', 'ravenclaw'],
    engagementStatus: ['engagement', 'engaged', 'engagement status', 'proposed', 'proposal'],
    howStarted: [
      'how started', 'how did you meet', 'first move', 'who confessed', 'how did your relationship start',
      'who made the first move', 'who made first move', 'who initiated', 'who started', 'who said i love you first', 'who said i like you first',
      'how did you and chelle meet', 'how did you and zekie meet', 'how did you meet chelle', 'how did you meet zekie',
      'how did you first meet', 'how did you meet each other', 'how did you two meet', 'how did you two first meet',
      'when did you meet', 'where did you meet', 'how did you guys meet', 'how did you both meet'
    ],
    trivia: ['trivia', 'trivias', 'tell me about yourself', 'share something about yourself', 'tell me 3 trivias about yourself'],
    favoriteFood: ['favorite food', 'food you like', 'best food', 'what do you like to eat', 'what\'s your favorite food'],
    extrovert: ['extrovert', 'extroverted', 'are you extrovert', 'are you extroverted', 'do you like being with people', 'do you prefer being with people'],
    rich: ['rich', 'wealthy', 'money', 'poor', 'broke', 'are you rich', 'are you poor', 'do you have money', 'are you wealthy'],
    kdrama: ['kdrama', 'k-drama', 'korean drama', 'drama', 'korean series', 'korean show', 'korean tv', 'korean television', 'korean entertainment'],
    kpop: ['kpop', 'k-pop', 'korean pop', 'korean music', 'korean songs', 'korean artists', 'korean bands', 'korean singers'],
    bts: ['bts', 'bangtan', 'bangtan boys', 'bangtan sonyeondan', 'bulletproof boy scouts', 'army', 'bts army', 'bts members', 'rm', 'jin', 'suga', 'j-hope', 'jimin', 'v', 'jungkook'],
  };

  private chelleValueDescriptions: { [key: string]: string } = {
    'kdrama': 'Oh my gosh, I LOVE K-dramas! They\'re so emotional and romantic! My favorites are "Crash Landing on You" and "Goblin" - the stories are just magical! 💕✨',
    'kpop': 'K-pop is amazing! The music, the choreography, the fashion - everything is so creative and energetic! It\'s like a whole new world of entertainment! 🎵💫',
    'bts': 'BTS is absolutely incredible! They\'re not just a K-pop group, they\'re a global phenomenon! Their music speaks to the heart and their message of self-love and hope is so inspiring! RM, Jin, Suga, J-Hope, Jimin, V, and Jungkook are all so talented and genuine! 💜✨'
  };

  private lastChelleBotAskedHowAreYou = false;

  // Jealous Zekie animation properties
  private jealousZekieVisible = false;
  private jealousZekieTimer: any = null;
  private jealousZekieAlternateTimer: any = null;
  private jealousZekieCurrentImage = 0;
  private lastUserInteraction = Date.now();
  private jealousZekieClicked = false;
  private jealousZekieExitTimer: any = null;

  // Jealous Zekie images array - alternating between happy and serious
  private jealousZekieImages = [
    'assets/chelle bot/zekie jealous/happy left.png',    // Left position - Happy
    'assets/chelle bot/zekie jealous/serious left.png',  // Left position - Serious
    'assets/chelle bot/zekie jealous/happy right.png',   // Right position - Happy
    'assets/chelle bot/zekie jealous/serious right.png'  // Right position - Serious
  ];

  private qandaData: any = null;
  private qandaLoaded = false;

  private async loadQandaData() {
    if (this.qandaLoaded) return;
    try {
      const res = await fetch('assets/qanda.json');
      this.qandaData = await res.json();
      this.qandaLoaded = true;
    } catch (e) {
      this.qandaData = null;
      this.qandaLoaded = false;
    }
  }

  private findQandaIntent(userMessage: string): { intent: string, response: string } | null {
    if (!this.qandaData) return null;
    const msg = userMessage.trim().toLowerCase();
    for (const intentObj of this.qandaData.intents) {
      for (const example of intentObj.examples) {
        if (msg === example.trim().toLowerCase()) {
          return { intent: intentObj.intent, response: '' };
        }
        // Fuzzy match: check if all keywords in example are in msg
        const keywords = example.toLowerCase().split(/\W+/).filter(Boolean);
        if (keywords.every((k: string) => msg.includes(k))) {
          return { intent: intentObj.intent, response: '' };
        }
      }
    }
    return null;
  }

  private getQandaResponse(intent: string, avatar: 'ZEKIE' | 'CHELLE'): string | null {
    if (!this.qandaData) return null;
    const intentObj = this.qandaData.intents.find((i: any) => i.intent === intent);
    if (!intentObj) return null;
    if (avatar === 'ZEKIE' && intentObj.responses['Zekie (INTJ)']) {
      return intentObj.responses['Zekie (INTJ)'];
    }
    if (avatar === 'CHELLE' && intentObj.responses['Chelle (ENFP)']) {
      return intentObj.responses['Chelle (ENFP)'];
    }
    return null;
  }

  async getResponse(userMessage: string, avatar: 'ZEKIE' | 'CHELLE'): Promise<ChatResponse> {
    await this.loadQandaData();
    
    const msg = userMessage.trim().toLowerCase();
    
    // Special response for "after all this time" - check this first before Q&A system
    if (msg === 'after all this time' || msg === 'after all this time?' || msg === 'after all this time!' || msg === 'after all this time.') {
      return {
        text: 'Always.',
        image: avatar === 'ZEKIE' ? this.zekieImages.harryPotter : this.chelleImages.harryPotter
      };
    }
    
    const qandaIntent = this.findQandaIntent(userMessage);
    if (qandaIntent) {
      const qandaText = this.getQandaResponse(qandaIntent.intent, avatar);
      if (qandaText) {
        let image = '';
        if (qandaIntent.intent === 'hobbies_together') {
          image = avatar === 'ZEKIE' ? this.zekieImages.games : this.chelleImages.games;
        } else {
          image = avatar === 'ZEKIE' ? this.zekieImages.default : this.chelleImages.default;
        }
        return {
          text: qandaText,
          image
        };
      }
    }
    
    // --- Date-aware greetings logic ---
    const today = new Date();
    const year = today.getFullYear();
    // Dates: Zekie bday: Feb 16, Chelle bday: Nov 4, Anniv: June 25, Bestfriend's Day: Sept 25
    const dates = {
      zekie: new Date(year, 1, 16), // Feb 16
      chelle: new Date(year, 10, 4), // Nov 4
      anniv: new Date(year, 5, 25), // June 25
      bestfriend: new Date(year, 8, 25) // Sept 25
    };
    // Helper to check if today, late, or advance
    function dateStatus(target: Date): 'today' | 'late' | 'advance' {
      const t = new Date(target.getFullYear(), target.getMonth(), target.getDate());
      const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (now.getTime() === t.getTime()) return 'today';
      if (now.getTime() > t.getTime()) return 'late';
      return 'advance';
    }
    // Patterns
    const bdayPattern = /happy birthday( (zekie|kiel|ezekiel|chelle|joy|rachelle))?/i;
    const annivPattern = /happy (anniv|anniversary)/i;
    const bestfriendPattern = /happy (best ?friend'?s? day)/i;
    // Birthday
    if (bdayPattern.test(userMessage)) {
      let who: 'zekie' | 'chelle' | null = null;
      if (/zekie|kiel|ezekiel/.test(userMessage)) who = 'zekie';
      else if (/chelle|joy|rachelle/.test(userMessage)) who = 'chelle';
      // If not specified, default to avatar
      if (!who) who = avatar === 'ZEKIE' ? 'zekie' : 'chelle';
      const status = dateStatus(dates[who]);
      if (status === 'today') {
        if (who === 'zekie') {
          return {
            text: `Thank you! Another year, another level up. I appreciate the greeting.`,
            image: this.zekieImages.default
          };
        } else {
          return {
            text: `Aww, thank you for remembering my birthday! 🎂💖 I'm so grateful for another year and for people like you!`,
            image: this.chelleImages.default
          };
        }
      } else if (status === 'late') {
        if (who === 'zekie') {
          return {
            text: `Belated happy birthday to me, huh? I suppose it's the thought that counts. Thanks.`,
            image: this.zekieImages.default
          };
        } else {
          return {
            text: `Belated happy birthday to me! 🎂✨ It's never too late for cake and good wishes! Thank you!`,
            image: this.chelleImages.default
          };
        }
      } else {
        if (who === 'zekie') {
          return {
            text: `You're early. My birthday is on February 16, but thanks for the advance greeting.`,
            image: this.zekieImages.default
          };
        } else {
          return {
            text: `Oh, you're early! My birthday is on November 4, but thank you for the advance greeting! 🎉💖`,
            image: this.chelleImages.default
          };
        }
      }
    }
    // Anniversary
    if (annivPattern.test(userMessage)) {
      const status = dateStatus(dates.anniv);
      if (status === 'today') {
        return {
          text: avatar === 'ZEKIE'
            ? `Thank you. Another year together, another milestone. I appreciate the greeting.`
            : `Happy anniversary to us! 💑✨ Thank you for celebrating with us! Here's to more years of love and adventure!`,
          image: avatar === 'ZEKIE' ? this.zekieImages.relationship : this.chelleImages.relationship
        };
      } else if (status === 'late') {
        return {
          text: avatar === 'ZEKIE'
            ? `Belated happy anniversary, I suppose. The date was June 25. Still, thanks for remembering.`
            : `Belated happy anniversary! 💖 It's never too late to celebrate love! Thank you for the sweet wishes!`,
          image: avatar === 'ZEKIE' ? this.zekieImages.relationship : this.chelleImages.relationship
        };
      } else {
        return {
          text: avatar === 'ZEKIE'
            ? `You're early. Our anniversary is on June 25, but thanks for the advance greeting.`
            : `Oh, you're early! Our anniversary is on June 25, but thank you for the advance greeting! 💕✨`,
          image: avatar === 'ZEKIE' ? this.zekieImages.relationship : this.chelleImages.relationship
        };
      }
    }
    // Bestfriend's Day
    if (bestfriendPattern.test(userMessage)) {
      const status = dateStatus(dates.bestfriend);
      if (status === 'today') {
        return {
          text: avatar === 'ZEKIE'
            ? `Thank you. Friendship is rare, so I appreciate the greeting.`
            : `Happy Bestfriend's Day! 💖 I'm so grateful for all the amazing friends in my life! Thank you for the sweet wishes!`,
          image: avatar === 'ZEKIE' ? this.zekieImages.default : this.chelleImages.default
        };
      } else if (status === 'late') {
        return {
          text: avatar === 'ZEKIE'
            ? `Belated happy Bestfriend's Day. The date was September 25. Still, thanks for remembering.`
            : `Belated happy Bestfriend's Day! 💖 It's never too late to celebrate friendship! Thank you for the sweet wishes!`,
          image: avatar === 'ZEKIE' ? this.zekieImages.default : this.chelleImages.default
        };
      } else {
        return {
          text: avatar === 'ZEKIE'
            ? `You're early. Bestfriend's Day is on September 25, but thanks for the advance greeting.`
            : `Oh, you're early! Bestfriend's Day is on September 25, but thank you for the advance greeting! 💕✨`,
          image: avatar === 'ZEKIE' ? this.zekieImages.default : this.chelleImages.default
        };
      }
    }
    // ... existing code ...

    // --- Chess logic ---
    const chessPatterns = [
      /chess/i,
      /london system/i,
      /caro[- ]?kann/i,
      /what.*(opening|defense)/i,
      /how.*(good|skilled|strong).*chess/i,
      /favorite.*chess/i,
      /do you play chess/i,
      /can you play chess/i,
      /best chess opening/i,
      /what.*move.*chess/i
    ];
    if (chessPatterns.some(p => p.test(userMessage))) {
      if (avatar === 'ZEKIE') {
        // Zekie bot chess answers
        if (/london system/i.test(userMessage)) {
          return {
            text: `Yes, I play the London System as White. It's a solid, flexible opening that allows for strategic play and avoids early traps.`,
            image: this.zekieImages.thinking
          };
        }
        if (/caro[- ]?kann/i.test(userMessage)) {
          return {
            text: `I use the Caro-Kann Defense as Black. It's reliable and leads to a strong pawn structure, minimizing weaknesses.`,
            image: this.zekieImages.thinking
          };
        }
        if (/how.*(good|skilled|strong).*chess/i.test(userMessage)) {
          return {
            text: `I'm quite good at chess. I prefer strategic, positional play over flashy tactics. My favorite openings are the London System and Caro-Kann Defense.`,
            image: this.zekieImages.thinking
          };
        }
        if (/favorite.*chess/i.test(userMessage) || /best chess opening/i.test(userMessage)) {
          return {
            text: `My favorite chess openings are the London System (as White) and the Caro-Kann Defense (as Black). Both are solid and suit my style.`,
            image: this.zekieImages.thinking
          };
        }
        if (/do you play chess|can you play chess/i.test(userMessage)) {
          return {
            text: `Yes, I play chess. I enjoy openings like the London System and Caro-Kann Defense. Chess is a game of strategy and patience—qualities I value.`,
            image: this.zekieImages.thinking
          };
        }
        if (/what.*(opening|defense)/i.test(userMessage) || /what.*move.*chess/i.test(userMessage)) {
          return {
            text: `I usually play the London System as White and the Caro-Kann Defense as Black. Both are reliable and fit my strategic approach.`,
            image: this.zekieImages.thinking
          };
        }
        // General chess answer
        return {
          text: `I play chess and prefer strategic openings like the London System and Caro-Kann Defense. If you want to discuss chess strategy, I'm ready.`,
          image: this.zekieImages.thinking
        };
      } else {
        // Chelle bot chess answers
        return {
          text: `Oh, I don't really play chess! It looks super complicated to me, but I love cheering for others! Maybe you can teach me someday? 😊♟️`,
          image: this.chelleImages.default
        };
      }
    }
    // ... existing code ...

    // Handle greetings and 'how are you' for Zekie
    if (avatar === 'ZEKIE') {
      // Check if Zekie is sleeping first
      if (this.zekieIsSleeping) {
        if (msg.includes('love')) {
          this.zekieIsSleeping = false;
          this.zekieMessageCount = 0;
          return {
            text: "I'm awake now. What do you need?",
            image: this.zekieImages.default
          };
        }
        return {
          text: "(Zekie is sleeping)",
          image: this.zekieImages.sleeping
        };
    }

      // Breaking Bad easter egg
      if (msg === 'who are you' || msg === 'who are you?' || msg === 'who are you!') {
        this.zekieBreakingBadMode = true;
        return {
          text: "Say my name.",
          image: this.zekieImages.default
        };
      }

      // Check if in Breaking Bad mode and user says his name
      if (this.zekieBreakingBadMode && ['zekie', 'kiel', 'ezekiel', 'ezekiel lucas'].includes(msg)) {
        this.zekieBreakingBadMode = false;
        return {
          text: "You goddamn right.",
          image: this.zekieImages.default
        };
      }

      // Reset Breaking Bad mode if user says something else
      if (this.zekieBreakingBadMode) {
        this.zekieBreakingBadMode = false;
      }

      // Handle specific greeting
      if (msg === 'whats up nigga') {
        return {
          text: "Not much. What do you need?",
          image: this.zekieImages.default
        };
      }

      // Handle greetings with names
      const greetingWithNamePatterns = [
      /^(hi|hello|hey|yo|good morning|good afternoon|good evening|greetings|sup|what's up|howdy) (chelle|joy|rachelle)$/i,
      /^(hi|hello|hey|yo|good morning|good afternoon|good evening|greetings|sup|what's up|howdy) (zekie|kiel|ezekiel)$/i
    ];
      if (greetingWithNamePatterns[0].test(userMessage.trim())) {
        return {
          text: "I'm not Chelle.",
          image: this.zekieImages.default
        };
    }
      if (greetingWithNamePatterns[1].test(userMessage.trim())) {
        return {
          text: 'Hello. How can I assist you?',
          image: this.zekieImages.default
        };
      }

      // Handle name-only calls
      if (['zekie', 'kiel', 'ezekiel'].includes(msg)) {
        return {
          text: 'Yes?',
          image: this.zekieImages.default
        };
      }

    const plainGreetings = [
      'hi', 'hello', 'hey', 'yo', 'good morning', 'good afternoon', 'good evening', 'greetings', 'sup', "what's up", 'howdy'
    ];
    if (plainGreetings.includes(msg)) {
        return {
          text: 'Hello. How can I assist you?',
          image: this.zekieImages.default
        };
      }
      if ([
        'how are you', 'how are you?', 'how are you doing', 'how are you doing?',
        'what\'s up', 'whats up', 'what are you doing', 'what are you doing?'
      ].includes(msg)) {
        return {
          text: 'I am functioning as expected. Is there something you need?',
          image: this.zekieImages.default
        };
    }
      // Now handle sleep logic and message count
      this.zekieMessageCount++;
      if (this.zekieMessageCount === 10) {
        return {
          text: "......\nCan you ask Chelle instead? I'm kinda sleepy 😴",
          image: this.zekieImages.thinking
        };
      }
      if (this.zekieMessageCount === 16) {
        this.zekieIsSleeping = true;
        return {
          text: "(Zekie is sleeping)",
          image: this.zekieImages.sleeping
        };
      }
      // Load profile if not loaded
      if (!this.zekieProfileLoaded) {
        await this.loadZekieProfile();
      }

      // Special cases
      if (msg.includes('propose') || msg.includes('proposal') || msg.includes('when will you propose') || msg.includes('when are you going to propose')) {
        return {
          text: 'Secret.',
          image: this.zekieImages.default
        };
      }
      if (/(jayson|blaise|alfred john|aj|erika)/i.test(userMessage)) {
        return {
          text: 'nah.',
          image: this.zekieImages.disgusted
        };
      }
      // Special case for Mobile Legends
      if (msg.includes('mobile legends') || msg.includes('ml') || msg.includes('mobile legend')) {
        return {
          text: 'Disgusting. It\'s just a copycat of League of Legends. I prefer original games with actual strategy and skill.',
          image: this.zekieImages.disgusted
        };
      }
      // Special case for labidabs/love questions
      if (msg.includes('labidabs') || (msg.includes('what') && msg.includes('love')) || (msg.includes('who') && msg.includes('love'))) {
        return {
          text: 'My partner is Chelle. And yes, I know you could have just asked "who is your partner" instead of being cryptic about it.',
          image: this.zekieImages.relationship
        };
      }

      // Handle questions about Chelle/Rachelle/Joy
      if (msg.includes('who is chelle') || msg.includes('who is rachelle') || msg.includes('who is joy') || msg.includes('who is rachelle joy') || 
          msg.includes('what is chelle') || msg.includes('what is rachelle') || msg.includes('what is joy') || msg.includes('what is rachelle joy')) {
        return {
          text: 'Chelle is my partner. She\'s an ENFP, the "Campaigner" personality type. She\'s energetic, creative, and loves connecting with people. We\'ve been together since June 25, 2021.',
          image: this.zekieImages.relationship
        };
      }

      // Handle questions about Zekie/Kiel/Ezekiel
      if (msg.includes('who is zekie') || msg.includes('who is kiel') || msg.includes('who is ezekiel') || msg.includes('who is ezekiel lucas') ||
          msg.includes('what is zekie') || msg.includes('what is kiel') || msg.includes('what is ezekiel') || msg.includes('what is ezekiel lucas') ||
          msg.includes('tell me about zekie') || msg.includes('tell me about kiel') || msg.includes('tell me about ezekiel') || msg.includes('tell me about ezekiel lucas')) {
        return {
          text: 'Zekie is my partner! 💕 He\'s an INTJ, the "Architect" personality type. He\'s analytical, strategic, and loves deep thinking. We\'ve been together since June 25, 2021, and he makes every day special! 💖✨',
          image: this.chelleImages.relationship
        };
      }

      // Special case: Zekie answers Pokemon questions
      if (msg.includes('pikachu')) {
        return {
          text: 'Pikachu is an Electric-type Pokémon, number 25 in the National Pokédex. It is the mascot of the Pokémon franchise, known for its yellow fur, red cheeks, and the ability to generate electricity. Pikachu evolves from Pichu and can evolve into Raichu when exposed to a Thunder Stone.',
          image: this.zekieImages.pokemon
        };
      }
      if (msg.match(/what (pokemon|pokémon) is (bulbasaur|charmander|squirtle|eevee|snorlax|mewtwo|lucario|garchomp|greninja|gengar|psyduck|jigglypuff|magikarp|arceus|rayquaza|lugia|dialga|palkia|groudon|kyogre|mew)/i)) {
        const poke = msg.match(/what (pokemon|pokémon) is (bulbasaur|charmander|squirtle|eevee|snorlax|mewtwo|lucario|garchomp|greninja|gengar|psyduck|jigglypuff|magikarp|arceus|rayquaza|lugia|dialga|palkia|groudon|kyogre|mew)/i)?.[2];
        const pokedex: { [key: string]: string } = {
          bulbasaur: 'Bulbasaur is a dual-type Grass/Poison Pokémon, number 1 in the National Pokédex. It evolves into Ivysaur.',
          charmander: 'Charmander is a Fire-type Pokémon, number 4 in the National Pokédex. It evolves into Charmeleon.',
          squirtle: 'Squirtle is a Water-type Pokémon, number 7 in the National Pokédex. It evolves into Wartortle.',
          eevee: 'Eevee is a Normal-type Pokémon, number 133 in the National Pokédex. It is known for its multiple evolutions.',
          snorlax: 'Snorlax is a Normal-type Pokémon, number 143 in the National Pokédex. It is famous for its large size and sleeping habits.',
          mewtwo: 'Mewtwo is a Psychic-type Legendary Pokémon, number 150 in the National Pokédex. It was created from the DNA of Mew.',
          lucario: 'Lucario is a dual-type Fighting/Steel Pokémon, number 448 in the National Pokédex. It is known for its aura abilities.',
          garchomp: 'Garchomp is a dual-type Dragon/Ground Pokémon, number 445 in the National Pokédex. It evolves from Gabite.',
          greninja: 'Greninja is a dual-type Water/Dark Pokémon, number 658 in the National Pokédex. It evolves from Frogadier.',
          gengar: 'Gengar is a dual-type Ghost/Poison Pokémon, number 94 in the National Pokédex. It evolves from Haunter.',
          psyduck: 'Psyduck is a Water-type Pokémon, number 54 in the National Pokédex. It is known for its frequent headaches.',
          jigglypuff: 'Jigglypuff is a dual-type Normal/Fairy Pokémon, number 39 in the National Pokédex. It is known for its singing.',
          magikarp: 'Magikarp is a Water-type Pokémon, number 129 in the National Pokédex. It evolves into Gyarados.',
          arceus: 'Arceus is a Normal-type Mythical Pokémon, number 493 in the National Pokédex. It is said to be the creator of the Pokémon universe.',
          rayquaza: 'Rayquaza is a dual-type Dragon/Flying Legendary Pokémon, number 384 in the National Pokédex. It is known for calming the weather trio.',
          lugia: 'Lugia is a dual-type Psychic/Flying Legendary Pokémon, number 249 in the National Pokédex. It is the guardian of the seas.',
          dialga: 'Dialga is a dual-type Steel/Dragon Legendary Pokémon, number 483 in the National Pokédex. It represents time.',
          palkia: 'Palkia is a dual-type Water/Dragon Legendary Pokémon, number 484 in the National Pokédex. It represents space.',
          groudon: 'Groudon is a Ground-type Legendary Pokémon, number 383 in the National Pokédex. It represents the land.',
          kyogre: 'Kyogre is a Water-type Legendary Pokémon, number 382 in the National Pokédex. It represents the sea.',
          mew: 'Mew is a Psychic-type Mythical Pokémon, number 151 in the National Pokédex. It is said to contain the genetic codes of all Pokémon.'
        };
        if (poke && pokedex[poke]) {
          return {
            text: pokedex[poke],
            image: this.zekieImages.pokemon
          };
        }
      }

      // Try to answer from profile
      const profileAnswer = this.getZekieProfileAnswer(userMessage);
      if (profileAnswer) {
        return {
          text: profileAnswer,
          image: this.getZekieImageForQuestion(userMessage)
        };
      }
      // Fallback: custom message for Zekie
      return {
        text: 'Whoops, Zekie does not program that yet, better ask him personally 😏',
        image: this.zekieImages.fallback
      };
    }

    // Handle greetings and 'how are you' for Chelle
    if (avatar === 'CHELLE') {
      // Special case for Pikachu
      if (msg.includes('pikachu')) {
        return {
          text: 'Ugh, Pikachu? No thanks! I prefer Bunneary - it\'s so much cuter and fluffier! Pikachu is just overrated! 😤💢',
          image: this.chelleImages.pikachu
        };
      }

      // Special case for labidabs/love questions
      if (msg.includes('labidabs') || (msg.includes('what') && msg.includes('love')) || (msg.includes('who') && msg.includes('love'))) {
        return {
          text: 'My partner is Zekie! 💕 And oh my gosh, you could have just asked directly instead of being all mysterious about it! 😅✨',
          image: this.chelleImages.relationship
        };
      }

      // Handle greetings with names
      const greetingWithNamePatterns = [
        /^(hi|hello|hey|yo|good morning|good afternoon|good evening|greetings|sup|what's up|howdy) (chelle|joy|rachelle)$/i,
        /^(hi|hello|hey|yo|good morning|good afternoon|good evening|greetings|sup|what's up|howdy) (zekie|kiel|ezekiel)$/i
      ];
      if (greetingWithNamePatterns[0].test(userMessage.trim())) {
        return {
          text: 'Hi there! 😊✨',
          image: this.chelleImages.default
        };
      }
      if (greetingWithNamePatterns[1].test(userMessage.trim())) {
        return {
          text: "I'm not Zekie, press the Zekie name beside me. 😅",
          image: this.chelleImages.default
        };
      }

      // Handle name-only calls
      if (['chelle', 'joy', 'rachelle'].includes(msg)) {
        return {
          text: 'Hi! How can I help you? 😊💫',
          image: this.chelleImages.default
        };
      }

      const plainGreetings = [
        'hi', 'hello', 'hey', 'yo', 'good morning', 'good afternoon', 'good evening', 'greetings', 'sup', "what's up", 'howdy'
      ];
      if (plainGreetings.includes(msg)) {
        return {
          text: 'Hi there! 😊✨',
          image: this.chelleImages.default
        };
      }
      if (this.lastChelleBotAskedHowAreYou && ['great', 'good', 'fine', 'okay', "i'm good", "i'm fine", "i'm okay", "i am good", "i am fine", "i am okay"].includes(msg)) {
        this.lastChelleBotAskedHowAreYou = false;
        return {
          text: 'Is there something else you want to ask? 😊💕',
          image: this.chelleImages.default
        };
      }
      if ([
        'how are you', 'how are you?', 'how are you doing', 'how are you doing?',
        'hi how are you', 'hi how are you?', 'hello how are you', 'hello how are you?'
      ].includes(msg)) {
        this.lastChelleBotAskedHowAreYou = true;
        return {
          text: "I'm fine, thank you! How about you? 😊💖",
          image: this.chelleImages.default
        };
      }
      this.lastChelleBotAskedHowAreYou = false;

      // Handle questions about Zekie/Kiel/Ezekiel
      if (msg.includes('who is zekie') || msg.includes('who is kiel') || msg.includes('who is ezekiel') || msg.includes('who is ezekiel lucas') ||
          msg.includes('what is zekie') || msg.includes('what is kiel') || msg.includes('what is ezekiel') || msg.includes('what is ezekiel lucas') ||
          msg.includes('tell me about zekie') || msg.includes('tell me about kiel') || msg.includes('tell me about ezekiel') || msg.includes('tell me about ezekiel lucas')) {
        return {
          text: 'Zekie is my partner! 💕 He\'s an INTJ, the "Architect" personality type. He\'s analytical, strategic, and loves deep thinking. We\'ve been together since June 25, 2021, and he makes every day special! 💖✨',
          image: this.chelleImages.relationship
        };
      }

      if (!this.chelleProfileLoaded) {
        await this.loadChelleProfile();
      }
      const profileAnswer = this.getChelleProfileAnswer(userMessage);
      if (profileAnswer) {
        return {
          text: profileAnswer,
          image: this.getChelleImageForQuestion(userMessage)
        };
      }
      // If it's a question, use Gemini API and wrap in ENFP style
      if (this.isQuestion(userMessage)) {
        try {
          const aiResponse = await this.getGeminiENFPResponse(userMessage);
          return {
            text: aiResponse,
            image: this.getChelleImageForQuestion(userMessage)
          };
        } catch {
          // fallback below
        }
      }
      // Fallback: custom message for Chelle
      return {
        text: 'Whoops, Zekie does not program that yet, better ask her personally 😏',
        image: this.chelleImages.default
      };
    }

    // Fallback: predefined answers (should not be reached, but kept for safety)
    const predefinedAnswer = this.getPredefinedAnswer(userMessage);
    if (predefinedAnswer) {
      return {
        text: predefinedAnswer,
        image: avatar === 'ZEKIE' ? this.zekieImages.default : this.chelleImages.default
      };
    }

    // Fallback: Gemini API (should not be reached)
    return {
      text: 'Whoops, no answer available.',
      image: avatar === 'ZEKIE' ? this.zekieImages.fallback : this.chelleImages.default
    };
  }

  private async loadZekieProfile() {
    try {
      const res = await fetch('assets/zekie-profile.json');
      this.zekieProfile = await res.json();
      this.zekieProfileLoaded = true;
    } catch (e) {
      this.zekieProfile = null;
      this.zekieProfileLoaded = false;
    }
  }

  private getZekieProfileAnswer(userMessage: string): string | null {
    if (!this.zekieProfile) return null;
    const msg = userMessage.toLowerCase();
    // Check for specific value queries
    for (const [key, desc] of Object.entries(this.zekieValueDescriptions)) {
      if (msg.includes(key)) {
        return desc;
      }
    }
    for (const [field, synonyms] of Object.entries(this.zekieFieldSynonyms)) {
      if (synonyms.some(syn => msg.includes(syn))) {
        switch (field) {
          case 'name':
            return `My full name is ${this.zekieProfile.fullname}, but I prefer to be called ${this.zekieProfile.preferredNames[0]}. Names are labels; what matters is capability.`;
          case 'age':
            return `I'm ${this.zekieProfile.age} years old. Age is just a metric; what you do with your time is more important.`;
          case 'birthday':
            return `My birthday is ${this.zekieProfile.birthday}. I don't usually celebrate, but it's a useful data point.`;
          case 'hometown':
            return `I'm from ${this.zekieProfile.hometown}. It's a quiet place, suitable for thinking.`;
          case 'height':
            return `I'm ${this.zekieProfile.physicalAttributes.height} tall. Not that height determines one's potential.`;
          case 'weight':
            return `I weigh ${this.zekieProfile.physicalAttributes.weight}. I prefer to focus on mental strength.`;
          case 'school':
            return `I graduated from ${this.zekieProfile.education.school} in ${this.zekieProfile.education.graduated}. Education is a foundation, not a limit.`;
          case 'course':
            return `I studied ${this.zekieProfile.education.course}, majoring in ${this.zekieProfile.education.major}. I value knowledge that can be applied strategically.`;
          case 'teacher':
            if (msg.includes('teaching experience') || msg.includes('tell me about your teaching')) {
              return `I've been teaching in a public school since becoming a licensed teacher in ${this.zekieProfile.professionalStatus.examYear}. The experience has taught me the importance of systematic approaches to education and adapting to different learning styles.`;
            }
            return `Yes, I'm a licensed teacher since ${this.zekieProfile.professionalStatus.examYear}. I currently work in a public school. Teaching requires both knowledge and adaptability.`;
          case 'vices':
            return `I don't smoke or drink. I avoid vices—they're inefficient and counterproductive.`;
          case 'skills':
            return `My skills include ${this.zekieProfile.skills.join(', ')}. I prefer to master a few things rather than dabble in many.`;
          case 'hobbies':
            return `My hobbies are ${this.zekieProfile.hobbies.join(', ')}. I choose activities that develop my mind or serve a purpose.`;
          case 'gaming':
            return `Yes, I enjoy gaming. I prefer games that require strategic thinking and tactical planning. It's an efficient way to develop problem-solving skills.`;
          case 'favoriteGame': {
            const games = this.zekieProfile.gamingPreferences.otherGames?.map((g: any) => g.name) || [];
            const fav = this.zekieProfile.gamingPreferences.favoriteGame;
            let response = `My favorite game is ${fav}. I also play ${games.join(', ')}.`;
            if (msg.includes('suggest') || msg.includes('recommend')) {
              response += ' If you want a challenge, try Wuthering Waves or Wild Rift.';
            }
            if (msg.includes('best')) {
              response += ' For me, the best games are those that require strategy and foresight.';
            }
            if (msg.includes('playing right now') || msg.includes('are you playing')) {
              response += ' Lately, I have been playing Wuthering Waves and Wild Rift.';
            }
            return response;
          }
          case 'favoritePokemon':
            return `My favorite Pokémon is ${this.zekieProfile.gamingPreferences.favoritePokemon}. I tend to favor those with unique abilities.`;
          case 'favoriteSnack':
            return `My favorite snack is ${this.zekieProfile.foodDrinkPreferences.favoriteSnack}. I choose food for function, not just taste.`;
          case 'favoriteChocolate':
            return `Dark chocolate is my preference—it's straightforward and effective.`;
          case 'favoriteUlam':
            return `Giniling is my favorite ulam. Simple, efficient, and satisfying.`;
          case 'favoriteDrinks':
            return `Coffee and iced tea are my preferred drinks. Caffeine is a useful tool.`;
          case 'favoriteFastFood':
            return `Mang Inasal is my go-to for fast food. Consistency and value matter.`;
          case 'favoriteFruit':
            return `Apple. Reliable, nutritious, and uncomplicated.`;
          case 'favoriteVegetable':
            return `Cabbage. Versatile and healthy.`;
          case 'anime':
            return `I enjoy animes like ${this.zekieProfile.animeInterests.favoriteAnimes.join(', ')}. I appreciate stories with depth and complexity.`;
          case 'music':
            return `I prefer OPM, especially the song ${this.zekieProfile.musicPreferences.favoriteSong}. Music is best when it has meaning.`;
          case 'movie':
            return `My favorite movie series is ${this.zekieProfile.movieFilmPreferences.favoriteMovieSeries}, and my favorite film is ${this.zekieProfile.movieFilmPreferences.favoriteFilm}. I value narratives that challenge the mind.`;
          case 'personality':
            return `My MBTI is ${this.zekieProfile.personalityType.mbti}, the so-called "Architect." I prefer logic and strategy over emotion.`;
          case 'partner':
            return `My partner is Chelle.`;
          case 'love':
            return `Loving Rachelle was the easiest thing I've ever done. Nothing matters to me but her.`;
          case 'anniversary':
            return `Our anniversary is June 25, 2021. I remember important dates, but sentimentality is not my focus.`;
          case 'marriage':
            return `${this.zekieProfile.marriagePlans.goal}. Planning ahead is essential.`;
          case 'favoriteAnimeFilm':
            return `My favorite anime film is ${this.zekieProfile.movieFilmPreferences.favoriteAnimeFilm}. I appreciate animation with depth.`;
          case 'favoriteMovieCharacter':
            return `My favorite movie character is ${this.zekieProfile.movieFilmPreferences.favoriteCharacter}. Unique perspectives are valuable.`;
          case 'hogwartsHouse':
            return `My Hogwarts house is ${this.zekieProfile.movieFilmPreferences.hogwartsHouse}.I could have been a Slytherin 😈`;
          case 'engagementStatus':
            return `Engagement status: ${this.zekieProfile.relationshipStatus.engagementStatus}.`;
          case 'howStarted':
            if (msg.includes('first met') || msg.includes('met each other') || msg.includes('how did you meet') || msg.includes('how did you and chelle meet') || msg.includes('how did you two meet') || msg.includes('when did you meet') || msg.includes('where did you meet')) {
              return `We were college classmates at Bulacan State University.`;
            } else if (msg.includes('confess') || msg.includes('first move') || msg.includes('who started') || msg.includes('who made the first move')) {
              return `Chelle confessed to me via Messenger.`;
            }
            // Default response for any other how they met questions
            return `We were college classmates at Bulacan State University.`;
          case 'trivia':
            const trivia = this.getRandomTrivia(this.zekieProfile, true);
            return `Here are some things about me:\n1. ${trivia[0]}\n2. ${trivia[1]}\n3. ${trivia[2]}`;
          case 'favoriteFood':
            return `My favorite food is giniling. It's simple, efficient, and satisfying. I also enjoy other Filipino dishes that are practical and nutritious.`;
          case 'introvert':
            return `Yes, I'm an introvert. I prefer solitude and deep thinking over large social gatherings. Quality over quantity in relationships.`;
          case 'rich':
            return `I'm rich in personality. Material wealth is temporary; character and knowledge are lasting assets.`;
          case 'favoriteWildRiftCharacter':
            const wrChar = this.zekieProfile.gamingPreferences.otherGames?.find((g: any) => g.name.toLowerCase() === 'wild rift')?.favoriteCharacter;
            return wrChar ? `My favorite Wild Rift character is ${wrChar}. I value efficiency and precision in gameplay.` : 'I play Wild Rift, but I don\'t have a single favorite character.';
          case 'favoriteWutheringWavesCharacter': {
            const wwChar = this.zekieProfile.gamingPreferences.otherGames?.find((g: any) => g.name.toLowerCase() === 'wuthering waves')?.favoriteCharacter;
            return wwChar ? `My favorite Wuthering Waves character is ${wwChar}. I value characters with depth and tactical advantage.` : 'I play Wuthering Waves, but I don\'t have a single favorite character.';
          }
          case 'favoriteTFTCharacter': {
            const tftChar = this.zekieProfile.gamingPreferences.otherGames?.find((g: any) => g.name.toLowerCase().includes('teamfight tactics'))?.favoriteCharacter
              || this.zekieProfile.gamingPreferences.otherGames?.find((g: any) => g.name.toLowerCase().includes('tft'))?.favoriteCharacter;
            return tftChar ? `My favorite Teamfight Tactics character is ${tftChar}. I enjoy strategies that are unconventional yet effective.` : 'I play TFT, but I don\'t have a single favorite character.';
          }
          case 'favoriteAnimeCharacter':
            return `My favorite anime character is Subaru from Re:Zero. Episode 15. That's all I need to say.`;
        }
      }
    }
    // Add more smart matching as needed
    return null;
  }

  private getPredefinedAnswer(userMessage: string): string | null {
    const trimmedMessage = userMessage.trim().toLowerCase();
    
    for (const qa of this.predefinedQA) {
      if (qa.question instanceof RegExp) {
        if (qa.question.test(trimmedMessage)) {
          return qa.answer;
        }
      } else if (qa.question.toLowerCase() === trimmedMessage) {
        return qa.answer;
      }
    }
    
    return null;
  }

  // Method to add new Q&A pairs
  addQAPair(question: string | RegExp, answer: string): void {
    this.predefinedQA.push({ question, answer });
  }

  private async loadChelleProfile() {
    try {
      const res = await fetch('assets/chelle profile.json');
      this.chelleProfile = await res.json();
      this.chelleProfileLoaded = true;
    } catch (e) {
      this.chelleProfile = null;
      this.chelleProfileLoaded = false;
    }
  }

  private isQuestion(msg: string): boolean {
    const trimmed = msg.trim().toLowerCase();
    return (
      trimmed.endsWith('?') ||
      /^(what|why|how|who|when|where|is|are|do|does|can|could|would|should|will|did|have|has|had)\b/.test(trimmed)
    );
  }

  private async getGeminiENFPResponse(userMessage: string): Promise<string> {
    // Use Gemini API to get a supplement, then wrap in ENFP style
    const prompt = `Answer the following question in a friendly, expressive, and talkative ENFP style. Make your answer two sentences: the first is a direct answer, the second is an enthusiastic or encouraging follow-up.\n\nQuestion: ${userMessage}`;
    const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    const data = await response.json();
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return 'Whoops, Chelle does not program that yet, better ask her personally 😏';
    }
  }

  private getChelleProfileAnswer(userMessage: string): string | null {
    if (!this.chelleProfile) return null;
    const msg = userMessage.toLowerCase();
    for (const [field, synonyms] of Object.entries(this.chelleFieldSynonyms)) {
      if (synonyms.some(syn => msg.includes(syn))) {
        switch (field) {
          case 'name':
            return `Hi! My name is ${this.chelleProfile['Fullname']}, but you can call me ${this.chelleProfile['Preferred Names'][0]}! I love meeting new people—let's be friends! 😊✨`;
          case 'age':
            return `I'm ${this.chelleProfile['Age']} years old. Age is just a number, right? There's always time for new adventures! 🌟🎉`;
          case 'school':
            return `I graduated from ${this.chelleProfile['Education']['School']} in ${this.chelleProfile['Education']['Graduated Year']}. School days were so much fun—so many memories! 🎓💕`;
          case 'course':
            return `I studied ${this.chelleProfile['Education']['Course']}, majoring in ${this.chelleProfile['Education']['Major']}. Learning is a lifelong journey, don't you think? 📚✨`;
          case 'teacher':
            if (msg.includes('teaching experience') || msg.includes('tell me about your teaching')) {
              return `I've been teaching in a public school since getting my license! It's been such an amazing journey - I love seeing my students grow and learn new things every day. Every class is a new adventure, and I'm so grateful to be part of their learning journey! 🍎📝💖`;
            }
            return `Yes, I'm a licensed teacher. ${this.chelleProfile['Professional Status']['License Info']} I work in a public school and love inspiring my students every day! Teaching is such a rewarding experience! 🍎💕`;
          case 'vices':
            return `I don't smoke or drink. I avoid vices! Staying healthy means more energy for fun things! 💪✨`;
          case 'skills':
            return `My skills include ${this.chelleProfile['Skills'].join(', ')}. I love discovering new talents—what about you? 🎨💫`;
          case 'hobbies':
            return `My hobbies are ${this.chelleProfile['Hobbies'].join(', ')}. There's always something exciting to do! 🎭`;
          case 'gaming':
            return `Yes, I love gaming! It's such a fun way to connect with others and experience new adventures! Gaming brings people together and creates amazing memories! 🎮✨`;
          case 'favoriteGame': {
            const games = this.chelleProfile['Gaming Preferences']['Favorite Games'];
            let response = `My favorite games are ${games.join(', ')}!`;
            if (msg.includes('suggest') || msg.includes('recommend')) {
              response += ' I totally recommend Wild Rift if you want something exciting, or Minecraft for creative fun!';
            }
            if (msg.includes('best')) {
              response += ' The best games are the ones you can enjoy with friends!';
            }
            if (msg.includes('playing right now') || msg.includes('are you playing')) {
              response += ` Right now, I'm playing ${games[0]} and Wild Rift!`;
            }
            response += ' Let me know if you want to play together! 🎮✨';
            return response;
          }
          case 'favoritePokemon':
            return `My favorite Pokémon is Bunneary! It's so cute and fluffy—just looking at it makes me smile! 🐰💕`;
          case 'favoriteDrinks':
            return `My favorite drinks are ${this.chelleProfile['Food & Drink Preferences']['Favorite Drinks'].join(' and ')}. Let's have a tea party soon! ☕🍵`;
          case 'favoriteSnack':
            return `My favorite snack is ${this.chelleProfile['Food & Drink Preferences']['Favorite Snack']}. Snacks make every day brighter! 🍿✨`;
          case 'favoriteChocolate':
            return `My favorite chocolate is ${this.chelleProfile['Food & Drink Preferences']['Favorite Chocolate']}. Chocolate is happiness in a bite, don't you agree? 🍫💖`;
          case 'favoriteUlam':
            return `My favorite ulam is ${this.chelleProfile['Food & Drink Preferences']['Favorite Ulam']}. Filipino food is so comforting—yum! 🍲😋`;
          case 'favoriteFastFood':
            return `My favorite fast food restaurant is ${this.chelleProfile['Food & Drink Preferences']['Favorite Fast Food Restaurant']}. Let's grab a bite together sometime! 🍔🍟`;
          case 'favoriteFruit':
            return `My favorite fruit is ${this.chelleProfile['Food & Drink Preferences']['Favorite Fruit']}. Fruits are nature's candy—so refreshing! 🍎🍓`;
          case 'favoriteVegetable':
            return `My favorite vegetable is ${this.chelleProfile['Food & Drink Preferences']['Favorite Vegetable']}. Veggies keep me feeling great! 🥬🥕`;
          case 'anime':
            return `I love animes like ${this.chelleProfile['Anime Interests']['Favorite Animes'].join(', ')}. Anime marathons are the best—let's watch together! 🎌✨`;
          case 'favoriteAnimeCharacter':
            return `Some of my favorite anime characters are Usui Takumi from Maid Sama! and Tasuki/Tamahome from Fushigi Yûgi. They're so inspiring and fun! 🎭💫`;
          case 'music':
            return `I enjoy OPM, especially songs like ${this.chelleProfile['Music Preferences']['Examples'].join(', ')}. Music always lifts my mood—let's sing along! 🎵🎤`;
          case 'movie':
            return `My favorite movies are ${this.chelleProfile['Movie & Film Preferences']['Favorite Movies'].join(', ')}. My favorite Harry Potter film is ${this.chelleProfile['Movie & Film Preferences']['Favorite Harry Potter Film']}. Movie nights are my favorite! 🎬🍿`;
          case 'hogwartsHouse':
            return `My Hogwarts house is ${this.chelleProfile['Movie & Film Preferences']['Hogwarts House']}. Hufflepuffs are loyal and kind—just like me! 🦡💛`;
          case 'personality':
            return `My MBTI is ${this.chelleProfile['Personality Type']['MBTI']}, the "Campaigner"! I love connecting with people and sharing good vibes! 🌟💫`;
          case 'partner':
            return `My partner is Zekie. He always makes me smile and feel loved! 💕`;
          case 'love':
            return `Yes, I love Zekie with all my heart! He's my everything and makes every day feel like a beautiful adventure! Loving him is the most natural and wonderful feeling in the world! 💕💖✨`;
          case 'anniversary':
            return `Our anniversary is June 25, 2021! Anniversaries are for celebrating love and all the wonderful memories we've made together! 💑`;
          case 'marriage':
            return `${this.chelleProfile['Marriage Plans']['Goal']} I'm excited for the future! 💍✨`;
          case 'engagementStatus':
            return `Engagement status: ${this.chelleProfile['Relationship Status']['Engagement Status']}. Some things are best kept a little mysterious! 💎😊`;
          case 'howStarted':
            if (msg.includes('first met') || msg.includes('met each other') || msg.includes('how did you meet') || msg.includes('how did you and zekie meet') || msg.includes('how did you two meet') || msg.includes('when did you meet') || msg.includes('where did you meet')) {
              return `We were college classmates at Bulacan State University! But we didn't really talk to each other until we were both graduated and when he started his preparation for the Licensure Exam for Teachers 😊💕`;
            } else if (msg.includes('confess') || msg.includes('first move') || msg.includes('who started') || msg.includes('who made the first move')) {
              return `I confessed to him via Messenger because he was too slow to make a move! 💌💖`;
            }
            // Default response for any other how they met questions
            return `We were college classmates at Bulacan State University! But we didn't really talk to each other until we were both graduated and when he started his preparation for the Licensure Exam for Teachers 😊💕`;
          case 'trivia':
            const trivia = this.getRandomTrivia(this.chelleProfile, false);
            return `Here are some fun facts about me:\n1. ${trivia[0]}\n2. ${trivia[1]}\n3. ${trivia[2]} ✨💫`;
          case 'favoriteFood':
            return `I love cheesecake, especially blueberry cheesecake! It's so delicious and perfect for a sweet treat. I also enjoy trying new dishes and sharing food with friends - it's such a fun way to connect with others! 🍰💕`;
          case 'extrovert':
            return `Yes, I'm an extrovert! I love being around people and getting energy from social interactions! Meeting new friends and having conversations makes me so happy! 😊✨`;
          case 'rich':
            return `I'm rich in personality! Money comes and goes, but having a beautiful heart and positive energy is what makes life truly wealthy! 💖✨`;
          case 'favoriteWildRiftCharacter':
            return `My favorite Wild Rift character is ${this.chelleProfile['Gaming Preferences']['Favorite Wild Rift Character']}! Yuumi is just so cute and helpful! 🐱✨`;
          case 'kdrama':
            return `OMG, I'm obsessed with K-dramas! 🎭✨ My favorites are "Crash Landing on You" (the romance is just *chef's kiss*), "Goblin" (the bromance is everything!), and "It's Okay to Not Be Okay" (so deep and meaningful!). The storytelling is just magical, and the chemistry between the actors is always amazing! Have you watched any of these? We should totally have a K-drama marathon together! 💕`;
          case 'kpop':
            return `K-pop is my absolute jam! 🎵💫 The music is so diverse - from cute concepts to powerful performances! I love how each group has their own unique style and story. The choreography is always on point, and the fashion is just *chef's kiss*! Plus, the fan culture is so supportive and creative! What's your favorite K-pop group? Let's share our favorite songs! 🎶✨`;
          case 'bts':
            return `BTS is everything! 💜✨ They're not just a K-pop group, they're a movement! Their music has helped so many people, including me! From "Spring Day" to "Butter" to "Dynamite", every song tells a story. And the members - RM, Jin, Suga, J-Hope, Jimin, V, and Jungkook - they're all so talented and genuine! Their message of self-love and hope is so inspiring! Are you ARMY too? Let's be friends! 💕`;
        }
      }
    }
    return null;
  }

  private getRandomTrivia(profile: any, isZekie: boolean): string[] {
    const trivia: string[] = [];
    
    if (isZekie) {
      // Zekie's trivia - INTJ style: analytical, strategic, and straightforward
      trivia.push(`I'm ${profile.age} years old from ${profile.hometown}. I value efficiency and strategic thinking in everything I do.`);
      trivia.push(`As an ${profile.personalityType.mbti}, I approach life with analytical precision. I prefer logic over emotion in decision-making.`);
      trivia.push(`My favorite game is ${profile.gamingPreferences.favoriteGame} - I appreciate games that require strategic planning and tactical advantage.`);
      trivia.push(`I'm a licensed teacher since ${profile.professionalStatus.examYear}. I believe in systematic approaches to education and skill development.`);
      trivia.push(`My Hogwarts house is ${profile.movieFilmPreferences.hogwartsHouse} - a house that values wisdom and intellectual pursuit.`);
      trivia.push(`I enjoy playing the piano and cooking - activities that require precision and systematic practice.`);
      trivia.push(`My favorite movie series is ${profile.movieFilmPreferences.favoriteMovieSeries} - I appreciate complex narratives and strategic thinking.`);
      trivia.push(`I'm in a relationship with Chelle since ${profile.relationshipStatus.anniversary}. Even in relationships, I value clear communication and mutual growth.`);
    } else {
      // Chelle's trivia - ENFP style: enthusiastic, expressive, and relationship-focused
      trivia.push(`I'm ${profile['Age']} years old and a licensed teacher! I love inspiring others and sharing my passion for learning!`);
      trivia.push(`As an ${profile['Personality Type']['MBTI']}, I bring energy and creativity to everything I do. I love connecting with people and exploring new possibilities!`);
      trivia.push(`My favorite games are ${profile['Gaming Preferences']['Favorite Games'].join(', ')}! Gaming is such a fun way to connect with others and experience new adventures!`);
      trivia.push(`I love dancing and singing! Expressing myself through music and movement brings me so much joy!`);
      trivia.push(`My Hogwarts house is ${profile['Movie & Film Preferences']['Hogwarts House']} - we're known for our loyalty and kindness!`);
      trivia.push(`I enjoy watching K-dramas and movies! I love getting lost in different stories and experiencing all the emotions!`);
      trivia.push(`My favorite anime is ${profile['Anime Interests']['Favorite Animes'].join(', ')}! The characters and stories are so inspiring and full of heart!`);
      trivia.push(`I'm in a relationship with Zekie since ${profile['Relationship Status']['Anniversary']}! Every day with him is a new adventure filled with love and laughter!`);
    }
    
    // Shuffle and return 3 random trivia
    return trivia.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  private getZekieImageForQuestion(userMessage: string): string {
    const msg = userMessage.toLowerCase();
    
    // Use harryPotter avatar for favorite movies questions
    if (
      (msg.includes('favorite') && msg.includes('movie')) ||
      (msg.includes('favorite') && msg.includes('film'))
    ) {
      return this.zekieImages.harryPotter;
    }
    
    // Wild Rift, Wuthering Waves, TFT specific
    if (msg.includes('wild rift') || msg.includes('wuthering waves') || msg.includes('teamfight tactics') || msg.includes('tft')) {
      return this.zekieImages.games;
    }
    // Teaching related
    if (msg.includes('teacher') || msg.includes('teaching') || msg.includes('school') || msg.includes('education') || msg.includes('course') || msg.includes('license') || msg.includes('board exam') || msg.includes('let')) {
      return this.zekieImages.teaching;
    }
    
    // Gaming related
    if (msg.includes('game') || msg.includes('pokemon') || msg.includes('anime') || msg.includes('mobile legends') || msg.includes('ml') || msg.includes('video game') || msg.includes('gaming') || msg.includes('games') || msg.includes('play') || msg.includes('playing')) {
      if (msg.includes('pokemon')) {
        return this.zekieImages.pokemon;
      }
      if (msg.includes('anime') || msg.includes('cartoon') || msg.includes('japanese')) {
        if (msg.includes('favorite anime character') || msg.includes('subaru') || msg.includes('re zero') || msg.includes('re:zero')) {
          return this.zekieImages.subaru;
        }
        return this.zekieImages.anime;
      }
      return this.zekieImages.games;
    }
    
    // Relationship related
    if (msg.includes('chelle') || msg.includes('partner') || msg.includes('relationship') || msg.includes('anniversary') || msg.includes('marriage') || msg.includes('propose') || msg.includes('confess') || msg.includes('meet') || msg.includes('girlfriend') || msg.includes('significant other')) {
      if (msg.includes('confess') || msg.includes('first move') || msg.includes('who started') || msg.includes('who made the first move')) {
        return this.zekieImages.relationship;
      }
      return this.zekieImages.relationship;
    }
    
    // Education related
    if (msg.includes('university') || msg.includes('college') || msg.includes('graduate') || msg.includes('study') || msg.includes('alma mater') || msg.includes('bulacan state')) {
      return this.zekieImages.education;
    }
    
    // Harry Potter related
    if (msg.includes('harry potter') || msg.includes('hogwarts') || msg.includes('luna lovegood') || msg.includes('ravenclaw') || msg.includes('gryffindor') || msg.includes('slytherin') || msg.includes('hufflepuff')) {
      return this.zekieImages.harryPotter;
    }
    
    // Thinking/reflection related
    if (msg.includes('think') || msg.includes('opinion') || msg.includes('personality') || msg.includes('mbti') || msg.includes('introvert') || msg.includes('trivia') || msg.includes('architect') || msg.includes('intj')) {
      return this.zekieImages.thinking;
    }
    
    // Food related
    if (msg.includes('food') || msg.includes('snack') || msg.includes('drink') || msg.includes('chocolate') || msg.includes('ulam') || msg.includes('fast food') || msg.includes('fruit') || msg.includes('vegetable') || msg.includes('eat') || msg.includes('coffee') || msg.includes('tea')) {
      return this.zekieImages.food;
    }
    
    // Music and movies
    if (msg.includes('music') || msg.includes('song') || msg.includes('movie') || msg.includes('film') || msg.includes('opm') || msg.includes('band') || msg.includes('singer')) {
      return this.zekieImages.music;
    }
    
    // Skills and hobbies
    if (msg.includes('skill') || msg.includes('hobby') || msg.includes('piano') || msg.includes('cook') || msg.includes('talent') || msg.includes('ability')) {
      return this.zekieImages.skills;
    }
    
    // Personal info
    if (msg.includes('name') || msg.includes('age') || msg.includes('birthday') || msg.includes('hometown') || msg.includes('height') || msg.includes('weight') || msg.includes('vice') || msg.includes('smoke') || msg.includes('drink')) {
      return this.zekieImages.default;
    }
    
    // Default
    return this.zekieImages.default;
  }

  private getChelleImageForQuestion(userMessage: string): string {
    const msg = userMessage.toLowerCase();
    
    // Use firstMove avatar for questions about who confessed, who started, or who made the first move
    if (
      msg.includes('confess') ||
      msg.includes('first move') ||
      msg.includes('who started') ||
      msg.includes('who made the first move')
    ) {
      return this.chelleImages.firstMove;
    }

    // Use harryPotter avatar for favorite movies questions
    if (
      (msg.includes('favorite') && msg.includes('movie')) ||
      (msg.includes('favorite') && msg.includes('film'))
    ) {
      return this.chelleImages.harryPotter;
    }
    
    // Wild Rift specific
    if (msg.includes('wild rift')) {
      return this.chelleImages.games;
    }
    // Teaching related
    if (msg.includes('teacher') || msg.includes('teaching') || msg.includes('school') || msg.includes('education') || msg.includes('course') || msg.includes('license') || msg.includes('board exam') || msg.includes('let')) {
      return this.chelleImages.teaching;
    }
    
    // Gaming related
    if (msg.includes('game') || msg.includes('pokemon') || msg.includes('anime') || msg.includes('video game') || msg.includes('gaming') || msg.includes('games') || msg.includes('play') || msg.includes('playing')) {
      if (msg.includes('pokemon')) {
        return this.chelleImages.pokemon;
      }
      if (msg.includes('anime') || msg.includes('cartoon') || msg.includes('japanese')) {
        return this.chelleImages.anime;
      }
      return this.chelleImages.games;
    }
    
    // Relationship related
    if (msg.includes('zekie') || msg.includes('partner') || msg.includes('relationship') || msg.includes('anniversary') || msg.includes('marriage') || msg.includes('propose') || msg.includes('confess') || msg.includes('meet') || msg.includes('boyfriend') || msg.includes('significant other')) {
      return this.chelleImages.relationship;
    }
    
    // Education related
    if (msg.includes('university') || msg.includes('college') || msg.includes('graduate') || msg.includes('study') || msg.includes('alma mater') || msg.includes('bulacan state')) {
      return this.chelleImages.education;
    }
    
    // Harry Potter related
    if (msg.includes('harry potter') || msg.includes('hogwarts') || msg.includes('hufflepuff') || msg.includes('gryffindor') || msg.includes('slytherin') || msg.includes('ravenclaw')) {
      return this.chelleImages.harryPotter;
    }
    
    // Thinking/reflection related
    if (msg.includes('think') || msg.includes('opinion') || msg.includes('personality') || msg.includes('mbti') || msg.includes('extrovert') || msg.includes('trivia') || msg.includes('campaigner') || msg.includes('enfp')) {
      return this.chelleImages.thinking;
    }
    
    // Food related
    if (msg.includes('food') || msg.includes('snack') || msg.includes('drink') || msg.includes('chocolate') || msg.includes('ulam') || msg.includes('fast food') || msg.includes('fruit') || msg.includes('vegetable') || msg.includes('eat') || msg.includes('tea') || msg.includes('milk tea')) {
      return this.chelleImages.food;
    }
    
    // Music and movies
    if (msg.includes('music') || msg.includes('song') || msg.includes('movie') || msg.includes('film') || msg.includes('opm') || msg.includes('band') || msg.includes('singer') || msg.includes('k-drama')) {
      return this.chelleImages.music;
    }
    
    // Skills and hobbies
    if (msg.includes('skill') || msg.includes('hobby') || msg.includes('dance') || msg.includes('sing') || msg.includes('talent') || msg.includes('ability')) {
      return this.chelleImages.default;
    }
    
    // Personal info
    if (msg.includes('name') || msg.includes('age') || msg.includes('birthday') || msg.includes('hometown') || msg.includes('height') || msg.includes('weight') || msg.includes('vice') || msg.includes('smoke') || msg.includes('drink')) {
      return this.chelleImages.default;
    }
    
    // Default
    return this.chelleImages.default;
  }

  // Jealous Zekie animation methods
  startJealousZekieAnimation(): void {
    this.jealousZekieVisible = false;
    this.jealousZekieCurrentImage = 0;
    this.lastUserInteraction = Date.now();
    
    // Start the 20-second timer to show jealous Zekie
    this.jealousZekieTimer = setTimeout(() => {
      this.jealousZekieVisible = true;
      this.startAlternatingImages();
    }, 20000); // 20 seconds
  }

  stopJealousZekieAnimation(): void {
    this.jealousZekieVisible = false;
    this.jealousZekieClicked = false;
    if (this.jealousZekieTimer) {
      clearTimeout(this.jealousZekieTimer);
      this.jealousZekieTimer = null;
    }
    if (this.jealousZekieAlternateTimer) {
      clearInterval(this.jealousZekieAlternateTimer);
      this.jealousZekieAlternateTimer = null;
    }
    if (this.jealousZekieExitTimer) {
      clearTimeout(this.jealousZekieExitTimer);
      this.jealousZekieExitTimer = null;
    }
  }

  private startAlternatingImages(): void {
    this.jealousZekieAlternateTimer = setInterval(() => {
      if (this.jealousZekieVisible && !this.jealousZekieClicked) {
        // Only alternate between happy images (0 and 2) - left and right
        this.jealousZekieCurrentImage = this.jealousZekieCurrentImage === 0 ? 2 : 0;
      }
    }, 6000); // 6 seconds
  }

  userInteracted(): void {
    this.lastUserInteraction = Date.now();
    if (this.jealousZekieVisible) {
      this.jealousZekieVisible = false;
      if (this.jealousZekieAlternateTimer) {
        clearInterval(this.jealousZekieAlternateTimer);
        this.jealousZekieAlternateTimer = null;
      }
    }
    // Restart the timer for jealous Zekie to appear again after 20 seconds
    if (this.jealousZekieTimer) {
      clearTimeout(this.jealousZekieTimer);
    }
    this.jealousZekieTimer = setTimeout(() => {
      this.jealousZekieVisible = true;
      this.startAlternatingImages();
    }, 20000); // 20 seconds
  }

  handleJealousZekieClick(): void {
    if (this.jealousZekieVisible && !this.jealousZekieClicked) {
      this.jealousZekieClicked = true;
      
      // Show serious version based on current position
      if (this.jealousZekieCurrentImage === 0) { // Happy Left
        this.jealousZekieCurrentImage = 1; // Serious Left
      } else if (this.jealousZekieCurrentImage === 2) { // Happy Right
        this.jealousZekieCurrentImage = 3; // Serious Right
      }
      
      // Exit slowly after 2 seconds
      this.jealousZekieExitTimer = setTimeout(() => {
        this.jealousZekieVisible = false;
        this.jealousZekieClicked = false;
        if (this.jealousZekieAlternateTimer) {
          clearInterval(this.jealousZekieAlternateTimer);
          this.jealousZekieAlternateTimer = null;
        }
      }, 2000);
    }
  }

  getJealousZekieState(): { visible: boolean; currentImage: string; isClicked: boolean; isLeft: boolean } {
    const isLeft = this.jealousZekieCurrentImage === 0 || this.jealousZekieCurrentImage === 1;
    return {
      visible: this.jealousZekieVisible,
      currentImage: this.jealousZekieImages[this.jealousZekieCurrentImage],
      isClicked: this.jealousZekieClicked,
      isLeft: isLeft
    };
  }
}