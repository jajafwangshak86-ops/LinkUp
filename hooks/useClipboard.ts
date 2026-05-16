import { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { toast } from 'sonner-native';

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string, label = 'Copied!') => {
    await Clipboard.setStringAsync(text);
    toast.success(label);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const paste = async (): Promise<string> => {
    return Clipboard.getStringAsync();
  };

  return { copy, paste, copied };
}
