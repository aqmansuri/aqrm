import { useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider, PrivateRoute } from './core/auth';
import TeaPage from './tea/TeaPage';
import TeaDetailsPage from './tea/details/TeaDetailsPage';
import LoginPage from './login/LoginPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/global.css';

const App: React.FC = () => {
  useEffect(() => {
    if (isPlatform('capacitor')) {
      SplashScreen.hide();
    }
  }, []);

  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <PrivateRoute exact path="/tea" component={TeaPage} />
            <PrivateRoute path="/tea/details/:id" component={TeaDetailsPage} />
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/">
              <Redirect to="/tea" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
};

export default App;
