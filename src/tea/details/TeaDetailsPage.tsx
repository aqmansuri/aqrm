import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Tea } from '../../shared/models';
import { useTea } from '../useTea';

const TeaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTeaById } = useTea();
  const [tea, setTea] = useState<Tea | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const tea = await getTeaById(parseInt(id, 10));
      setTea(tea);
    })();
  }, [id, getTeaById]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tea" />
          </IonButtons>
          <IonTitle>Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding">
          <div className="ion-justify-content-center">
            <IonImg src={tea?.image} />
          </div>
          <h1>{tea?.name}</h1>
          <p>{tea?.description}</p>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default TeaDetailsPage;
