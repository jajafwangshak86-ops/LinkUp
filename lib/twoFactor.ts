import { storage } from './storage';

export const twoFactor = {
  /**
   * Check if 2FA is enabled for the user
   */
  async isEnabled(): Promise<boolean> {
    try {
      const enabled = await storage.get2FAEnabled();
      return enabled || false;
    } catch (error) {
      return false;
    }
  },

  /**
   * Enable 2FA
   */
  async enable(): Promise<void> {
    await storage.set2FAEnabled(true);
  },

  /**
   * Disable 2FA
   */
  async disable(): Promise<void> {
    await storage.set2FAEnabled(false);
    await storage.removeRecoveryCodes();
  },

  /**
   * Save recovery codes
   */
  async saveRecoveryCodes(codes: string[]): Promise<void> {
    await storage.saveRecoveryCodes(codes);
  },

  /**
   * Get recovery codes
   */
  async getRecoveryCodes(): Promise<string[] | null> {
    return await storage.getRecoveryCodes();
  },

  /**
   * Mark a recovery code as used
   */
  async useRecoveryCode(code: string): Promise<boolean> {
    const codes = await this.getRecoveryCodes();
    if (!codes) return false;

    const index = codes.indexOf(code);
    if (index === -1) return false;

    // Remove the used code
    codes.splice(index, 1);
    await this.saveRecoveryCodes(codes);
    return true;
  },

  /**
   * Check if recovery codes exist
   */
  async hasRecoveryCodes(): Promise<boolean> {
    const codes = await this.getRecoveryCodes();
    return codes !== null && codes.length > 0;
  },

  /**
   * Generate recovery codes (done on backend, this is just for display)
   */
  formatRecoveryCode(code: string): string {
    // Format as XXXX-XXXX for better readability
    return code.match(/.{1,4}/g)?.join('-') || code;
  },
};
