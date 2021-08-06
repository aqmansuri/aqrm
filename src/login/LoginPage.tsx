import React, { useEffect } from 'react';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import { logInOutline } from 'ionicons/icons';
import { useAuthentication } from '../core/auth';

const LoginPage: React.FC = () => {
  const { login, session, error } = useAuthentication();
  const history = useHistory();
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm<{
    email: string;
    password: string;
  }>({ mode: 'onChange' });

  useEffect(() => {
    session && history.replace('/tabs');
  }, [session, history]);

  const handleLogin = async (data: { email: string; password: string }) => {
    await login(data.email, data.password);
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
        <form>
          <IonList>
            <IonItem>
              <IonLabel position="floating">E-Mail Address</IonLabel>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <IonInput
                    data-testid="email-input"
                    onIonChange={(e) => onChange(e.detail.value!)}
                    value={value}
                    type="email"
                  />
                )}
                control={control}
                name="email"
                rules={{
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'E-Mail Address must have a valid format',
                  },
                }}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <IonInput
                    data-testid="password-input"
                    onIonChange={(e) => onChange(e.detail.value!)}
                    value={value}
                    type="password"
                  />
                )}
                control={control}
                name="password"
                rules={{ required: true }}
              />
            </IonItem>
          </IonList>
          <div className="error-message" data-testid="errors">
            <div>{errors.email?.type === 'required' && 'E-Mail Address is required'}</div>
            <div>{errors.email?.type === 'pattern' && errors.email.message}</div>
            <div>{errors.password?.type === 'required' && 'Password is required'}</div>
            {error && <div>{error}</div>}
          </div>
        </form>
      </IonContent>
      <IonFooter>
        <IonToolbar color="secondary">
          <IonButton
            expand="full"
            disabled={!isDirty || !isValid}
            onClick={handleSubmit((data) => handleLogin(data))}
            data-testid="submit-button"
          >
            Sign In
            <IonIcon slot="end" icon={logInOutline} />
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default LoginPage;
