import { getTxExplorerUrl } from '@/lib/stacks-config';
import * as Linking from 'expo-linking';

export function useStacksExplorer() {
  const openTx = (txId: string) => {
    Linking.openURL(getTxExplorerUrl(txId));
  };
  return { openTx };
}
