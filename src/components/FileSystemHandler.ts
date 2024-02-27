import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';
import { Directory, Encoding, FileInfo, Filesystem } from '@capacitor/filesystem';
import {EditorContext} from "../pages/Home"
import { useContext } from 'react';
import EditorJS from '@editorjs/editorjs';
import Markdown from 'react-markdown';
//Constants.
const NOTES_DIR = 'notesketchr';
const MainDirectory = Directory.Documents;



//Arrays
let notesList: FileInfo[] = [];

export async function loadNote(noteFileName:any): Promise<any>;
export async function loadNote(noteFileName:any, editor:any): Promise<any>;
export async function loadNote(noteFileName: any, editor?:any): Promise<string>{
    let temp = "";
    let temp2;
    console.log(noteFileName);
    if (noteFileName != undefined) {
        const contents = await Filesystem.readFile({
            path: `${NOTES_DIR}/${noteFileName}`,
            directory: MainDirectory,
            encoding: Encoding.UTF8
        }).then(result => {temp = result.data.toString()})
    }

    var editorElement = document.getElementById("editorjs");
    if (editorElement != null && editor != undefined) {
        console.log("should be loading.");
        temp2 = MarkdownToJSON(temp);
        //First, delete everything in there.
        for (var i = editor.blocks.getBlocksCount() -1 ; i >= 0; i--) {
            await editor.blocks.delete(i);
        }
        
        //And then add in the new information.
        for (var i = 0; i < temp2.length; i++) {
        editor.blocks.insert("paragraph", {text: temp2[i]}) 
        }
    }



    console.log(temp);
    return temp;

}
export async function loadNotesList() {
    

    await Filesystem.readdir({
        directory : MainDirectory,
        path: NOTES_DIR
    }).then(
        result => {
            console.log('List: ', result)
            notesList = result.files;
        },

        async err => {
            console.log('Error found: ', err);
            console.log('Attempting to create the folder...')
            await Filesystem.mkdir({
                path: NOTES_DIR,
                directory: MainDirectory
            });

            await Dialog.alert({
                title: 'Error!',
                message: 'Error has occured while loading notes, may be a directory problem. A new directory should be added now.',
            });

        }
    )

}

export function getNotesList(): FileInfo[] {
    return notesList
}


/*
JSON parsing functions to convert to Markdown and vice versa.
*/

export function JSONToMarkdown(JSONData: any): string {
    let outputString = "";

    console.log(JSONData.blocks);

    for (let i = 0; i < JSONData.blocks.length; i++) {
        //console.log(JSONData.blocks[i].type);
        switch (JSONData.blocks[i].type) {
            case 'paragraph':
                outputString += JSONData.blocks[i].data.text + `\n`;
            break;
            default:
            break;
        }

        

    }

    //Check if there's any bold/italics that happened around here.
    //For bold
    outputString = outputString.replace(/<b>/g, "**");
    outputString = outputString.replace(/<\/b>/g, "**");
    //For italics
    outputString = outputString.replace(/<i>/g, "*");
    outputString = outputString.replace(/<\/i>/g, "*");

    //Deal with other HTML symbols.
    outputString = outputString.replace(/&nbsp;/g, " ");

    console.log(outputString);
    return outputString;

}

export function MarkdownToJSON(StringData: string): any {
    let data = StringData;
    //Replace the bold/italics stuff to HTML tags accordingly.
    //For bold
    data = data.replace(/(\*\*)/gm, "<b>"); //Replace first ** on every word with <b> tag
    data = data.replace(/<b>(?!\b)/gm, "</b>"); //basically, check for the second <b> and then change it to closing tag

    //Bold should be taken care of, so concentrate on italics.
    data = data.replace(/\*/gm, "<i>");
    data = data.replace(/<i>(?!\b)/gm, "</i>");
    console.log(data);
    let strings = data.split(/\n/);
    return strings;
}
 
/* 
Saving file. It should check on which platform we are working on, and then execute the saving in a different way.
For now, we are going to deal through mobile, which means we get to deal with Capacitor's filesystem functions.
*/

//Save the file if there are no index provided (basically saving a new file)

export async function SaveFile(noteString:any): Promise<any>;
export async function SaveFile(noteString:any, editor:any): Promise<any>;
export async function SaveFile(noteString:any, editor?:any) {
    console.log("Check that the function saveFile() even works.");

        let stringToSave = null;
        //Temporary injection
        //Check if there's an element with id "editorjs"
        var editorElement = document.getElementById("editorjs");
        console.log(editorElement);
        console.log(editor);
        if (editorElement != null && editor != undefined) {

            // Change the noteString to the element that is inside it.
            
             noteString = await editor.save().then((outputData: any) => {
                 //console.log('Article data: ', outputData)
                 stringToSave = JSONToMarkdown(outputData);
                 MarkdownToJSON(stringToSave);
               }).catch((error: any) => {
                 console.log('Saving failed: ', error)
               });
        }
        

    //Do NOT save if noteString is either null or undefined.
    if (stringToSave != null && stringToSave != undefined) {
        let fileName = "";
        //We attempt to save the file into the designated directory.
        //First, prompt the user to set the name. If not,
        //It'll be saved as a random date.
         const { value, cancelled } = await Dialog.prompt({
               title: 'Set name',
               message: `Set the name of the note. If cancelled, it'll be set in a random name.`,
         })
         if (cancelled) fileName = new Date().getTime() + '.txt';
         else fileName = value + '.txt';


         const savedFile = await Filesystem.writeFile({
             directory: MainDirectory,
             path: `${NOTES_DIR}/${fileName}`,
             data: stringToSave,
             encoding: Encoding.UTF8
         }).then(
             //If it succeeded, then send the alert that its saved.
             async result => {
                 await Dialog.alert({
                     title: 'Saved!',
                     message: 'It should be saved.',
                 });
             },
             //If not, then catch the error and try to create the folder
             //Because it might be the main reason.
             async err => {
                 console.log('Error found: ', err);
                 console.log('Attempting to create the folder...')
                 await Filesystem.mkdir({
                     path: NOTES_DIR,
                     directory: MainDirectory
                 });

                 await Dialog.alert({
                     title: 'Error!',
                     message: 'Error has occured while saving the note, may be a directory problem. A new directory should be added now, so try to save it again.',
                 });

            }

         )
    }
}

export async function saveSameFile(noteString:any, noteIndex:number) {

    //Do NOT save if noteString is either null or undefined.
    if (noteString != null && noteString != undefined) {
        //We attempt to save the file into the designated directory.
        const fileName = notesList[noteIndex].name;
        const savedFile = await Filesystem.writeFile({
            directory: MainDirectory,
            path: `${NOTES_DIR}/${fileName}`,
            data: noteString,
            encoding: Encoding.UTF8
        }).then(
            //If it succeeded, then send the alert that its saved.
            async result => {
                await Dialog.alert({
                    title: 'Saved!',
                    message: 'It should be saved in the same file.',
                });
            },
            //If not, then catch the error and try to create the folder
            //Because it might be the main reason.
            async err => {
                console.log('Error found: ', err);
                console.log('Attempting to create the folder...')
                await Filesystem.mkdir({
                    path: NOTES_DIR,
                    directory: MainDirectory
                });

                await Dialog.alert({
                    title: 'Error!',
                    message: 'Error has occured while saving the note, may be a directory problem. A new directory should be added now, so try to save it again.',
                });

            }

        )
    }
}