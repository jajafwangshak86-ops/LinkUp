#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCALES_DIR = join(__dirname, '../locales');

const NEW_KEYS: Record<string, Record<string, string>> = {
  'auth.verifyYourAccount': {
    en: 'Verify Your Account',
    es: 'Verifica tu cuenta',
    fr: 'Vérifiez votre compte',
    de: 'Verifizieren Sie Ihr Konto',
    zh: '验证您的账户',
    ja: 'アカウントを確認',
    ko: '계정 확인',
    ar: 'تحقق من حسابك',
    pt: 'Verifique sua conta',
    ru: 'Подтвердите свой аккаунт',
    hi: 'अपने खाते की पुष्टि करें',
    it: 'Verifica il tuo account',
  },
  'auth.verificationCodeSent': {
    en: 'A six-digit code was sent to your email, enter it below to confirm your account.',
    es: 'Se envió un código de seis dígitos a tu correo, ingrésalo a continuación para confirmar tu cuenta.',
    fr: 'Un code à six chiffres a été envoyé à votre email, entrez-le ci-dessous pour confirmer votre compte.',
    de: 'Ein sechsstelliger Code wurde an Ihre E-Mail gesendet. Geben Sie ihn unten ein, um Ihr Konto zu bestätigen.',
    zh: '六位数代码已发送到您的电子邮件，请在下方输入以确认您的账户。',
    ja: '6桁のコードがメールに送信されました。以下に入力してアカウントを確認してください。',
    ko: '6자리 코드가 이메일로 전송되었습니다. 아래에 입력하여 계정을 확인하세요.',
    ar: 'تم إرسال رمز مكون من ستة أرقام إلى بريدك الإلكتروني، أدخله أدناه لتأكيد حسابك.',
    pt: 'Um código de seis dígitos foi enviado para seu e-mail, insira-o abaixo para confirmar sua conta.',
    ru: 'Шестизначный код был отправлен на ваш email, введите его ниже, чтобы подтвердить свой аккаунт.',
    hi: 'आपके ईमेल पर छह अंकों का कोड भेजा गया है, अपने खाते की पुष्टि करने के लिए इसे नीचे दर्ज करें।',
    it: 'Un codice a sei cifre è stato inviato alla tua email, inseriscilo qui sotto per confermare il tuo account.',
  },
  'auth.enterCompleteCode': {
    en: 'Please enter the complete code',
    es: 'Por favor ingresa el código completo',
    fr: 'Veuillez entrer le code complet',
    de: 'Bitte geben Sie den vollständigen Code ein',
    zh: '请输入完整的代码',
    ja: '完全なコードを入力してください',
    ko: '전체 코드를 입력하세요',
    ar: 'الرجاء إدخال الرمز الكامل',
    pt: 'Por favor, insira o código completo',
    ru: 'Пожалуйста, введите полный код',
    hi: 'कृपया पूरा कोड दर्ज करें',
    it: 'Inserisci il codice completo',
  },
  'auth.emailNotFound': {
    en: 'Email not found. Please sign up again',
    es: 'Correo no encontrado. Por favor regístrate de nuevo',
    fr: 'Email non trouvé. Veuillez vous inscrire à nouveau',
    de: 'E-Mail nicht gefunden. Bitte melden Sie sich erneut an',
    zh: '未找到电子邮件。请重新注册',
    ja: 'メールが見つかりません。再度サインアップしてください',
    ko: '이메일을 찾을 수 없습니다. 다시 가입하세요',
    ar: 'البريد الإلكتروني غير موجود. يرجى التسجيل مرة أخرى',
    pt: 'E-mail não encontrado. Por favor, cadastre-se novamente',
    ru: 'Email не найден. Пожалуйста, зарегистрируйтесь снова',
    hi: 'ईमेल नहीं मिला। कृपया फिर से साइन अप करें',
    it: 'Email non trovata. Registrati di nuovo',
  },
  'auth.verify': {
    en: 'Verify',
    es: 'Verificar',
    fr: 'Vérifier',
    de: 'Verifizieren',
    zh: '验证',
    ja: '確認',
    ko: '확인',
    ar: 'تحقق',
    pt: 'Verificar',
    ru: 'Подтвердить',
    hi: 'सत्यापित करें',
    it: 'Verifica',
  },
  'auth.resend': {
    en: 'Resend',
    es: 'Reenviar',
    fr: 'Renvoyer',
    de: 'Erneut senden',
    zh: '重新发送',
    ja: '再送信',
    ko: '재전송',
    ar: 'إعادة إرسال',
    pt: 'Reenviar',
    ru: 'Отправить снова',
    hi: 'फिर से भेजें',
    it: 'Reinvia',
  },
  'auth.didntReceiveCode': {
    en: "Didn't receive the code?",
    es: '¿No recibiste el código?',
    fr: "Vous n'avez pas reçu le code?",
    de: 'Code nicht erhalten?',
    zh: '没有收到代码？',
    ja: 'コードが届きませんでしたか？',
    ko: '코드를 받지 못하셨나요?',
    ar: 'لم تتلق الرمز؟',
    pt: 'Não recebeu o código?',
    ru: 'Не получили код?',
    hi: 'कोड प्राप्त नहीं हुआ?',
    it: 'Non hai ricevuto il codice?',
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
  console.log('🔄 Adding verification keys...\n');
  
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
  
  console.log('\n✅ Verification keys added successfully!');
}

addKeys();
