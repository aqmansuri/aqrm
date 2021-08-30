import React from 'react';
import { IonItem, IonLabel, IonInput } from '@ionic/react';
import { Controller, Control } from 'react-hook-form';

interface LoginFormProps {
  control: Control<{
    email: string;
    password: string;
  }>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ control }) => (
  <form>
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
  </form>
);
