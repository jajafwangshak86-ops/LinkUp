#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCALES_DIR = join(__dirname, '../locales');
const LANGUAGES = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'ar', 'pt', 'ru', 'hi', 'it'];

/**
 * Recursively extract all keys from a nested JSON object
 */
function getAllKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];
  
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      // Recursively get keys from nested objects
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      // Leaf node - add the key
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Validate all translation files against the base English file
 */
function validateTranslations() {
  console.log('🔍 Validating translation files...\n');
  
  // Load English translation file as base
  const enPath = join(LOCALES_DIR, 'en.json');
  if (!existsSync(enPath)) {
    console.error('❌ Base translation file (en.json) not found!');
    process.exit(1);
  }
  
  const enContent = JSON.parse(readFileSync(enPath, 'utf-8'));
  const baseKeys = getAllKeys(enContent);
  
  console.log(`📋 Base translation (en.json) has ${baseKeys.length} keys\n`);
  
  let hasErrors = false;
  const results: Array<{
    lang: string;
    status: 'complete' | 'incomplete' | 'error';
    missing: number;
    extra: number;
    empty: number;
  }> = [];
  
  // Validate each language file
  for (const lang of LANGUAGES) {
    if (lang === 'en') continue; // Skip base language
    
    const langPath = join(LOCALES_DIR, `${lang}.json`);
    
    if (!existsSync(langPath)) {
      console.error(`❌ ${lang}.json - File not found`);
      hasErrors = true;
      results.push({ lang, status: 'error', missing: baseKeys.length, extra: 0, empty: 0 });
      continue;
    }
    
    try {
      const langContent = JSON.parse(readFileSync(langPath, 'utf-8'));
      const langKeys = getAllKeys(langContent);
      
      // Find missing keys
      const missing = baseKeys.filter(k => !langKeys.includes(k));
      
      // Find extra keys
      const extra = langKeys.filter(k => !baseKeys.includes(k));
      
      // Check for empty values or placeholder text
      const emptyKeys = langKeys.filter(k => {
        const value = getNestedValue(langContent, k);
        if (typeof value !== 'string') return false;
        // Check for empty strings or exact placeholder matches (not partial)
        return value === '' || /^(TODO|Translation needed|FIXME)$/i.test(value.trim());
      });
      
      const status = missing.length === 0 && emptyKeys.length === 0 ? 'complete' : 'incomplete';
      results.push({ lang, status, missing: missing.length, extra: extra.length, empty: emptyKeys.length });
      
      if (missing.length > 0) {
        console.error(`❌ ${lang}.json - Missing ${missing.length} keys:`);
        missing.slice(0, 10).forEach(k => console.error(`   - ${k}`));
        if (missing.length > 10) {
          console.error(`   ... and ${missing.length - 10} more`);
        }
        hasErrors = true;
      }
      
      if (extra.length > 0) {
        console.warn(`⚠️  ${lang}.json - Extra ${extra.length} keys:`);
        extra.slice(0, 5).forEach(k => console.warn(`   - ${k}`));
        if (extra.length > 5) {
          console.warn(`   ... and ${extra.length - 5} more`);
        }
      }
      
      if (emptyKeys.length > 0) {
        console.error(`❌ ${lang}.json - ${emptyKeys.length} empty or placeholder values:`);
        emptyKeys.slice(0, 10).forEach(k => console.error(`   - ${k}`));
        if (emptyKeys.length > 10) {
          console.error(`   ... and ${emptyKeys.length - 10} more`);
        }
        hasErrors = true;
      }
      
      if (status === 'complete') {
        console.log(`✅ ${lang}.json - Complete (${langKeys.length} keys)`);
      }
      
    } catch (error) {
      console.error(`❌ ${lang}.json - Parse error:`, error);
      hasErrors = true;
      results.push({ lang, status: 'error', missing: 0, extra: 0, empty: 0 });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  
  const complete = results.filter(r => r.status === 'complete').length;
  const incomplete = results.filter(r => r.status === 'incomplete').length;
  const errors = results.filter(r => r.status === 'error').length;
  
  console.log(`✅ Complete: ${complete}/${LANGUAGES.length - 1}`);
  console.log(`⚠️  Incomplete: ${incomplete}/${LANGUAGES.length - 1}`);
  console.log(`❌ Errors: ${errors}/${LANGUAGES.length - 1}`);
  
  if (hasErrors) {
    console.log('\n❌ Validation failed! Please fix the issues above.');
    process.exit(1);
  } else {
    console.log('\n✅ All translation files are valid!');
    process.exit(0);
  }
}

// Run validation
validateTranslations();
