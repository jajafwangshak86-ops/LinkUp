#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCALES_DIR = join(__dirname, '../locales');

const NEW_KEYS: Record<string, Record<string, string>> = {
  'wallet.yourAssets': {
    en: 'Your Assets',
    es: 'Tus activos',
    fr: 'Vos actifs',
    de: 'Ihre Vermögenswerte',
    zh: '您的资产',
    ja: 'あなたの資産',
    ko: '자산',
    ar: 'أصولك',
    pt: 'Seus ativos',
    ru: 'Ваши активы',
    hi: 'आपकी संपत्ति',
    it: 'I tuoi asset',
  },
  'wallet.viewAll': {
    en: 'View All',
    es: 'Ver todo',
    fr: 'Tout voir',
    de: 'Alle anzeigen',
    zh: '查看全部',
    ja: 'すべて表示',
    ko: '모두 보기',
    ar: 'عرض الكل',
    pt: 'Ver tudo',
    ru: 'Посмотреть все',
    hi: 'सभी देखें',
    it: 'Vedi tutto',
  },
  'wallet.postTokens': {
    en: 'Post Tokens',
    es: 'Tokens de publicaciones',
    fr: 'Jetons de publication',
    de: 'Post-Token',
    zh: '帖子代币',
    ja: '投稿トークン',
    ko: '게시물 토큰',
    ar: 'رموز المنشورات',
    pt: 'Tokens de publicação',
    ru: 'Токены постов',
    hi: 'पोस्ट टोकन',
    it: 'Token dei post',
  },
  'wallet.tokensCount': {
    en: 'tokens',
    es: 'tokens',
    fr: 'jetons',
    de: 'Token',
    zh: '代币',
    ja: 'トークン',
    ko: '토큰',
    ar: 'رموز',
    pt: 'tokens',
    ru: 'токенов',
    hi: 'टोकन',
    it: 'token',
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
  console.log('🔄 Adding missing wallet keys...\n');
  
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
  
  console.log('\n✅ Missing wallet keys added successfully!');
}

addKeys();
