#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCALES_DIR = join(__dirname, '../locales');

const NEW_KEYS: Record<string, Record<string, string>> = {
  'auth.twoFactorAuthentication': {
    en: 'Two-Factor Authentication',
    es: 'Autenticación de dos factores',
    fr: 'Authentification à deux facteurs',
    de: 'Zwei-Faktor-Authentifizierung',
    zh: '双因素认证',
    ja: '二要素認証',
    ko: '2단계 인증',
    ar: 'المصادقة الثنائية',
    pt: 'Autenticação de dois fatores',
    ru: 'Двухфакторная аутентификация',
    hi: 'दो-कारक प्रमाणीकरण',
    it: 'Autenticazione a due fattori',
  },
  'auth.enterAuthenticatorCode': {
    en: 'Enter the 6-digit code from your authenticator app',
    es: 'Ingresa el código de 6 dígitos de tu aplicación de autenticación',
    fr: 'Entrez le code à 6 chiffres de votre application d\'authentification',
    de: 'Geben Sie den 6-stelligen Code aus Ihrer Authentifizierungs-App ein',
    zh: '输入您的身份验证应用程序中的6位数代码',
    ja: '認証アプリから6桁のコードを入力してください',
    ko: '인증 앱에서 6자리 코드를 입력하세요',
    ar: 'أدخل الرمز المكون من 6 أرقام من تطبيق المصادقة الخاص بك',
    pt: 'Digite o código de 6 dígitos do seu aplicativo autenticador',
    ru: 'Введите 6-значный код из вашего приложения аутентификации',
    hi: 'अपने प्रमाणक ऐप से 6 अंकों का कोड दर्ज करें',
    it: 'Inserisci il codice a 6 cifre dalla tua app di autenticazione',
  },
  'auth.enterRecoveryCode': {
    en: 'Enter your recovery code',
    es: 'Ingresa tu código de recuperación',
    fr: 'Entrez votre code de récupération',
    de: 'Geben Sie Ihren Wiederherstellungscode ein',
    zh: '输入您的恢复代码',
    ja: '回復コードを入力してください',
    ko: '복구 코드를 입력하세요',
    ar: 'أدخل رمز الاسترداد الخاص بك',
    pt: 'Digite seu código de recuperação',
    ru: 'Введите код восстановления',
    hi: 'अपना पुनर्प्राप्ति कोड दर्ज करें',
    it: 'Inserisci il tuo codice di recupero',
  },
  'auth.recoveryCode': {
    en: 'Recovery Code',
    es: 'Código de recuperación',
    fr: 'Code de récupération',
    de: 'Wiederherstellungscode',
    zh: '恢复代码',
    ja: '回復コード',
    ko: '복구 코드',
    ar: 'رمز الاسترداد',
    pt: 'Código de recuperação',
    ru: 'Код восстановления',
    hi: 'पुनर्प्राप्ति कोड',
    it: 'Codice di recupero',
  },
  'auth.useAuthenticatorCode': {
    en: 'Use authenticator code',
    es: 'Usar código de autenticación',
    fr: 'Utiliser le code d\'authentification',
    de: 'Authentifizierungscode verwenden',
    zh: '使用身份验证代码',
    ja: '認証コードを使用',
    ko: '인증 코드 사용',
    ar: 'استخدام رمز المصادقة',
    pt: 'Usar código autenticador',
    ru: 'Использовать код аутентификации',
    hi: 'प्रमाणक कोड का उपयोग करें',
    it: 'Usa codice autenticatore',
  },
  'auth.useRecoveryCodeInstead': {
    en: 'Use recovery code instead',
    es: 'Usar código de recuperación en su lugar',
    fr: 'Utiliser le code de récupération à la place',
    de: 'Stattdessen Wiederherstellungscode verwenden',
    zh: '改用恢复代码',
    ja: '代わりに回復コードを使用',
    ko: '대신 복구 코드 사용',
    ar: 'استخدام رمز الاسترداد بدلاً من ذلك',
    pt: 'Usar código de recuperação',
    ru: 'Использовать код восстановления',
    hi: 'इसके बजाय पुनर्प्राप्ति कोड का उपयोग करें',
    it: 'Usa invece il codice di recupero',
  },
  'auth.lostAccessToAuthenticator': {
    en: 'Lost access to your authenticator?',
    es: '¿Perdiste el acceso a tu autenticador?',
    fr: 'Vous avez perdu l\'accès à votre authentificateur?',
    de: 'Zugriff auf Ihren Authentifikator verloren?',
    zh: '无法访问您的身份验证器？',
    ja: '認証アプリにアクセスできませんか？',
    ko: '인증 앱에 액세스할 수 없나요?',
    ar: 'فقدت الوصول إلى المصادقة الخاصة بك؟',
    pt: 'Perdeu o acesso ao seu autenticador?',
    ru: 'Потеряли доступ к аутентификатору?',
    hi: 'अपने प्रमाणक तक पहुंच खो दी?',
    it: 'Hai perso l\'accesso al tuo autenticatore?',
  },
  'auth.pleaseEnterValidCode': {
    en: 'Please enter a valid code',
    es: 'Por favor ingresa un código válido',
    fr: 'Veuillez entrer un code valide',
    de: 'Bitte geben Sie einen gültigen Code ein',
    zh: '请输入有效的代码',
    ja: '有効なコードを入力してください',
    ko: '유효한 코드를 입력하세요',
    ar: 'الرجاء إدخال رمز صالح',
    pt: 'Por favor, insira um código válido',
    ru: 'Пожалуйста, введите действительный код',
    hi: 'कृपया एक मान्य कोड दर्ज करें',
    it: 'Inserisci un codice valido',
  },
  'auth.signedInSuccessfully': {
    en: 'Signed in successfully',
    es: 'Sesión iniciada correctamente',
    fr: 'Connexion réussie',
    de: 'Erfolgreich angemeldet',
    zh: '登录成功',
    ja: 'サインインに成功しました',
    ko: '로그인 성공',
    ar: 'تم تسجيل الدخول بنجاح',
    pt: 'Login realizado com sucesso',
    ru: 'Вход выполнен успешно',
    hi: 'सफलतापूर्वक साइन इन किया गया',
    it: 'Accesso effettuato con successo',
  },
  'auth.invalidCode': {
    en: 'Invalid code',
    es: 'Código inválido',
    fr: 'Code invalide',
    de: 'Ungültiger Code',
    zh: '无效的代码',
    ja: '無効なコード',
    ko: '잘못된 코드',
    ar: 'رمز غير صالح',
    pt: 'Código inválido',
    ru: 'Неверный код',
    hi: 'अमान्य कोड',
    it: 'Codice non valido',
  },
  'auth.verificationFailed': {
    en: 'Verification failed',
    es: 'Verificación fallida',
    fr: 'Échec de la vérification',
    de: 'Verifizierung fehlgeschlagen',
    zh: '验证失败',
    ja: '確認に失敗しました',
    ko: '확인 실패',
    ar: 'فشل التحقق',
    pt: 'Falha na verificação',
    ru: 'Ошибка проверки',
    hi: 'सत्यापन विफल',
    it: 'Verifica fallita',
  },
  'auth.newCodeSent': {
    en: 'New code sent to your authenticator app',
    es: 'Nuevo código enviado a tu aplicación de autenticación',
    fr: 'Nouveau code envoyé à votre application d\'authentification',
    de: 'Neuer Code an Ihre Authentifizierungs-App gesendet',
    zh: '新代码已发送到您的身份验证应用程序',
    ja: '新しいコードが認証アプリに送信されました',
    ko: '새 코드가 인증 앱으로 전송되었습니다',
    ar: 'تم إرسال رمز جديد إلى تطبيق المصادقة الخاص بك',
    pt: 'Novo código enviado para seu aplicativo autenticador',
    ru: 'Новый код отправлен в ваше приложение аутентификации',
    hi: 'आपके प्रमाणक ऐप पर नया कोड भेजा गया',
    it: 'Nuovo codice inviato alla tua app di autenticazione',
  },
  'auth.failedToResendCode': {
    en: 'Failed to resend code',
    es: 'Error al reenviar el código',
    fr: 'Échec du renvoi du code',
    de: 'Fehler beim erneuten Senden des Codes',
    zh: '重新发送代码失败',
    ja: 'コードの再送信に失敗しました',
    ko: '코드 재전송 실패',
    ar: 'فشل إعادة إرسال الرمز',
    pt: 'Falha ao reenviar código',
    ru: 'Не удалось отправить код повторно',
    hi: 'कोड फिर से भेजने में विफल',
    it: 'Impossibile reinviare il codice',
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
  console.log('🔄 Adding 2FA keys...\n');
  
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
  
  console.log('\n✅ 2FA keys added successfully!');
}

addKeys();
