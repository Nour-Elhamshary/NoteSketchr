import { Dialog } from '@capacitor/dialog';
import { Directory, Encoding, FileInfo, Filesystem } from '@capacitor/filesystem';
import EditorJS, { BlockAPI, OutputBlockData } from '@editorjs/editorjs';

//Constants.
const NOTES_DIR = 'notesketchr';
const MainDirectory = Directory.Documents;

//Arrays
let notesList: FileInfo[] = [];

export async function loadNoteInString(text:string, editor:EditorJS) {
    let tempString = text;
    let tempString2: string[];
    var editorElement = document.getElementById("editorjs");
    if (editorElement != null && editor != undefined) {
        //If yes, then we assume that it is a markdown file,
        //so we parse it to JSON.
        tempString2 = await MarkdownToJSON(tempString);
        //First, delete everything that may be in the editor itself.
        //Delete from last block to first block.
        for (var i = editor.blocks.getBlocksCount() -1 ; i >= 0; i--) {
            await editor.blocks.delete(i);
        }
        
        //And then add in the new information one block at a time.
        for (var i = 0; i < tempString2.length; i++) {
            //If any markdown headers are found, then
            if (tempString2[i].includes("#")) {
                await editor.blocks.insert("header",{
                    text: tempString2[i].replace(/\#/gm, ""),
                    level: tempString2[i].split(/\#/g).length - 1
                })
                continue;
            }
            await editor.blocks.insert("paragraph", {text: tempString2[i]}) 
        }
    }
}


/**
 * 
 * Loads a note from a file and then outputs it to the editor.
 * @async
 * @param noteFileName fileName - The name of the file that stores the note.
 * @param editor editor - Instance of the editor.
 */

export async function loadNote(noteFileName:any): Promise<void>;
export async function loadNote(noteFileName:any, editor:EditorJS): Promise<void>;
export async function loadNote(noteFileName: any, editor?:EditorJS){
    //Temporary strings to store in any value from them.
    let tempString = "";
    let tempString2: OutputBlockData<string, any>[];
    let finalTemp: OutputBlockData<string, any>;
    //If the file name is actually available, then execute these
    //sets of statements.
    if (noteFileName != undefined) {
        //Attempt to load the file itself, and store the contents to tempString
        const contents = await Filesystem.readFile({
            path: `${NOTES_DIR}/${noteFileName}`,
            directory: MainDirectory,
            encoding: Encoding.UTF8
        }).then(result => {tempString = result.data.toString()})
    }

    //Then check if both the div that stores the editor exists alongside
    //an instance of the editor.
    var editorElement = document.getElementById("editorjs");
    if (editorElement != null && editor != undefined) {
        //If yes, then we assume that it is a markdown file,
        //so we parse it to JSON.
        tempString2 = await MarkdownToJSON(tempString);     
        editor.blocks.render({"blocks":tempString2});
    }
}

/**
 * Loads a list of notes available in the directory, and then is inserted
 * to the global array notesList.
 * @async
 */

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

/**
 * Returns the list of notes stored in the global array notesList.
 * @returns notesList
 */
export function getNotesList(): FileInfo[] {
    return notesList
}


/*
JSON parsing functions to convert to Markdown and vice versa.
*/

/**
 * Converts any JSON data provided by the editor to a file compatible for
 * markdown files.
 * @param JSONData json - JSON data provided by the editor.
 * @returns outputString
 */
export async function JSONToMarkdown(JSONData: any): Promise<string> {
    let outputString = "";

    console.log(JSONData.blocks);

if (JSONData.blocks != undefined) {
    //If we are dealing with JSON that has multiple blocks.
    for (let i = 0; i < JSONData.blocks.length; i++) {
        //console.log(JSONData.blocks[i].type);
        switch (JSONData.blocks[i].type) {
            case 'paragraph':
                outputString += JSONData.blocks[i].data.text + `\n`;
            break;
            case 'header':
                //In markdown, # is used for headers with H1 through H6
                //being repeated in markdown, so do that.
                for (let i = 0; i < JSONData.blocks[i].data.level; i++) {
                    outputString += "#";
                }
                outputString += " " + JSONData.blocks[i].data.text + '\n';
            break;
            case 'image':
                //In markdown, it is supposed to be this: ![Caption][link]

            //Okay, the second one would contain a blob, but we need to convert it to
            //file that would be normally stored in the area itself.

            //First, we get the file type itself.
            const blob = await fetch(JSONData.blocks[i].data.url).then(r => r.blob());
            console.log("Blob: ", blob )
            let fileType = blob.type.split("/");

            let fileName = "IMAGE_" + new Date().getTime() + "." + fileType[1];
            const savedFile = await Filesystem.writeFile({
                directory: MainDirectory,
                path: `${NOTES_DIR}/${fileName}`,
                data: blob,
            }).then(
                async result => {
                    outputString += "!["
                    + JSONData.blocks[i].data.caption
                    + "]["
                    + `${NOTES_DIR}/${fileName}`
                    + "]";

                    console.log(`${NOTES_DIR}/${fileName}`);
                }
            )
            default:
            break;
        }
    }
}
else {
    console.log("JSONData: ", JSONData);

        console.log(JSONData.tool);
        switch (JSONData.tool) {
            case 'paragraph':
                outputString += JSONData.data.text + `\n`;
            break;
            case 'header':
                //In markdown, # is used for headers with H1 through H6
                //being repeated in markdown, so do that.
                for (let i = 0; i < JSONData.data.level; i++) {
                    outputString += "#";
                }
                outputString += " " + JSONData.data.text + '\n';
            break;
            case 'image':
                //In markdown, it is supposed to be this: ![Caption][link]

            //Okay, the second one would contain a blob, but we need to convert it to
            //file that would be normally stored in the area itself.

            //First, we get the file type itself.
            const blob = JSONData.data.url;
            console.log("Blob: ", blob )
            let fileType = blob.type.split("/");

            let fileName = "IMAGE_" + new Date().getTime() + "." + fileType[1];
            const savedFile = await Filesystem.writeFile({
                directory: MainDirectory,
                path: `${NOTES_DIR}/${fileName}`,
                data: blob,
            }).then(
                async result => {
                    outputString += "!["
                    + JSONData.data.caption
                    + "]["
                    + `${NOTES_DIR}/${fileName}`
                    + "]";

                    console.log(`${NOTES_DIR}/${fileName}`);
                }
            )
            break;
            default:
            break;
        }

}
    //This section is for parsing any JSON areas to Markdown.
    //For bold, ** is used instead of <b> HTML tag, so we replace it.
    outputString = outputString.replace(/<b>/g, "**");
    outputString = outputString.replace(/<\/b>/g, "**");

    //For italics, * is used instead of <i> HTML tag, so we replace it.
    outputString = outputString.replace(/<i>/g, "*");
    outputString = outputString.replace(/<\/i>/g, "*");

    //Deal with other HTML symbols, like spaces and line breaks if necessary.
    outputString = outputString.replace(/&nbsp;/g, " ");
 
    console.log(outputString);
    return outputString;

}

/**
 * Converts any Markdown compatible files to JSON compatible for the editor.
 * @param StringData 
 * @returns strings - returns an array of strings that has been parsed
 * from Markdown compatible data to JSON compatible for the editor.
 */

export async function MarkdownToJSON(StringData: string): Promise<any> {
    let data = StringData;
    console.log("StringData: ", StringData);
    //Replace the bold/italics stuff to HTML tags accordingly.
    //For bold
    data = data.replace(/(\*\*)/gm, "<b>"); //Replace first ** on every word with <b> tag
    data = data.replace(/<b>(?!\b)/gm, "</b>"); //basically, check for the second <b> and then change it to closing tag


    //Bold should be taken care of, so concentrate on italics.
    data = data.replace(/\*/gm, "<i>");
    data = data.replace(/<i>(?!\b)/gm, "</i>");


    console.log(data);
    let strings = data.split(/\n/);

    //Then try to convert it into a JSON object.
    //Declare an array of blocks to insert in json.
    let blocks: Object[] = [];

    //Provide interfaces so that it converts to specific json object
    interface headerObject {
        type: string
        data: {
            text: string,
            level: number
        }
    }

    interface paragraphObject {
        type: string
        data: {
            text: string
        }
    }

    interface imageObject {
        type: string
        data: {
            url: string | Blob
            caption: string
        }
    }

    for (var i = 0; i < strings.length; i++) {
        //If any markdown headers are found, then
        if (strings[i].includes("#")) {
                let tempHeaderObj : headerObject = {
                    type: "header",
                    data: {
                        text: strings[i].replace(/\#/gm, ""),
                        level: strings[i].split(/\#/g).length - 1
                    }
                }
                blocks[i] = tempHeaderObj;
                console.log(blocks[i]);
            
        }
        else if (strings[i].includes("![")) {
            let tempString = strings[i];
            //First we remove any closing square brackets on that.
            tempString = tempString.replace(/\]/g, "");

            //Then we remove the ![ part
            tempString = tempString.replace(/\!\[/g, "");

            //Now, the [ is what provides the split, so... we split it.
            let tempStringFinal = tempString.split(/\[/g);
            console.log(tempStringFinal);
            const pictureContents = await Filesystem.readFile({
                path: tempStringFinal[1],
                directory: MainDirectory
            }
            )

            if (typeof pictureContents.data != "string") {
            let tempImageObj : imageObject = {
                type: "image",
                data: {
                    url: URL.createObjectURL(pictureContents.data),
                    caption: tempStringFinal[0]
                }
            }
            
            blocks[i] = tempImageObj;
        }
        }
        else {
            let tempParaObj : paragraphObject = {
                type: "paragraph",
                data: {
                    text: strings[i]
                }
            }

        blocks[i] = tempParaObj;

    }
    }
    console.log(blocks);
    return blocks;
}
 
/*
    TODO - Function that updates the formatting in real time
    Basically when the user presses enter, it checks on the 
    previous block of the editor. If it has Markdown formatted
    text, then it would try to update the previous block so that
    it has its new format.  
*/

// export async function UpdateMDFormatting(editor: EditorJS) {
//     var editorElement = document.getElementById("editorjs");
//     if (editorElement != null && editor != undefined) {
//         var block: BlockAPI | undefined = editor.blocks.getBlockByIndex(editor.blocks.getCurrentBlockIndex());
//         if (block != undefined) {
//             let blockString = await block.save().then((outputData: any) => {
//                 console.log("Something to test: ",outputData);
//                 //var temp1 = JSONToMarkdown(outputData);
//                 //console.log(temp1);
//                 var temp2 = await MarkdownToJSON(outputData.data.text);
//                 console.log("Temp2:", temp2);

//                 if (outputData.data.text != temp2[0].data.text) {
//                         if (outputData.tool != temp2[0].type) {
//                             editor.blocks.convert(outputData.id, "header");
//                         }
//                         else
//                             editor.blocks.update(outputData.id, temp2[0].data);
                        
//                     }

                    


//             }
//             )
//         }
//     }
// }


/* 
Saving file. It should check on which platform we are working on, and then execute the saving in a different way.
For now, we are going to deal through mobile, which means we get to deal with Capacitor's filesystem functions.
*/

/**
 * Saves the note externally to the specified folder that is dictated by the program.
 * @param noteString - any string to insert to an editor (OLD, WILL BE REMOVED SOON)  
 * @param editor - An instance of the editor.
 */

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
            
             noteString = await editor.save().then(async (outputData: any)  => {
                 //console.log('Article data: ', outputData)
                 stringToSave = await JSONToMarkdown(outputData);
                 await MarkdownToJSON(stringToSave);
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
         if (cancelled) fileName = new Date().getTime() + '.md';
         else fileName = value + '.md';


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
/**
 * Saves the note externally to the same file using its index.
 * @param noteString - string to store to
 * @param noteIndex - index number of the file that is stored in the array.
 */
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