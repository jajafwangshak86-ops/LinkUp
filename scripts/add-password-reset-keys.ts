#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCALES_DIR = join(__dirname, '../locales');

const NEW_KEYS: Record<string, Record<string, string>> = {
  'auth.newPassword': {
    en: 'New Password',
    es: 'Nueva contraseña',
    fr: 'Nouveau mot de passe',
    de: 'Neues Passwort',
    zh: '新密码',
    ja: '新しいパスワード',
    ko: '새 비밀번호',
    ar: 'كلمة مرور جديدة',
    pt: 'Nova senha',
    ru: 'Новый пароль',
    hi: 'नया पासवर्ड',
    it: 'Nuova password',
  },
  'auth.enterNewPassword': {
    en: 'Enter your new password below',
    es: 'Ingresa tu nueva contraseña a continuación',
    fr: 'Entrez votre nouveau mot de passe ci-dessous',
    de: 'Geben Sie Ihr neues Passwort unten ein',
    zh: '在下方输入您的新密码',
    ja: '以下に新しいパスワードを入力してください',
    ko: '아래에 새 비밀번호를 입력하세요',
    ar: 'أدخل كلمة المرور الجديدة أدناه',
    pt: 'Digite sua nova senha abaixo',
    ru: 'Введите новый пароль ниже',
    hi: 'नीचे अपना नया पासवर्ड दर्ज करें',
    it: 'Inserisci la tua nuova password qui sotto',
  },
  'auth.reenterPassword': {
    en: 'Re-enter your password',
    es: 'Vuelve a ingresar tu contraseña',
    fr: 'Ressaisissez votre mot de passe',
    de: 'Geben Sie Ihr Passwort erneut ein',
    zh: '重新输入您的密码',
    ja: 'パスワードを再入力してください',
    ko: '비밀번호를 다시 입력하세요',
    ar: 'أعد إدخال كلمة المرور',
    pt: 'Digite sua senha novamente',
    ru: 'Введите пароль еще раз',
    hi: 'अपना पासवर्ड फिर से दर्ज करें',
    it: 'Reinserisci la tua password',
  },
  'auth.passwordResetSuccess': {
    en: 'Password Reset!',
    es: '¡Contraseña restablecida!',
    fr: 'Mot de passe réinitialisé!',
    de: 'Passwort zurückgesetzt!',
    zh: '密码已重置！',
    ja: 'パスワードがリセットされました！',
    ko: '비밀번호가 재설정되었습니다!',
    ar: 'تم إعادة تعيين كلمة المرور!',
    pt: 'Senha redefinida!',
    ru: 'Пароль сброшен!',
    hi: 'पासवर्ड रीसेट हो गया!',
    it: 'Password reimpostata!',
  },
  'auth.passwordResetSuccessDesc': {
    en: 'Your password has been successfully reset. You can now sign in with your new password.',
    es: 'Tu contraseña se ha restablecido correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.',
    fr: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.',
    de: 'Ihr Passwort wurde erfolgreich zurückgesetzt. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.',
    zh: '您的密码已成功重置。您现在可以使用新密码登录。',
    ja: 'パスワードが正常にリセットされました。新しいパスワードでサインインできます。',
    ko: '비밀번호가 성공적으로 재설정되었습니다. 이제 새 비밀번호로 로그인할 수 있습니다.',
    ar: 'تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.',
    pt: 'Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.',
    ru: 'Ваш пароль был успешно сброшен. Теперь вы можете войти с новым паролем.',
    hi: 'आपका पासवर्ड सफलतापूर्वक रीसेट कर दिया गया है। अब आप अपने नए पासवर्ड से साइन इन कर सकते हैं।',
    it: 'La tua password è stata reimpostata con successo. Ora puoi accedere con la tua nuova password.',
  },
  'auth.checkYourEmail': {
    en: 'Check Your Email',
    es: 'Revisa tu correo',
    fr: 'Vérifiez votre email',
    de: 'Überprüfen Sie Ihre E-Mail',
    zh: '检查您的电子邮件',
    ja: 'メールを確認してください',
    ko: '이메일을 확인하세요',
    ar: 'تحقق من بريدك الإلكتروني',
    pt: 'Verifique seu e-mail',
    ru: 'Проверьте вашу почту',
    hi: 'अपना ईमेल जांचें',
    it: 'Controlla la tua email',
  },
  'auth.resetLinkSent': {
    en: "We've sent a password reset link to",
    es: 'Hemos enviado un enlace de restablecimiento a',
    fr: 'Nous avons envoyé un lien de réinitialisation à',
    de: 'Wir haben einen Zurücksetzungslink an gesendet',
    zh: '我们已向以下地址发送了密码重置链接',
    ja: 'パスワードリセットリンクを送信しました',
    ko: '비밀번호 재설정 링크를 다음 주소로 보냈습니다',
    ar: 'لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى',
    pt: 'Enviamos um link de redefinição de senha para',
    ru: 'Мы отправили ссылку для сброса пароля на',
    hi: 'हमने पासवर्ड रीसेट लिंक भेजा है',
    it: 'Abbiamo inviato un link di reimpostazione password a',
  },
  'auth.didntReceiveEmail': {
    en: "Didn't receive the email? Check your spam folder or try again in a few minutes.",
    es: '¿No recibiste el correo? Revisa tu carpeta de spam o intenta de nuevo en unos minutos.',
    fr: "Vous n'avez pas reçu l'email? Vérifiez votre dossier spam ou réessayez dans quelques minutes.",
    de: 'E-Mail nicht erhalten? Überprüfen Sie Ihren Spam-Ordner oder versuchen Sie es in ein paar Minuten erneut.',
    zh: '没有收到电子邮件？检查您的垃圾邮件文件夹或几分钟后重试。',
    ja: 'メールが届きませんでしたか？スパムフォルダを確認するか、数分後に再試行してください。',
    ko: '이메일을 받지 못하셨나요? 스팸 폴더를 확인하거나 몇 분 후에 다시 시도하세요.',
    ar: 'لم تتلق البريد الإلكتروني؟ تحقق من مجلد البريد العشوائي أو حاول مرة أخرى بعد بضع دقائق.',
    pt: 'Não recebeu o e-mail? Verifique sua pasta de spam ou tente novamente em alguns minutos.',
    ru: 'Не получили письмо? Проверьте папку со спамом или попробуйте снова через несколько минут.',
    hi: 'ईमेल प्राप्त नहीं हुआ? अपने स्पैम फ़ोल्डर की जांच करें या कुछ मिनटों में फिर से प्रयास करें।',
    it: 'Non hai ricevuto l\'email? Controlla la cartella spam o riprova tra qualche minuto.',
  },
  'auth.backToSignIn': {
    en: 'Back to Sign In',
    es: 'Volver a iniciar sesión',
    fr: 'Retour à la connexion',
    de: 'Zurück zur Anmeldung',
    zh: '返回登录',
    ja: 'サインインに戻る',
    ko: '로그인으로 돌아가기',
    ar: 'العودة إلى تسجيل الدخول',
    pt: 'Voltar para login',
    ru: 'Вернуться к входу',
    hi: 'साइन इन पर वापस जाएं',
    it: 'Torna al login',
  },
  'auth.tryDifferentEmail': {
    en: 'Try different email',
    es: 'Probar con otro correo',
    fr: 'Essayer un autre email',
    de: 'Andere E-Mail versuchen',
    zh: '尝试其他电子邮件',
    ja: '別のメールを試す',
    ko: '다른 이메일 시도',
    ar: 'جرب بريدًا إلكترونيًا آخر',
    pt: 'Tentar outro e-mail',
    ru: 'Попробовать другой email',
    hi: 'अलग ईमेल आज़माएं',
    it: 'Prova un\'altra email',
  },
  'auth.pleaseEnterEmail': {
    en: 'Please enter your email',
    es: 'Por favor ingresa tu correo',
    fr: 'Veuillez entrer votre email',
    de: 'Bitte geben Sie Ihre E-Mail ein',
    zh: '请输入您的电子邮件',
    ja: 'メールアドレスを入力してください',
    ko: '이메일을 입력하세요',
    ar: 'الرجاء إدخال بريدك الإلكتروني',
    pt: 'Por favor, digite seu e-mail',
    ru: 'Пожалуйста, введите ваш email',
    hi: 'कृपया अपना ईमेल दर्ज करें',
    it: 'Inserisci la tua email',
  },
  'auth.pleaseFillAllFields': {
    en: 'Please fill in all fields',
    es: 'Por favor completa todos los campos',
    fr: 'Veuillez remplir tous les champs',
    de: 'Bitte füllen Sie alle Felder aus',
    zh: '请填写所有字段',
    ja: 'すべてのフィールドを入力してください',
    ko: '모든 필드를 입력하세요',
    ar: 'يرجى ملء جميع الحقول',
    pt: 'Por favor, preencha todos os campos',
    ru: 'Пожалуйста, заполните все поля',
    hi: 'कृपया सभी फ़ील्ड भरें',
    it: 'Compila tutti i campi',
  },
  'auth.passwordMinLength': {
    en: 'Password must be at least 8 characters',
    es: 'La contraseña debe tener al menos 8 caracteres',
    fr: 'Le mot de passe doit contenir au moins 8 caractères',
    de: 'Das Passwort muss mindestens 8 Zeichen lang sein',
    zh: '密码必须至少为8个字符',
    ja: 'パスワードは8文字以上である必要があります',
    ko: '비밀번호는 최소 8자 이상이어야 합니다',
    ar: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل',
    pt: 'A senha deve ter pelo menos 8 caracteres',
    ru: 'Пароль должен содержать не менее 8 символов',
    hi: 'पासवर्ड कम से कम 8 वर्णों का होना चाहिए',
    it: 'La password deve contenere almeno 8 caratteri',
  },
  'auth.passwordsDoNotMatch': {
    en: 'Passwords do not match',
    es: 'Las contraseñas no coinciden',
    fr: 'Les mots de passe ne correspondent pas',
    de: 'Passwörter stimmen nicht überein',
    zh: '密码不匹配',
    ja: 'パスワードが一致しません',
    ko: '비밀번호가 일치하지 않습니다',
    ar: 'كلمات المرور غير متطابقة',
    pt: 'As senhas não coincidem',
    ru: 'Пароли не совпадают',
    hi: 'पासवर्ड मेल नहीं खाते',
    it: 'Le password non corrispondono',
  },
  'auth.passwordResetSuccessToast': {
    en: 'Password reset successfully',
    es: 'Contraseña restablecida correctamente',
    fr: 'Mot de passe réinitialisé avec succès',
    de: 'Passwort erfolgreich zurückgesetzt',
    zh: '密码重置成功',
    ja: 'パスワードが正常にリセットされました',
    ko: '비밀번호가 성공적으로 재설정되었습니다',
    ar: 'تم إعادة تعيين كلمة المرور بنجاح',
    pt: 'Senha redefinida com sucesso',
    ru: 'Пароль успешно сброшен',
    hi: 'पासवर्ड सफलतापूर्वक रीसेट किया गया',
    it: 'Password reimpostata con successo',
  },
  'auth.failedToResetPassword': {
    en: 'Failed to reset password',
    es: 'Error al restablecer la contraseña',
    fr: 'Échec de la réinitialisation du mot de passe',
    de: 'Fehler beim Zurücksetzen des Passworts',
    zh: '重置密码失败',
    ja: 'パスワードのリセットに失敗しました',
    ko: '비밀번호 재설정 실패',
    ar: 'فشل إعادة تعيين كلمة المرور',
    pt: 'Falha ao redefinir senha',
    ru: 'Не удалось сбросить пароль',
    hi: 'पासवर्ड रीसेट करने में विफल',
    it: 'Impossibile reimpostare la password',
  },
  'auth.passwordResetEmailSent': {
    en: 'Password reset email sent',
    es: 'Correo de restablecimiento enviado',
    fr: 'Email de réinitialisation envoyé',
    de: 'Zurücksetzungs-E-Mail gesendet',
    zh: '密码重置邮件已发送',
    ja: 'パスワードリセットメールを送信しました',
    ko: '비밀번호 재설정 이메일 전송됨',
    ar: 'تم إرسال بريد إعادة تعيين كلمة المرور',
    pt: 'E-mail de redefinição de senha enviado',
    ru: 'Письмо для сброса пароля отправлено',
    hi: 'पासवर्ड रीसेट ईमेल भेजा गया',
    it: 'Email di reimpostazione password inviata',
  },
  'auth.failedToSendResetEmail': {
    en: 'Failed to send reset email',
    es: 'Error al enviar el correo',
    fr: "Échec de l'envoi de l'email",
    de: 'Fehler beim Senden der E-Mail',
    zh: '发送重置邮件失败',
    ja: 'メールの送信に失敗しました',
    ko: '이메일 전송 실패',
    ar: 'فشل إرسال البريد الإلكتروني',
    pt: 'Falha ao enviar e-mail',
    ru: 'Не удалось отправить письмо',
    hi: 'ईमेल भेजने में विफल',
    it: 'Impossibile inviare email',
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
  console.log('🔄 Adding password reset keys...\n');
  
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
  
  console.log('\n✅ Password reset keys added successfully!');
}

addKeys();
