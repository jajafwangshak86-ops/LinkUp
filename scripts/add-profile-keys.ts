#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCALES_DIR = join(__dirname, '../locales');

const NEW_KEYS: Record<string, Record<string, string>> = {
  // Profile tabs
  'profile.replies': {
    en: 'Replies',
    es: 'Respuestas',
    fr: 'Réponses',
    de: 'Antworten',
    zh: '回复',
    ja: '返信',
    ko: '답글',
    ar: 'الردود',
    pt: 'Respostas',
    ru: 'Ответы',
    hi: 'उत्तर',
    it: 'Risposte',
  },
  'profile.likes': {
    en: 'Likes',
    es: 'Me gusta',
    fr: 'J\'aime',
    de: 'Gefällt mir',
    zh: '点赞',
    ja: 'いいね',
    ko: '좋아요',
    ar: 'الإعجابات',
    pt: 'Curtidas',
    ru: 'Лайки',
    hi: 'पसंद',
    it: 'Mi piace',
  },
  'profile.noCommentsYet': {
    en: 'No comments yet',
    es: 'Aún no hay comentarios',
    fr: 'Pas encore de commentaires',
    de: 'Noch keine Kommentare',
    zh: '还没有评论',
    ja: 'まだコメントがありません',
    ko: '아직 댓글이 없습니다',
    ar: 'لا توجد تعليقات بعد',
    pt: 'Ainda não há comentários',
    ru: 'Пока нет комментариев',
    hi: 'अभी तक कोई टिप्पणी नहीं',
    it: 'Nessun commento ancora',
  },
  'profile.repliedTo': {
    en: 'Replied to',
    es: 'Respondió a',
    fr: 'A répondu à',
    de: 'Antwortete auf',
    zh: '回复了',
    ja: '返信しました',
    ko: '답글 대상',
    ar: 'رد على',
    pt: 'Respondeu a',
    ru: 'Ответил',
    hi: 'को उत्तर दिया',
    it: 'Ha risposto a',
  },
  'profile.tokenized': {
    en: 'Tokenized',
    es: 'Tokenizado',
    fr: 'Tokenisé',
    de: 'Tokenisiert',
    zh: '已代币化',
    ja: 'トークン化済み',
    ko: '토큰화됨',
    ar: 'مرمز',
    pt: 'Tokenizado',
    ru: 'Токенизировано',
    hi: 'टोकन बनाया गया',
    it: 'Tokenizzato',
  },
  // Portfolio
  'profile.noTokenHoldings': {
    en: 'No token holdings yet',
    es: 'Aún no hay tokens',
    fr: 'Pas encore de jetons',
    de: 'Noch keine Token',
    zh: '还没有代币持有',
    ja: 'まだトークンがありません',
    ko: '아직 토큰 보유가 없습니다',
    ar: 'لا توجد رموز بعد',
    pt: 'Ainda não há tokens',
    ru: 'Пока нет токенов',
    hi: 'अभी तक कोई टोकन नहीं',
    it: 'Nessun token ancora',
  },
  'profile.buyPostTokens': {
    en: 'Buy post tokens to start building your portfolio',
    es: 'Compra tokens de publicaciones para comenzar a construir tu portafolio',
    fr: 'Achetez des jetons de publication pour commencer à construire votre portefeuille',
    de: 'Kaufen Sie Post-Token, um Ihr Portfolio aufzubauen',
    zh: '购买帖子代币开始构建您的投资组合',
    ja: '投稿トークンを購入してポートフォリオを構築しましょう',
    ko: '포트폴리오 구축을 시작하려면 게시물 토큰을 구매하세요',
    ar: 'اشترِ رموز المنشورات لبدء بناء محفظتك',
    pt: 'Compre tokens de publicação para começar a construir seu portfólio',
    ru: 'Купите токены постов, чтобы начать строить свой портфель',
    hi: 'अपना पोर्टफोलियो बनाना शुरू करने के लिए पोस्ट टोकन खरीदें',
    it: 'Acquista token di post per iniziare a costruire il tuo portafoglio',
  },
  'profile.totalPortfolioValue': {
    en: 'Total Portfolio Value',
    es: 'Valor total del portafolio',
    fr: 'Valeur totale du portefeuille',
    de: 'Gesamtwert des Portfolios',
    zh: '投资组合总价值',
    ja: 'ポートフォリオ総額',
    ko: '총 포트폴리오 가치',
    ar: 'القيمة الإجمالية للمحفظة',
    pt: 'Valor total do portfólio',
    ru: 'Общая стоимость портфеля',
    hi: 'कुल पोर्टफोलियो मूल्य',
    it: 'Valore totale del portafoglio',
  },
  'profile.invested': {
    en: 'Invested',
    es: 'Invertido',
    fr: 'Investi',
    de: 'Investiert',
    zh: '已投资',
    ja: '投資額',
    ko: '투자됨',
    ar: 'مستثمر',
    pt: 'Investido',
    ru: 'Инвестировано',
    hi: 'निवेश किया गया',
    it: 'Investito',
  },
  'profile.holdings': {
    en: 'Holdings',
    es: 'Tenencias',
    fr: 'Avoirs',
    de: 'Bestände',
    zh: '持有',
    ja: '保有',
    ko: '보유',
    ar: 'الممتلكات',
    pt: 'Participações',
    ru: 'Активы',
    hi: 'होल्डिंग्स',
    it: 'Partecipazioni',
  },
  'profile.postsCount': {
    en: 'posts',
    es: 'publicaciones',
    fr: 'publications',
    de: 'Beiträge',
    zh: '帖子',
    ja: '投稿',
    ko: '게시물',
    ar: 'منشورات',
    pt: 'publicações',
    ru: 'постов',
    hi: 'पोस्ट',
    it: 'post',
  },
  'profile.by': {
    en: 'by',
    es: 'por',
    fr: 'par',
    de: 'von',
    zh: '由',
    ja: '投稿者',
    ko: '작성자',
    ar: 'بواسطة',
    pt: 'por',
    ru: 'от',
    hi: 'द्वारा',
    it: 'di',
  },
  'profile.avgPrice': {
    en: 'Avg Price',
    es: 'Precio promedio',
    fr: 'Prix moyen',
    de: 'Durchschnittspreis',
    zh: '平均价格',
    ja: '平均価格',
    ko: '평균 가격',
    ar: 'متوسط السعر',
    pt: 'Preço médio',
    ru: 'Средняя цена',
    hi: 'औसत मूल्य',
    it: 'Prezzo medio',
  },
  'profile.current': {
    en: 'Current',
    es: 'Actual',
    fr: 'Actuel',
    de: 'Aktuell',
    zh: '当前',
    ja: '現在',
    ko: '현재',
    ar: 'الحالي',
    pt: 'Atual',
    ru: 'Текущий',
    hi: 'वर्तमान',
    it: 'Attuale',
  },
  'profile.value': {
    en: 'Value',
    es: 'Valor',
    fr: 'Valeur',
    de: 'Wert',
    zh: '价值',
    ja: '価値',
    ko: '가치',
    ar: 'القيمة',
    pt: 'Valor',
    ru: 'Стоимость',
    hi: 'मूल्य',
    it: 'Valore',
  },
  // Common profile text
  'profile.likesCount': {
    en: 'likes',
    es: 'me gusta',
    fr: 'j\'aime',
    de: 'Gefällt mir',
    zh: '点赞',
    ja: 'いいね',
    ko: '좋아요',
    ar: 'إعجابات',
    pt: 'curtidas',
    ru: 'лайков',
    hi: 'पसंद',
    it: 'mi piace',
  },
  'profile.commentsCount': {
    en: 'comments',
    es: 'comentarios',
    fr: 'commentaires',
    de: 'Kommentare',
    zh: '评论',
    ja: 'コメント',
    ko: '댓글',
    ar: 'تعليقات',
    pt: 'comentários',
    ru: 'комментариев',
    hi: 'टिप्पणियाँ',
    it: 'commenti',
  },
};

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  
  let current = obj;
  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
}

function addKeys() {
  console.log('🔄 Adding profile keys...\n');
  
  const languages = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'ar', 'pt', 'ru', 'hi', 'it'];
  
  for (const lang of languages) {
    const langPath = join(LOCALES_DIR, `${lang}.json`);
    
    try {
      const langContent = JSON.parse(readFileSync(langPath, 'utf-8'));
      let updated = false;
      
      for (const [key, translations] of Object.entries(NEW_KEYS)) {
        if (translations[lang]) {
          setNestedValue(langContent, key, translations[lang]);
          updated = true;
        }
      }
      
      if (updated) {
        writeFileSync(langPath, JSON.stringify(langContent, null, 2) + '\n', 'utf-8');
        console.log(`✅ Updated ${lang}.json`);
      }
      
    } catch (error) {
      console.error(`❌ Error updating ${lang}.json:`, error);
    }
  }
  
  console.log('\n✅ Profile keys added successfully!');
}

addKeys();
