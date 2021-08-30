import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { Device } from '@ionic-enterprise/identity-vault';
import { UnlockMode } from '../core/models';

interface UnlockModeToggleProps {
  mode: UnlockMode;
  setMode: Dispatch<SetStateAction<UnlockMode>>;
}

export const UnlockModeToggle: React.FC<UnlockModeToggleProps> = ({ mode, setMode }) => {
  const [hasDeviceSecurity, setHasDeviceSecurity] = useState<boolean>(false);

  useEffect(() => {
    Device.isSystemPasscodeSet().then(setHasDeviceSecurity);
  }, []);

  return (
    <IonItem>
      <IonLabel position="floating">Session Locking</IonLabel>
      <IonSelect onIonChange={(e) => setMode(e.detail.value! as UnlockMode)} value={mode}>
        {hasDeviceSecurity && <IonSelectOption value={UnlockMode.Device}>Device Security</IonSelectOption>}
        <IonSelectOption value={UnlockMode.SessionPIN}>Session PIN Unlock</IonSelectOption>
        <IonSelectOption value={UnlockMode.NeverLock}>Never Lock Session</IonSelectOption>
        <IonSelectOption value={UnlockMode.ForceLogin}>Force Login</IonSelectOption>
      </IonSelect>
    </IonItem>
  );
};
