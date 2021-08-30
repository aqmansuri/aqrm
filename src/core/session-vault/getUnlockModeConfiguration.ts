import { VaultType, DeviceSecurityType } from '@ionic-enterprise/identity-vault';
import { UnlockMode } from '../models';

export const getUnlockModeConfiguration = (
  unlockMode: UnlockMode
): {
  type: VaultType;
  deviceSecurityType: DeviceSecurityType;
} => {
  switch (unlockMode) {
    case UnlockMode.Device:
      return {
        type: VaultType.DeviceSecurity,
        deviceSecurityType: DeviceSecurityType.Both,
      };
    case UnlockMode.SessionPIN:
      return {
        type: VaultType.CustomPasscode,
        deviceSecurityType: DeviceSecurityType.None,
      };
    case UnlockMode.ForceLogin:
      return {
        type: VaultType.InMemory,
        deviceSecurityType: DeviceSecurityType.None,
      };
    case UnlockMode.NeverLock:
      return {
        type: VaultType.SecureStorage,
        deviceSecurityType: DeviceSecurityType.None,
      };
    default:
      return {
        type: VaultType.SecureStorage,
        deviceSecurityType: DeviceSecurityType.None,
      };
  }
};
