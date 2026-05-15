import * as LocalAuthentication from 'expo-local-authentication';
import { storage } from './storage';

export const biometric = {
  /**
   * Check if biometric hardware is available on the device
   */
  async isAvailable(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      return compatible;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  },

  /**
   * Check if biometric authentication is enrolled (fingerprint/face registered)
   */
  async isEnrolled(): Promise<boolean> {
    try {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return enrolled;
    } catch (error) {
      console.error('Error checking biometric enrollment:', error);
      return false;
    }
  },

  /**
   * Get supported authentication types
   */
  async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      return types;
    } catch (error) {
      console.error('Error getting supported types:', error);
      return [];
    }
  },

  /**
   * Get human-readable name for biometric type
   */
  getBiometricName(types: LocalAuthentication.AuthenticationType[]): string {
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Fingerprint';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris';
    }
    return 'Biometric';
  },

  /**
   * Authenticate using biometrics
   */
  async authenticate(promptMessage?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || 'Authenticate to continue',
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error === 'user_cancel' ? 'Authentication cancelled' : 'Authentication failed' 
        };
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return { success: false, error: 'Authentication error occurred' };
    }
  },

  /**
   * Check if biometric is enabled for the app
   */
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await storage.getBiometricEnabled();
      return enabled || false;
    } catch (error) {
      return false;
    }
  },

  /**
   * Enable biometric authentication
   */
  async enableBiometric(): Promise<void> {
    await storage.setBiometricEnabled(true);
  },

  /**
   * Disable biometric authentication
   */
  async disableBiometric(): Promise<void> {
    await storage.setBiometricEnabled(false);
  },

  /**
   * Check if device supports biometric and user has enrolled
   */
  async canUseBiometric(): Promise<boolean> {
    const available = await this.isAvailable();
    const enrolled = await this.isEnrolled();
    return available && enrolled;
  },
};
