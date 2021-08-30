import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { lockOpenOutline, logInOutline } from 'ionicons/icons';
import { useAuthentication } from '../core/auth';
import { UnlockMode } from '../core/models';
import { LoginForm } from './LoginForm';
import { UnlockModeToggle } from './UnlockModeToggle';

const LoginPage: React.FC = () => {
  const { login, session, error, canUnlock, restoreSession } = useAuthentication();
  const history = useHistory();
  const methods = useForm<{ email: string; password: string }>({
    mode: 'onChange',
  });
  const [canUnlockVault, setCanUnlockVault] = useState<boolean>(false);
  const [mode, setMode] = useState<UnlockMode>(UnlockMode.NeverLock);

  useEffect(() => {
    session && history.replace('/tabs');
  }, [session, history]);

  useEffect(() => {
    canUnlock().then(setCanUnlockVault);
  }, [canUnlock]);

  const handleLogin = async (data: { email: string; password: string }) => {
    await login(data.email, data.password, mode);
    methods.reset();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="main-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        {!canUnlockVault && (
          <>
            <IonList>
              <LoginForm control={methods.control} />
              <UnlockModeToggle mode={mode} setMode={setMode} />
            </IonList>
            <div className="error-message" data-testid="errors">
              <div>{methods.formState.errors.email?.type === 'required' && 'E-Mail Address is required'}</div>
              <div>{methods.formState.errors.email?.type === 'pattern' && methods.formState.errors.email.message}</div>
              <div>{methods.formState.errors.password?.type === 'required' && 'Password is required'}</div>
              {error && <div>{error}</div>}
            </div>
          </>
        )}
        {canUnlockVault && (
          <div className="unlock-app ion-text-center" onClick={() => restoreSession()}>
            <IonIcon icon={lockOpenOutline} />
            Unlock
          </div>
        )}
      </IonContent>
      <IonFooter>
        <IonToolbar color="secondary">
          {!canUnlockVault && (
            <IonButton
              expand="full"
              disabled={!methods.formState.isDirty || !methods.formState.isValid}
              onClick={methods.handleSubmit((data) => handleLogin(data))}
              data-testid="submit-button"
            >
              Sign In
              <IonIcon slot="end" icon={logInOutline} />
            </IonButton>
          )}
          {canUnlockVault && (
            <IonButton expand="full" onClick={() => setCanUnlockVault(false)}>
              Sign In Instead
            </IonButton>
          )}
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default LoginPage;
