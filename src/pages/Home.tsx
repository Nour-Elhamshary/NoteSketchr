import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { useState, useRef, useEffect } from 'react';
import Editor from '../components/Editor';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import {FileOpener} from '@ionic-native/file-opener'




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
  const [noteString, setNoteString] = useState('This is a test');
  var noteLoaded = false;

  let noteChild = useRef<HTMLTextAreaElement | null>(null);

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

  async function saveFile(strToPut:string) {
    // await Filesystem.writeFile({
    //   path: 'secrets/text.txt',
    //   data: 'This is a test',
    //   directory: Directory.Documents,
    //   encoding: Encoding.UTF8,
    // });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>NoteSketchr (VERY WIP)</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setMode(0)}>Script</IonButton>
            <IonButton onClick={() => setMode(1)}>Preview</IonButton>

            {/* This input element should be hidden, we are just using it as a way to upload. */}
            <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={() => asyncLoadNote()}/>

            {/* This is the actual button that does the input element's job. */}
            <IonButton onClick={() => inputFile.current?.click()}>Load a note</IonButton>
            <IonButton onClick={() => {
              if (noteChild.current != null && noteChild.current.value != undefined) saveFile(noteChild.current.value)}
            }>Save a note</IonButton>
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
  );
};

export default Home;
