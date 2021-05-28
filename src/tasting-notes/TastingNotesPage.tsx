import { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
} from '@ionic/react';
import { Share } from '@capacitor/share';
import TastingNoteEditor from './editor/TastingNoteEditor';
import { add, share, trashBin } from 'ionicons/icons';
import { useTastingNotes } from './useTastingNotes';
import { TastingNote } from '../shared/models';

const TastingNotesPage: React.FC = () => {
  const { getNotes, deleteNote } = useTastingNotes();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [notes, setNotes] = useState<TastingNote[]>([]);
  const [selectedNote, setSelectedNote] =
    useState<TastingNote | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const notes = await getNotes();
      setNotes(notes.reverse());
    })();
  }, [getNotes]);

  const handleOnDismiss = async (refresh: boolean) => {
    setShowModal(false);
    setSelectedNote(undefined);
    if (refresh) {
      const notes = await getNotes();
      setNotes(notes.reverse());
    }
  };

  const handleUpdateNote = (note: TastingNote) => {
    setSelectedNote(note);
    setShowModal(true);
  };

  const handleNewNote = () => {
    setSelectedNote(undefined);
    setShowModal(true);
  };

  const handleDeleteNote = async (id: number) => {
    await deleteNote(id);
    const notes = await getNotes();
    setNotes(notes.reverse());
  };

  const handleShareNote = async (note: TastingNote) => {
    const { brand, name, rating, notes } = note;
    await Share.share({
      title: `${brand}: ${name}`,
      text: `${notes} Rated ${rating}/5 stars`,
      dialogTitle: `Share ${name}'s tasting note`,
      url: 'https://tea-taster-training.web.app',
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tasting Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="main-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tasting Notes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {notes.map((note, idx) => (
            <IonItemSliding key={idx}>
              <IonItem
                data-testid={`note${idx}`}
                onClick={() => handleUpdateNote(note)}
              >
                <IonLabel>
                  <div>{note.brand}</div>
                  <div>{note.name}</div>
                </IonLabel>
              </IonItem>
              <IonItemOptions>
                <IonItemOption
                  data-testid={`share${idx}`}
                  color="secondary"
                  onClick={() => handleShareNote(note)}
                  slot="icon-only"
                >
                  <IonIcon icon={share} />
                </IonItemOption>
                <IonItemOption
                  color="danger"
                  onClick={() => {
                    handleDeleteNote(note.id!);
                  }}
                >
                  <IonIcon icon={trashBin} />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            data-testid="fab-button"
            onClick={() => handleNewNote()}
          >
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonModal isOpen={showModal}>
          <TastingNoteEditor
            onDismiss={({ refresh }) => handleOnDismiss(refresh)}
            note={selectedNote}
          />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};
export default TastingNotesPage;
