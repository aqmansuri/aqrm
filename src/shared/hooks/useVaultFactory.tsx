import { isPlatform } from '@ionic/react';
import { useMemo } from 'react';
import { BrowserVault, IdentityVaultConfig, Vault } from '@ionic-enterprise/identity-vault';

export const useVaultFactory = (config: IdentityVaultConfig) => {
  const vault = useMemo(() => {
    const vault = isPlatform('hybrid') ? new Vault(config) : new BrowserVault(config);
    return vault;
  }, [config]);

  return { vault };
};
