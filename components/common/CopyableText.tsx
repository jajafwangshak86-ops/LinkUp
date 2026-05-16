import { TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { useClipboard } from '@/hooks/useClipboard';

interface CopyableTextProps {
  text: string;
  display?: string;
  className?: string;
}

export function CopyableText({ text, display, className }: CopyableTextProps) {
  const { copy, copied } = useClipboard();
  return (
    <TouchableOpacity onPress={() => copy(text, 'Copied!')} onLongPress={() => copy(text)}>
      <Text className={`${className ?? ''} ${copied ? 'opacity-60' : ''}`}>
        {copied ? 'Copied!' : (display ?? text)}
      </Text>
    </TouchableOpacity>
  );
}
