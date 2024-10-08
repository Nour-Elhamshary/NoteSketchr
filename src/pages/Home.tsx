import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonMenu, IonItem, IonLabel, IonToggle } from '@ionic/react';
import './Home.css';
import { createContext, useState, useRef, useEffect } from 'react';
import Editor from '../components/Editor/Editor';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import {FileInfo } from '@capacitor/filesystem';
import type { ToggleCustomEvent } from '@ionic/react';
import '../theme/variables.css'
import { menuController } from '@ionic/core/components';
import ToDoListEJS from '../components/TodoList/EditorJSToDoList'
import '../components/DataHandling/FileSystemHandler'
import { loadNotesList, loadNote, saveSameFile, getNotesList, SaveFile, loadNoteInString, newNote } from '../components/DataHandling/FileSystemHandler';
import EditorJS, { InlineToolConstructable } from '@editorjs/editorjs';
import SimpleImage from 'simple-image-editorjs'

//Create an interface for the context


const Home: React.FC = () => {
  /*Set the one usestate for editor mode. It's integer for enumeration purposes. 
  On the list of modes to switch:

  0 - Editor
  1 - Dictaphone
  
  */

  //Toggle for dark mode
  const [themeToggle, setThemeToggle] = useState(false);


  // Listen for the toggle check/uncheck to toggle the dark theme
  const toggleChange = (ev: ToggleCustomEvent) => {
    toggleDarkTheme(ev.detail.checked);
  };

  // Add or remove the "dark" class on the document body
  const toggleDarkTheme = (shouldAdd: boolean) => {
    document.body.classList.toggle('dark', shouldAdd);


    const logoElement = document.getElementById("logoID");

    if (shouldAdd) {
      logoElement?.classList.remove("logoBright");
      logoElement?.classList.add("logoDark");

    }
    else if (!shouldAdd){
      logoElement?.classList.remove("logoDark");
      logoElement?.classList.add("logoBright");

    }
  };

  // Check/uncheck the toggle and update the theme based on isDark
  const initializeDarkTheme = (isDark: boolean) => {
    setThemeToggle(isDark);
    toggleDarkTheme(isDark);
  };


  const ejInstance = useRef<EditorJS>();
  

  useEffect(() => {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Initialize the dark theme based on the initial
    // value of the prefers-color-scheme media query
    initializeDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) => initializeDarkTheme(mediaQuery.matches));
    
    //We then try to load the editorJS itself.
    

      if (!ejInstance.current) {
        const editor = new EditorJS({
          holder:'editorjs',
          tools: {
            header: Header,
            image: SimpleImage,
            todolist: {
              class: ToDoListEJS
            }
          },
          minHeight:200,
          onChange: (api, event) => {
            //UpdateMDFormatting(altEditor);
          }
        })

        ejInstance.current = editor;
      }

      return () => {
        if (ejInstance.current) {
          ejInstance.current.destroy();
        }
      }


    


    

  }, []);

  

    
  var editorElement = document.getElementById("editorjs");


  
  const [isInMode, setMode] = useState(0);
  
  //Try to input in files
  //First get a constant that handles an input element
  const inputFile = useRef<HTMLInputElement | null>(null);
  

  
  //Then get the file that is in the list.
  const [noteString, setNoteString] = useState('Attempting external 3.');
  var noteLoaded = false;

  let noteChild = useRef<HTMLTextAreaElement | null>(null);
  const [currentNoteIndex, setNoteIndex] = useState(0);

  const [listOfNotes, setListOfNotes] = useState<FileInfo[]>([]);



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

  (document.getElementById("editorjs")) ? console.log("true") : console.log("false");
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
            <IonItem>
            <IonToggle checked={themeToggle} onIonChange={toggleChange} justify="space-between">
              Dark Mode
            </IonToggle>
            </IonItem>
            <IonButton fill="outline" onClick={() => {if (ejInstance.current != undefined) newNote(ejInstance.current)}}>New Note</IonButton>

            <IonButton fill="outline" onClick={() => {
              if (ejInstance.current != undefined) SaveFile(ejInstance.current, "json")}
            }>Save a note in JSON</IonButton>

            <IonButton fill="outline" onClick={() => {
              if (ejInstance.current != undefined) SaveFile(ejInstance.current, "md")}
            }>Save a note in MD</IonButton>

            <IonButton fill="outline" onClick={() => {
              saveSameFile(noteChild.current?.textContent, currentNoteIndex)}
            }>Save the current note</IonButton>

            <IonButton fill="outline"onClick={() => setMode(0)}>Editor View</IonButton>
            
            <IonButton fill="outline"onClick={() => setMode(1)}>Dictaphone View</IonButton>

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
      <IonItem key={index} button onClick={async () => {getNotesList(); if (ejInstance.current != undefined) {await loadNote(listOfNotes.at(index)?.name, ejInstance.current);} setNoteIndex(index)}}>
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
          <IonButtons slot="start">
          <IonButton onClick={openOptionsMenu}>Options</IonButton>
          </IonButtons>
        <IonTitle>
          <img 
                      src="src/assets/logo.svg"
                      width="150em"  
                      id="logoID"
          />
                    
          </IonTitle>

          <IonButtons slot="end">
            
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
