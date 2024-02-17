import { Capacitor } from '@capacitor/core';
import { Dialog } from '@capacitor/dialog';
import { Directory, Encoding, FileInfo, Filesystem } from '@capacitor/filesystem';

//Cnstants.
const NOTES_DIR = 'notesketchr';
const MainDirectory = Directory.Documents;

//Arrays
let notesList: FileInfo[] = [];

export async function loadNote(noteFileName: any): Promise<string>{
    let temp = "";
    console.log(noteFileName);
    if (noteFileName != undefined) {
        const contents = await Filesystem.readFile({
            path: `${NOTES_DIR}/${noteFileName}`,
            directory: MainDirectory,
            encoding: Encoding.UTF8
        }).then(result => {temp = result.data.toString()})
    }

    console.log(temp);
    //if (Capacitor.getPlatform() != "web") atob(temp);
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
Saving file. It should check on which platform we are working on, and then execute the saving in a different way.
For now, we are going to deal through mobile, which means we get to deal with Capacitor's filesystem functions.
*/

//Save the file if there are no index provided (basically saving a new file)
export async function saveFile(noteString:any) {

    //Do NOT save if noteString is either null or undefined.
    if (noteString != null && noteString != undefined) {
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
            data: noteString,
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