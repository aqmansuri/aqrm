import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { name, author, description, version } from '../../package.json';
import { useAuthentication } from '../core/auth';

const AboutPage: React.FC = () => {
  const { logout } = useAuthentication();
  const history = useHistory();

  const handleLogout = async () => {
    await logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>About Tea Taster</IonTitle>
          <IonButtons slot="end">
            <IonButton
              data-testid="logout-button"
              onClick={() => handleLogout()}
            >
              <IonIcon slot="icon-only" icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="main-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">About Tea Taster</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem>
            <IonLabel>Name</IonLabel>
            <IonNote slot="end">{name}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Description</IonLabel>
            <IonNote slot="end">{description}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Version</IonLabel>
            <IonNote slot="end">{version}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Author</IonLabel>
            <IonNote slot="end">{author.name}</IonNote>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
export default AboutPage;
