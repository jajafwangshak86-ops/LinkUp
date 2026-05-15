import { Modal, View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { useState } from 'react';
import { toast } from 'sonner-native';
import { useTranslation } from 'react-i18next';

interface BuyTokenModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  tokenPrice: number;
  isSubmitting: boolean;
}

export function BuyTokenModal({
  visible,
  onClose,
  onSubmit,
  tokenPrice,
  isSubmitting,
}: BuyTokenModalProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    const tokenAmount = parseInt(amount);
    if (!amount || tokenAmount <= 0) {
      toast.error(t('errors.invalidAmount'));
      return;
    }
    onSubmit(tokenAmount);
    setAmount('');
  };

  const totalCost = amount ? (parseInt(amount) * tokenPrice).toFixed(4) : '0';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50 p-4">
        <View className="w-full max-w-sm rounded-2xl bg-background p-6">
          <Text className="text-xl font-bold">{t('feed.buy')} {t('common.post')} {t('wallet.tokens')}</Text>
          <Text className="mt-2 text-sm text-muted-foreground">
            {t('wallet.price')}: {tokenPrice} SOL {t('wallet.perToken')}
          </Text>

          <View className="mt-4">
            <Text className="mb-2 text-sm font-medium">{t('wallet.numberOfTokens')}</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="10"
              keyboardType="numeric"
              className="rounded-lg border border-border bg-background px-4 py-3 text-foreground"
            />
            {amount && (
              <Text className="mt-2 text-sm text-muted-foreground">
                {t('wallet.total')}: {totalCost} SOL
              </Text>
            )}
          </View>

          <View className="mt-6 flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 rounded-xl border border-border py-3"
            >
              <Text className="text-center font-semibold">{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-purple-600 py-3"
            >
              <Text className="text-center font-semibold text-white">
                {isSubmitting ? t('wallet.buying') : t('feed.buy')} {t('wallet.tokens')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
