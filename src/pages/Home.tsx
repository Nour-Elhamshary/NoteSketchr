import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useState } from 'react';
import Editor from '../components/Editor';

const Home: React.FC = () => {
  /*Set the one usestate for editor mode. It's integer for enumeration purposes. 
  On the list of modes to switch:

  0 - Script
  1 - Preview
  
  */
  const [isInMode, setMode] = useState(0);

  //Set the two events to handle clicks.
  // const handleScriptClick = (clickEvent: Event) => {
  //   setMode(0);
  // }

  // const handlePreviewClick = (clickEvent: Event) => {
  //   setMode(1);
  // }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>NoteSketchr (VERY WIP)</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setMode(0)}>Script</IonButton>
            <IonButton onClick={() => setMode(1)}>Preview</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">NoteSketchr (VERY WIP)</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* <ExploreContainer /> */}
        <Editor mode={isInMode}></Editor>
      </IonContent>
    </IonPage>
  );
};

export default Home;
