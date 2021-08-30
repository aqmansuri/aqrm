import { useIonModal } from '@ionic/react';
import React, { createContext, useCallback, useEffect, useReducer, useState } from 'react';
import { useVaultFactory } from '../../shared/hooks';
import { Session, UnlockMode } from '../models';
import { getUnlockModeConfiguration } from '../session-vault/getUnlockModeConfiguration';
import { PinDialog, config as vaultConfig, key } from '../session-vault';

interface AuthState {
  session?: Session;
  loading: boolean;
  error: string;
}

const initialState: AuthState = {
  session: undefined,
  loading: false,
  error: '',
};

export type AuthAction =
  | { type: 'CLEAR_SESSION' }
  | { type: 'RESTORE_SESSION'; session: Session }
  | { type: 'LOGIN' }
  | { type: 'LOGIN_SUCCESS'; session: Session }
  | { type: 'LOGIN_FAILURE'; error: string }
  | { type: 'LOGOUT' }
  | { type: 'LOGOUT_SUCCESS' }
  | { type: 'LOGOUT_FAILURE'; error: string };

const reducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'CLEAR_SESSION':
      return { ...state, session: undefined };
    case 'RESTORE_SESSION':
      return { ...state, session: action.session };
    case 'LOGIN':
      return { ...state, loading: true, error: '' };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, session: action.session };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.error };
    case 'LOGOUT':
      return { ...state, loading: true, error: '' };
    case 'LOGOUT_SUCCESS':
      return { ...state, loading: false, session: undefined };
    case 'LOGOUT_FAILURE':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

type PasscodeRequestCallback = (opts: { data: any; role?: string }) => void;
let handlePasscodeRequest: PasscodeRequestCallback = () => {};

export const AuthContext = createContext<{
  state: typeof initialState;
  dispatch: (action: AuthAction) => void;
  canUnlock: () => Promise<boolean>;
  clearSession: () => Promise<void>;
  getSession: () => Promise<Session | null>;
  setSession: (session: Session) => Promise<void>;
  setUnlockMode: (unlockMode: UnlockMode) => Promise<void>;
}>({
  state: initialState,
  dispatch: () => {},
  canUnlock: () => Promise.resolve(false),
  clearSession: () => Promise.resolve(),
  getSession: () => Promise.resolve(null),
  setSession: () => Promise.resolve(),
  setUnlockMode: () => Promise.resolve(),
});

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { vault } = useVaultFactory(vaultConfig);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSetPasscodeMode, setIsSetPasscodeMode] = useState<boolean>(false);

  const [present, dismiss] = useIonModal(PinDialog, {
    setPasscodeMode: isSetPasscodeMode,
    onDismiss: (opts: { data: any; role?: string }) => handlePasscodeRequest(opts),
  });

  vault.onLock(() => dispatch({ type: 'CLEAR_SESSION' }));

  vault.onPasscodeRequested(async (isSetPasscodeMode) => {
    return new Promise((resolve) => {
      handlePasscodeRequest = (opts: { data: any; role?: string }) => {
        if (opts.role === 'cancel') vault.setCustomPasscode('');
        else vault.setCustomPasscode(opts.data);
        setIsSetPasscodeMode(false);
        setShowModal(false);
        resolve();
      };

      setIsSetPasscodeMode(isSetPasscodeMode);
      setShowModal(true);
    });
  });

  const canUnlock = useCallback(async (): Promise<boolean> => {
    return (await vault.doesVaultExist()) && (await vault.isLocked());
  }, [vault]);

  const clearSession = async (): Promise<void> => {
    await setUnlockMode(UnlockMode.NeverLock);
    await vault.clear();
  };

  const getSession = useCallback(async (): Promise<Session | null> => {
    return await vault.getValue<Session>(key);
  }, [vault]);

  const setSession = async (session: Session): Promise<void> => {
    await vault.setValue<Session>(key, session);
  };

  const setUnlockMode = async (unlockMode: UnlockMode): Promise<void> => {
    const { type, deviceSecurityType } = getUnlockModeConfiguration(unlockMode);
    vault.updateConfig({ ...vault.config, type, deviceSecurityType });
  };

  useEffect(() => {
    showModal ? present() : dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const exists = await vault.doesVaultExist();
        if (!exists) throw new Error('Vault does not yet exist.');

        const session = await getSession();
        if (!session) throw new Error('Session not found.');

        dispatch({ type: 'RESTORE_SESSION', session });
      } catch (error) {
        dispatch({ type: 'CLEAR_SESSION' });
      }
    };
    restoreSession();
  }, [getSession, vault]);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        canUnlock,
        clearSession,
        getSession,
        setSession,
        setUnlockMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
