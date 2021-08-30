import { IdentityVaultConfig, VaultType, DeviceSecurityType } from '@ionic-enterprise/identity-vault';

export const config: IdentityVaultConfig = {
  key: 'io.ionic.teataster.sessionVault',
  type: VaultType.SecureStorage,
  deviceSecurityType: DeviceSecurityType.None,
  lockAfterBackgrounded: 2000,
  shouldClearVaultAfterTooManyFailedAttempts: true,
  customPasscodeInvalidUnlockAttempts: 2,
  unlockVaultOnLoad: false,
};

export const key = 'session';
