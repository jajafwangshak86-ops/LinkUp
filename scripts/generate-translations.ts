#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCALES_DIR = join(__dirname, '../locales');

// Language configurations
const LANGUAGES = {
  fr: { name: 'French', nativeName: 'Français' },
  de: { name: 'German', nativeName: 'Deutsch' },
  zh: { name: 'Chinese', nativeName: '中文' },
  ja: { name: 'Japanese', nativeName: '日本語' },
  ko: { name: 'Korean', nativeName: '한국어' },
  ar: { name: 'Arabic', nativeName: 'العربية', rtl: true },
  pt: { name: 'Portuguese', nativeName: 'Português' },
  ru: { name: 'Russian', nativeName: 'Русский' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  it: { name: 'Italian', nativeName: 'Italiano' },
};

// Manual translations for the missing keys
const TRANSLATIONS: Record<string, Record<string, string>> = {
  'settings.editProfile': {
    fr: 'Modifier le profil',
    de: 'Profil bearbeiten',
    zh: '编辑个人资料',
    ja: 'プロフィールを編集',
    ko: '프로필 편집',
    ar: 'تعديل الملف الشخصي',
    pt: 'Editar perfil',
    ru: 'Редактировать профиль',
    hi: 'प्रोफ़ाइल संपादित करें',
    it: 'Modifica profilo',
  },
  'settings.editProfileDesc': {
    fr: 'Mettez à jour votre nom, bio et avatar',
    de: 'Aktualisieren Sie Ihren Namen, Ihre Bio und Ihr Avatar',
    zh: '更新您的姓名、简介和头像',
    ja: '名前、自己紹介、アバターを更新',
    ko: '이름, 소개 및 아바타 업데이트',
    ar: 'قم بتحديث اسمك وسيرتك الذاتية وصورتك الرمزية',
    pt: 'Atualize seu nome, bio e avatar',
    ru: 'Обновите свое имя, биографию и аватар',
    hi: 'अपना नाम, बायो और अवतार अपडेट करें',
    it: 'Aggiorna il tuo nome, bio e avatar',
  },
  'settings.notificationsEnabled': {
    fr: 'Notifications push activées',
    de: 'Push-Benachrichtigungen aktiviert',
    zh: '推送通知已启用',
    ja: 'プッシュ通知が有効',
    ko: '푸시 알림 활성화됨',
    ar: 'تم تفعيل الإشعارات الفورية',
    pt: 'Notificações push ativadas',
    ru: 'Push-уведомления включены',
    hi: 'पुश सूचनाएं सक्षम',
    it: 'Notifiche push abilitate',
  },
  'settings.notificationsDisabled': {
    fr: 'Notifications push désactivées',
    de: 'Push-Benachrichtigungen deaktiviert',
    zh: '推送通知已禁用',
    ja: 'プッシュ通知が無効',
    ko: '푸시 알림 비활성화됨',
    ar: 'تم تعطيل الإشعارات الفورية',
    pt: 'Notificações push desativadas',
    ru: 'Push-уведомления отключены',
    hi: 'पुश सूचनाएं अक्षम',
    it: 'Notifiche push disabilitate',
  },
  'settings.securityPrivacy': {
    fr: 'Sécurité et confidentialité',
    de: 'Sicherheit und Datenschutz',
    zh: '安全与隐私',
    ja: 'セキュリティとプライバシー',
    ko: '보안 및 개인정보',
    ar: 'الأمان والخصوصية',
    pt: 'Segurança e privacidade',
    ru: 'Безопасность и конфиденциальность',
    hi: 'सुरक्षा और गोपनीयता',
    it: 'Sicurezza e privacy',
  },
  'settings.securityPrivacyDesc': {
    fr: 'Mot de passe, 2FA et sécurité du portefeuille',
    de: 'Passwort, 2FA und Wallet-Sicherheit',
    zh: '密码、双因素认证和钱包安全',
    ja: 'パスワード、2FA、ウォレットセキュリティ',
    ko: '비밀번호, 2FA 및 지갑 보안',
    ar: 'كلمة المرور والمصادقة الثنائية وأمان المحفظة',
    pt: 'Senha, 2FA e segurança da carteira',
    ru: 'Пароль, 2FA и безопасность кошелька',
    hi: 'पासवर्ड, 2FA और वॉलेट सुरक्षा',
    it: 'Password, 2FA e sicurezza del portafoglio',
  },
  'settings.preferences': {
    fr: 'Préférences',
    de: 'Einstellungen',
    zh: '偏好设置',
    ja: '設定',
    ko: '환경설정',
    ar: 'التفضيلات',
    pt: 'Preferências',
    ru: 'Настройки',
    hi: 'प्राथमिकताएं',
    it: 'Preferenze',
  },
  'settings.darkMode': {
    fr: 'Mode sombre',
    de: 'Dunkler Modus',
    zh: '深色模式',
    ja: 'ダークモード',
    ko: '다크 모드',
    ar: 'الوضع الداكن',
    pt: 'Modo escuro',
    ru: 'Темный режим',
    hi: 'डार्क मोड',
    it: 'Modalità scura',
  },
  'settings.darkModeEnabled': {
    fr: 'Thème sombre activé',
    de: 'Dunkles Design aktiviert',
    zh: '深色主题已启用',
    ja: 'ダークテーマが有効',
    ko: '다크 테마 활성화됨',
    ar: 'تم تفعيل المظهر الداكن',
    pt: 'Tema escuro ativado',
    ru: 'Темная тема включена',
    hi: 'डार्क थीम सक्षम',
    it: 'Tema scuro abilitato',
  },
  'settings.darkModeDisabled': {
    fr: 'Thème clair activé',
    de: 'Helles Design aktiviert',
    zh: '浅色主题已启用',
    ja: 'ライトテーマが有効',
    ko: '라이트 테마 활성화됨',
    ar: 'تم تفعيل المظهر الفاتح',
    pt: 'Tema claro ativado',
    ru: 'Светлая тема включена',
    hi: 'लाइट थीम सक्षम',
    it: 'Tema chiaro abilitato',
  },
  'settings.selectLanguage': {
    fr: 'Sélectionner la langue',
    de: 'Sprache auswählen',
    zh: '选择语言',
    ja: '言語を選択',
    ko: '언어 선택',
    ar: 'اختر اللغة',
    pt: 'Selecionar idioma',
    ru: 'Выбрать язык',
    hi: 'भाषा चुनें',
    it: 'Seleziona lingua',
  },
  'settings.support': {
    fr: 'Support',
    de: 'Unterstützung',
    zh: '支持',
    ja: 'サポート',
    ko: '지원',
    ar: 'الدعم',
    pt: 'Suporte',
    ru: 'Поддержка',
    hi: 'सहायता',
    it: 'Supporto',
  },
  'settings.helpSupport': {
    fr: 'Aide et support',
    de: 'Hilfe und Support',
    zh: '帮助与支持',
    ja: 'ヘルプとサポート',
    ko: '도움말 및 지원',
    ar: 'المساعدة والدعم',
    pt: 'Ajuda e suporte',
    ru: 'Помощь и поддержка',
    hi: 'सहायता और समर्थन',
    it: 'Aiuto e supporto',
  },
  'settings.helpSupportDesc': {
    fr: 'FAQ, nous contacter, tutoriels',
    de: 'FAQs, Kontakt, Tutorials',
    zh: '常见问题、联系我们、教程',
    ja: 'よくある質問、お問い合わせ、チュートリアル',
    ko: 'FAQ, 문의하기, 튜토리얼',
    ar: 'الأسئلة الشائعة، اتصل بنا، دروس تعليمية',
    pt: 'Perguntas frequentes, entre em contato, tutoriais',
    ru: 'Часто задаваемые вопросы, связаться с нами, руководства',
    hi: 'अक्सर पूछे जाने वाले प्रश्न, हमसे संपर्क करें, ट्यूटोरियल',
    it: 'Domande frequenti, contattaci, tutorial',
  },
  'settings.termsPrivacy': {
    fr: 'Conditions et confidentialité',
    de: 'Bedingungen und Datenschutz',
    zh: '条款与隐私',
    ja: '利用規約とプライバシー',
    ko: '약관 및 개인정보',
    ar: 'الشروط والخصوصية',
    pt: 'Termos e privacidade',
    ru: 'Условия и конфиденциальность',
    hi: 'नियम और गोपनीयता',
    it: 'Termini e privacy',
  },
  'settings.termsPrivacyDesc': {
    fr: 'Informations légales et politiques',
    de: 'Rechtliche Informationen und Richtlinien',
    zh: '法律信息和政策',
    ja: '法的情報とポリシー',
    ko: '법적 정보 및 정책',
    ar: 'المعلومات القانونية والسياسات',
    pt: 'Informações legais e políticas',
    ru: 'Юридическая информация и политики',
    hi: 'कानूनी जानकारी और नीतियां',
    it: 'Informazioni legali e politiche',
  },
  'settings.logoutConfirm': {
    fr: 'Êtes-vous sûr de vouloir vous déconnecter?',
    de: 'Möchten Sie sich wirklich abmelden?',
    zh: '您确定要退出登录吗？',
    ja: 'ログアウトしてもよろしいですか？',
    ko: '로그아웃하시겠습니까?',
    ar: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
    pt: 'Tem certeza de que deseja sair?',
    ru: 'Вы уверены, что хотите выйти?',
    hi: 'क्या आप वाकई लॉगआउट करना चाहते हैं?',
    it: 'Sei sicuro di voler uscire?',
  },
  'common.viewAll': {
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
};

/**
 * Set a nested value in an object using dot notation
 */
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

/**
 * Update translation files with missing keys
 */
function updateTranslations() {
  console.log('🔄 Updating translation files...\n');
  
  for (const [langCode, langInfo] of Object.entries(LANGUAGES)) {
    const langPath = join(LOCALES_DIR, `${langCode}.json`);
    
    try {
      const langContent = JSON.parse(readFileSync(langPath, 'utf-8'));
      let updated = false;
      
      // Add missing translations
      for (const [key, translations] of Object.entries(TRANSLATIONS)) {
        if (translations[langCode]) {
          setNestedValue(langContent, key, translations[langCode]);
          updated = true;
        }
      }
      
      if (updated) {
        writeFileSync(langPath, JSON.stringify(langContent, null, 2) + '\n', 'utf-8');
        console.log(`✅ Updated ${langCode}.json (${langInfo.nativeName})`);
      } else {
        console.log(`ℹ️  ${langCode}.json already up to date`);
      }
      
    } catch (error) {
      console.error(`❌ Error updating ${langCode}.json:`, error);
    }
  }
  
  console.log('\n✅ Translation update complete!');
}

// Run the update
updateTranslations();
