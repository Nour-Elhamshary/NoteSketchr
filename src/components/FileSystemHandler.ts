import { Dialog } from '@capacitor/dialog';
import { Directory, Encoding, FileInfo, Filesystem } from '@capacitor/filesystem';

//Cnstants.
const NOTES_DIR = 'notesketchr';
const MainDirectory = Directory.Documents;

//Arrays
export const listOfNotes: string[] = [];

export async function loadNotesList() {
    Filesystem.readdir({
        directory : MainDirectory,
        path: NOTES_DIR
    }).then(
        result => {
            console.log('List: ', result)
            loadNotesData(result.files)
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


export function loadNotesData(fileNames: FileInfo[]) {
    for (let f of fileNames) {
        listOfNotes.push(f.name);
    }

    console.log(listOfNotes);
}
 
/* 
Saving file. It should check on which platform we are working on, and then execute the saving in a different way.
For now, we are going to deal through mobile, which means we get to deal with Capacitor's filesystem functions.
*/
export async function saveFile(noteString:string) {
    //We attempt to save the file into the designated directory.
    const fileName = new Date().getTime() + '.txt';
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