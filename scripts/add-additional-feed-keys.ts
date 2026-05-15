#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCALES_DIR = join(__dirname, '../locales');

const NEW_KEYS: Record<string, Record<string, string>> = {
  // Common keys
  'common.post': {
    en: 'Post',
    es: 'Publicación',
    fr: 'Publication',
    de: 'Beitrag',
    zh: '帖子',
    ja: '投稿',
    ko: '게시물',
    ar: 'منشور',
    pt: 'Publicação',
    ru: 'Пост',
    hi: 'पोस्ट',
    it: 'Post',
  },
  'common.to': {
    en: 'to',
    es: 'a',
    fr: 'à',
    de: 'an',
    zh: '到',
    ja: 'へ',
    ko: '에게',
    ar: 'إلى',
    pt: 'para',
    ru: 'к',
    hi: 'को',
    it: 'a',
  },
  'common.tip': {
    en: 'Tip',
    es: 'Propina',
    fr: 'Pourboire',
    de: 'Trinkgeld',
    zh: '小费',
    ja: 'チップ',
    ko: '팁',
    ar: 'إكرامية',
    pt: 'Gorjeta',
    ru: 'Чаевые',
    hi: 'टिप',
    it: 'Mancia',
  },
  'common.receive': {
    en: 'Receive',
    es: 'Recibir',
    fr: 'Recevoir',
    de: 'Empfangen',
    zh: '接收',
    ja: '受け取る',
    ko: '받기',
    ar: 'استلام',
    pt: 'Receber',
    ru: 'Получить',
    hi: 'प्राप्त करें',
    it: 'Ricevi',
  },
  'common.feed': {
    en: 'Feed',
    es: 'Feed',
    fr: 'Fil',
    de: 'Feed',
    zh: '动态',
    ja: 'フィード',
    ko: '피드',
    ar: 'التغذية',
    pt: 'Feed',
    ru: 'Лента',
    hi: 'फ़ीड',
    it: 'Feed',
  },
  // Wallet keys
  'wallet.tokens': {
    en: 'Tokens',
    es: 'Tokens',
    fr: 'Jetons',
    de: 'Token',
    zh: '代币',
    ja: 'トークン',
    ko: '토큰',
    ar: 'الرموز',
    pt: 'Tokens',
    ru: 'Токены',
    hi: 'टोकन',
    it: 'Token',
  },
  'wallet.price': {
    en: 'Price',
    es: 'Precio',
    fr: 'Prix',
    de: 'Preis',
    zh: '价格',
    ja: '価格',
    ko: '가격',
    ar: 'السعر',
    pt: 'Preço',
    ru: 'Цена',
    hi: 'मूल्य',
    it: 'Prezzo',
  },
  'wallet.perToken': {
    en: 'per token',
    es: 'por token',
    fr: 'par jeton',
    de: 'pro Token',
    zh: '每个代币',
    ja: 'トークンあたり',
    ko: '토큰당',
    ar: 'لكل رمز',
    pt: 'por token',
    ru: 'за токен',
    hi: 'प्रति टोकन',
    it: 'per token',
  },
  'wallet.numberOfTokens': {
    en: 'Number of Tokens',
    es: 'Número de tokens',
    fr: 'Nombre de jetons',
    de: 'Anzahl der Token',
    zh: '代币数量',
    ja: 'トークン数',
    ko: '토큰 수',
    ar: 'عدد الرموز',
    pt: 'Número de tokens',
    ru: 'Количество токенов',
    hi: 'टोकन की संख्या',
    it: 'Numero di token',
  },
  'wallet.total': {
    en: 'Total',
    es: 'Total',
    fr: 'Total',
    de: 'Gesamt',
    zh: '总计',
    ja: '合計',
    ko: '합계',
    ar: 'المجموع',
    pt: 'Total',
    ru: 'Итого',
    hi: 'कुल',
    it: 'Totale',
  },
  'wallet.buying': {
    en: 'Buying...',
    es: 'Comprando...',
    fr: 'Achat...',
    de: 'Kaufen...',
    zh: '购买中...',
    ja: '購入中...',
    ko: '구매 중...',
    ar: 'جارٍ الشراء...',
    pt: 'Comprando...',
    ru: 'Покупка...',
    hi: 'खरीद रहे हैं...',
    it: 'Acquisto...',
  },
  'wallet.sending': {
    en: 'Sending...',
    es: 'Enviando...',
    fr: 'Envoi...',
    de: 'Senden...',
    zh: '发送中...',
    ja: '送信中...',
    ko: '전송 중...',
    ar: 'جارٍ الإرسال...',
    pt: 'Enviando...',
    ru: 'Отправка...',
    hi: 'भेज रहे हैं...',
    it: 'Invio...',
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
  console.log('🔄 Adding additional feed keys...\n');
  
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
  
  console.log('\n✅ Additional feed keys added successfully!');
}

addKeys();
