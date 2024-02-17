import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonMenu, IonMenuButton, IonItem, IonLabel } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useState, useRef, useEffect, useReducer } from 'react';
import Editor from '../components/Editor';
import { Directory, Encoding, FileInfo, Filesystem } from '@capacitor/filesystem';
import { Dialog } from '@capacitor/dialog';
import { menuController } from '@ionic/core/components';
import '../components/FileSystemHandler'
import { saveFile, loadNotesList, loadNote, saveSameFile, getNotesList } from '../components/FileSystemHandler';


const Home: React.FC = () => {
  /*Set the one usestate for editor mode. It's integer for enumeration purposes. 
  On the list of modes to switch:

  0 - Script
  1 - Preview
  
  */
  const [isInMode, setMode] = useState(0);
  
  //Try to input in files
  //First get a constant that handles an input element
  const inputFile = useRef<HTMLInputElement | null>(null);

  
  //Then get the file that is in the list.
  const [noteString, setNoteString] = useState('Attempting external 3.');
  var noteLoaded = false;

  let noteChild = useRef<HTMLTextAreaElement | null>(null);
  const [currentNoteIndex, setNoteIndex] = useState(0);
  const [ignored ,forceUpdate] = useReducer(x => x + 1, 0);

  const [listOfNotes, setListOfNotes] = useState<FileInfo[]>([]);
  async function asyncLoadNote(): Promise<void>{
        //Then it should provide either a file or no file. Check about it.
        if (inputFile.current?.files != null) {
          //There should at least be one file on this array if the condition is true.
          //So try to fetch it.
          var noteFile = inputFile.current?.files[0];
          var temp = await noteFile.text();
          
          setNoteString(temp);

          noteLoaded = true
  }
  }


  // async function saveFile(strToPut:string) {
  //   // create a new handle
  //   const newHandle = await window.showSaveFilePicker({
  //     types:[
  //       {
  //         description: "Text file",
  //         accept: { "text/plain": [".txt"] },
  //       },
  //     ]
  //   });
  


  //   // create a FileSystemWritableFileStream to write to
  //   const writableStream = await newHandle.createWritable();
    
  //   //Since we're dealing with string, we're going to do it as a blob
  //   const blob = new Blob([strToPut], {type : 'plain/text'});
    
  //   // write our file
  //   await writableStream.write(blob);
  
  //   // close the file and write the contents to disk.
  //   await writableStream.close();
  // }
  
  // async function saveFile(strToPut:string) {

  //   //Since we're dealing with string, we're going to do it as a blob
  //   const blob = new Blob([strToPut], {type : 'plain/text'});

  //   // Turn to blob url
  //   const blobUrl = URL.createObjectURL(blob);

  //   // Create a link element
  //   const link = document.createElement("a");

  //   // Set link's href to point to the Blob URL
  //   link.href = blobUrl;
  //   link.download = "note.txt";


  //   // Dispatch click event on the link
  //   // This is necessary as link.click() does not work on the latest firefox
  //   link.dispatchEvent(
  //     new MouseEvent('click', { 
  //       bubbles: true, 
  //       cancelable: true, 
  //       view: window 
  //     })
  //   );

  //   // Remove link from body
  //   document.body.removeChild(link);
  // }

  // async function saveFile() {

  //   //We will just create a new file as an attempt to get something

  //   const resultsomething = await Filesystem.writeFile({
  //     path: 'meowtest123.txt',
  //     data: 'This is a test 23232323232',
  //     directory: Directory.Documents,
  //     encoding: Encoding.UTF8,
  //   });

  //   console.log("It should save a secret file, sneaky!");


  //   await Dialog.alert({
  //     title: 'Saved!',
  //     message: 'It should be saved.',
  //   });
    
  //   // const contents = await Filesystem.readFile({
  //   //   path: 'secrets/meowtest123.txt',
  //   //   directory: Directory.Documents,
  //   //   encoding: Encoding.UTF8,
  //   // });
  
  //   // console.log('secrets:', contents);
  // };

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

  // const listNotes = Array.from({length: listOfNotes.length}, (_, index) => {
  //   return (
  //     <IonItem key={index}>
  //       <IonLabel>
  //         {listOfNotes.at(index)?.name}
  //       </IonLabel>
  //     </IonItem>
      
  //   )
  // });

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

            {/* This input element should be hidden, we are just using it as a way to upload. */}
            <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={() => asyncLoadNote()}/>

            {/* This is the actual button that does the input element's job. */}
            <IonButton fill="outline"onClick={() => inputFile.current?.click()}>Load a note</IonButton>
            <IonButton fill="outline" onClick={() => {
              saveFile(noteChild.current?.textContent)}
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
      <IonItem key={index} button onClick={async () => {getNotesList(); setNoteString(await loadNote(listOfNotes.at(index)?.name)); setNoteIndex(index)}}>
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
