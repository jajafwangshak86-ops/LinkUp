import { View, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ExternalLink } from 'lucide-react-native';

const CONTRACTS = [
  { name: 'linkup-factory', desc: 'User registry' },
  { name: 'linkup-custody', desc: 'STX transfers' },
  { name: 'linkup-posts',   desc: 'Posts & tips' },
];
const DEPLOYER = 'SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7';

export function ContractInfo() {
  return (
    <View className="rounded-2xl bg-card p-4">
      <Text className="font-semibold mb-3">Deployed Contracts</Text>
      {CONTRACTS.map(c => (
        <TouchableOpacity
          key={c.name}
          onPress={() => Linking.openURL(`https://explorer.hiro.so/txid/${DEPLOYER}.${c.name}`)}
          className="flex-row items-center justify-between py-2 border-b border-border last:border-0"
        >
          <View>
            <Text className="text-sm font-medium">{c.name}</Text>
            <Text className="text-xs text-muted-foreground">{c.desc}</Text>
          </View>
          <Icon as={ExternalLink} size={14} className="text-purple-600" />
        </TouchableOpacity>
      ))}
    </View>
  );
}
