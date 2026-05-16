import { Linking } from 'react-native';

/** Open a Stacks transaction in Hiro Explorer */
export const openTx = (txId: string) =>
  Linking.openURL(`https://explorer.hiro.so/txid/${txId}`);

/** Open a Stacks address in Hiro Explorer */
export const openAddress = (address: string) =>
  Linking.openURL(`https://explorer.hiro.so/address/${address}`);

/** Open a LinkUp contract in Hiro Explorer */
export const openContract = (name: 'linkup-factory' | 'linkup-custody' | 'linkup-posts') =>
  Linking.openURL(`https://explorer.hiro.so/txid/SP2F5Q3JWH4P5YV2S056W4PHZN2CWN00TDQRBX4J7.${name}`);
