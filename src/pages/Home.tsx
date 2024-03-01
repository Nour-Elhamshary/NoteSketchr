import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonMenu, IonItem, IonLabel } from '@ionic/react';
import './Home.css';
import { createContext, useState, useRef } from 'react';
import Editor from '../components/Editor';
import Header from '@editorjs/header';
import {FileInfo } from '@capacitor/filesystem';


import { menuController } from '@ionic/core/components';
import '../components/FileSystemHandler'
import { loadNotesList, loadNote, saveSameFile, getNotesList, SaveFile, loadNoteInString } from '../components/FileSystemHandler';
import EditorJS, { InlineToolConstructable } from '@editorjs/editorjs';

//Create an interface for the context
interface EC {
  altEditor: any
}

export const EditorContext = createContext<EC>({} as EC);

const Home: React.FC = () => {
  /*Set the one usestate for editor mode. It's integer for enumeration purposes. 
  On the list of modes to switch:

  0 - Script
  1 - Preview
  
  */
  const [isInMode, setMode] = useState(0);
  const initEditorCalled = useRef(false);
  
  //Try to input in files
  //First get a constant that handles an input element
  const inputFile = useRef<HTMLInputElement | null>(null);
  
  //Editor React State
  const [altEditor] = useState(new EditorJS({
    holder:'editorjs',

    tools: {
      header: Header
    }
  }));


  
  //Then get the file that is in the list.
  const [noteString, setNoteString] = useState('Attempting external 3.');
  var noteLoaded = false;

  let noteChild = useRef<HTMLTextAreaElement | null>(null);
  const [currentNoteIndex, setNoteIndex] = useState(0);

  const [listOfNotes, setListOfNotes] = useState<FileInfo[]>([]);
  async function asyncLoadNote(): Promise<void>{
        //Then it should provide either a file or no file. Check about it.
        if (inputFile.current?.files != null) {
          //There should at least be one file on this array if the condition is true.
          //So try to fetch it.
          var noteFile = inputFile.current?.files[0];
          let temp = await noteFile.text();
          
          console.log(temp);
          await loadNoteInString(temp, altEditor);
          inputFile.current.files = null;
          inputFile.current.value = '';
    }

      

  }


  async function openOptionsMenu() {
    /**
     * Open the menu by menu-id
     * We refer to the menu using an ID
     * because multiple "start" menus exist.
     */
    await menuController.open('options-menu');
  }

  async function openNotesMenu() {
    /**
     * Open the menu by menu-id
     * We refer to the menu using an ID
     * because multiple "start" menus exist.
     */
    await loadNotesList().then(result => {
      setListOfNotes(getNotesList());
    });
    await menuController.open('notes-menu');

  }

  return (
    <>

    <IonMenu contentId="main-content" menuId="options-menu">
      <IonHeader>

          <IonToolbar>
            <IonTitle>Options</IonTitle>
          </IonToolbar>
          
        </IonHeader>
        <IonContent>
        <div className="buttons-options">
            <IonButton fill="outline" onClick={() => setMode(0)}>Script</IonButton>
            <IonButton fill="outline" onClick={() => setMode(1)}>Preview</IonButton>
            <IonButton fill="outline" onClick={() => setMode(2)}>Alt Script</IonButton>
            {/* This input element should be hidden, we are just using it as a way to upload. */}
            <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={() => asyncLoadNote()}/>


            {/* This is the actual button that does the input element's job. */}
            <IonButton fill="outline"onClick={() => inputFile.current?.click()}>Load a note</IonButton>
            
            <IonButton fill="outline" onClick={() => {
              SaveFile(noteChild.current?.textContent, altEditor)}
            }>Save a note</IonButton>
            
            <IonButton fill="outline" onClick={() => {
              saveSameFile(noteChild.current?.textContent, currentNoteIndex)}
            }>Save the current note</IonButton>

        </div>
        </IonContent>
      </IonMenu>

      <IonMenu contentId="main-content" menuId="notes-menu">
      <IonHeader>
          <IonToolbar>
            <IonTitle>Notes</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">This is the notes content.

        {Array.from({length: listOfNotes.length}, (_, index) => {

    return (
      <IonItem key={index} button onClick={async () => {getNotesList(); await loadNote(listOfNotes.at(index)?.name, altEditor); setNoteIndex(index)}}>
        <IonLabel>
          {listOfNotes.at(index)?.name}
        </IonLabel>
      </IonItem>
      
    )
  })}
        </IonContent>
      </IonMenu>
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar>
          
          <IonTitle>NoteSketchr (VERY WIP)</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={openOptionsMenu}>Options</IonButton>
            <IonButton onClick={openNotesMenu}>Notes</IonButton>
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
        <Editor mode={isInMode} stringOfNote={noteString} checkNoteLoad={noteLoaded} forwardedRef={noteChild}></Editor>
      </IonContent>
    </IonPage>

    </>
  );
};

export default Home;
