#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCALES_DIR = join(__dirname, '../locales');

const NEW_AUTH_KEYS: Record<string, Record<string, string>> = {
  'auth.welcomeBack': {
    en: 'Welcome Back!',
    es: '¡Bienvenido de nuevo!',
    fr: 'Bon retour!',
    de: 'Willkommen zurück!',
    zh: '欢迎回来！',
    ja: 'おかえりなさい！',
    ko: '다시 오신 것을 환영합니다!',
    ar: 'مرحبا بعودتك!',
    pt: 'Bem-vindo de volta!',
    ru: 'С возвращением!',
    hi: 'वापसी पर स्वागत है!',
    it: 'Bentornato!',
  },
  'auth.signInSubtitle': {
    en: 'Sign in to your account',
    es: 'Inicia sesión en tu cuenta',
    fr: 'Connectez-vous à votre compte',
    de: 'Melden Sie sich bei Ihrem Konto an',
    zh: '登录您的账户',
    ja: 'アカウントにサインイン',
    ko: '계정에 로그인',
    ar: 'قم بتسجيل الدخول إلى حسابك',
    pt: 'Entre na sua conta',
    ru: 'Войдите в свой аккаунт',
    hi: 'अपने खाते में साइन इन करें',
    it: 'Accedi al tuo account',
  },
  'auth.enterYourEmail': {
    en: 'Enter Your Email',
    es: 'Ingresa tu correo electrónico',
    fr: 'Entrez votre email',
    de: 'Geben Sie Ihre E-Mail ein',
    zh: '输入您的电子邮件',
    ja: 'メールアドレスを入力',
    ko: '이메일을 입력하세요',
    ar: 'أدخل بريدك الإلكتروني',
    pt: 'Digite seu e-mail',
    ru: 'Введите ваш email',
    hi: 'अपना ईमेल दर्ज करें',
    it: 'Inserisci la tua email',
  },
  'auth.emailRecoveryDesc': {
    en: 'This email will be used to recover your social account if you lose access.',
    es: 'Este correo se usará para recuperar tu cuenta social si pierdes el acceso.',
    fr: 'Cet email sera utilisé pour récupérer votre compte social si vous perdez l\'accès.',
    de: 'Diese E-Mail wird verwendet, um Ihr Social-Konto wiederherzustellen, wenn Sie den Zugriff verlieren.',
    zh: '如果您失去访问权限，此电子邮件将用于恢复您的社交账户。',
    ja: 'アクセスを失った場合、このメールアドレスはソーシャルアカウントの回復に使用されます。',
    ko: '액세스 권한을 잃은 경우 이 이메일을 사용하여 소셜 계정을 복구합니다.',
    ar: 'سيتم استخدام هذا البريد الإلكتروني لاستعادة حسابك الاجتماعي إذا فقدت الوصول.',
    pt: 'Este e-mail será usado para recuperar sua conta social se você perder o acesso.',
    ru: 'Этот email будет использоваться для восстановления вашей социальной учетной записи, если вы потеряете доступ.',
    hi: 'यदि आप पहुंच खो देते हैं तो इस ईमेल का उपयोग आपके सोशल अकाउंट को पुनर्प्राप्त करने के लिए किया जाएगा।',
    it: 'Questa email verrà utilizzata per recuperare il tuo account social se perdi l\'accesso.',
  },
  'auth.createAccount': {
    en: 'Create Account',
    es: 'Crear cuenta',
    fr: 'Créer un compte',
    de: 'Konto erstellen',
    zh: '创建账户',
    ja: 'アカウントを作成',
    ko: '계정 만들기',
    ar: 'إنشاء حساب',
    pt: 'Criar conta',
    ru: 'Создать аккаунт',
    hi: 'खाता बनाएं',
    it: 'Crea account',
  },
  'auth.resetPassword': {
    en: 'Reset Password',
    es: 'Restablecer contraseña',
    fr: 'Réinitialiser le mot de passe',
    de: 'Passwort zurücksetzen',
    zh: '重置密码',
    ja: 'パスワードをリセット',
    ko: '비밀번호 재설정',
    ar: 'إعادة تعيين كلمة المرور',
    pt: 'Redefinir senha',
    ru: 'Сбросить пароль',
    hi: 'पासवर्ड रीसेट करें',
    it: 'Reimposta password',
  },
  'auth.resetPasswordDesc': {
    en: 'Enter your email to receive a password reset link',
    es: 'Ingresa tu correo para recibir un enlace de restablecimiento',
    fr: 'Entrez votre email pour recevoir un lien de réinitialisation',
    de: 'Geben Sie Ihre E-Mail ein, um einen Link zum Zurücksetzen zu erhalten',
    zh: '输入您的电子邮件以接收密码重置链接',
    ja: 'パスワードリセットリンクを受け取るためにメールアドレスを入力してください',
    ko: '비밀번호 재설정 링크를 받으려면 이메일을 입력하세요',
    ar: 'أدخل بريدك الإلكتروني لتلقي رابط إعادة تعيين كلمة المرور',
    pt: 'Digite seu e-mail para receber um link de redefinição de senha',
    ru: 'Введите ваш email, чтобы получить ссылку для сброса пароля',
    hi: 'पासवर्ड रीसेट लिंक प्राप्त करने के लिए अपना ईमेल दर्ज करें',
    it: 'Inserisci la tua email per ricevere un link di reimpostazione password',
  },
  'auth.sendResetLink': {
    en: 'Send Reset Link',
    es: 'Enviar enlace',
    fr: 'Envoyer le lien',
    de: 'Link senden',
    zh: '发送重置链接',
    ja: 'リンクを送信',
    ko: '링크 보내기',
    ar: 'إرسال الرابط',
    pt: 'Enviar link',
    ru: 'Отправить ссылку',
    hi: 'लिंक भेजें',
    it: 'Invia link',
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

function addAuthKeys() {
  console.log('🔄 Adding new auth keys...\n');
  
  const languages = ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'ar', 'pt', 'ru', 'hi', 'it'];
  
  for (const lang of languages) {
    const langPath = join(LOCALES_DIR, `${lang}.json`);
    
    try {
      const langContent = JSON.parse(readFileSync(langPath, 'utf-8'));
      let updated = false;
      
      for (const [key, translations] of Object.entries(NEW_AUTH_KEYS)) {
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
  
  console.log('\n✅ Auth keys added successfully!');
}

addAuthKeys();
