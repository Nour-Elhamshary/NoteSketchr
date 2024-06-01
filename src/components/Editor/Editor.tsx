import "./Editor.css"
import Dictaphone from "../SpeechRecognition/Dictaphone";

/*
Editor.tsx, where it lets the user switch between several pages when needed.
So far, it only lets the user switch to two pages: One to edit notes, and
one to use the dictaphone.

*/



export default function Editor({mode, stringOfNote, checkNoteLoad, forwardedRef}: {mode:number, stringOfNote:string, checkNoteLoad:boolean, forwardedRef:any}){
    
    return (
        <>
            {
                mode==1 && (
                    <div className="output">
                    <Dictaphone />
                    </div>
                )
            }
            {
                mode==0 && (
                    <div id="editorjs"/>
                )
            }


        </>
    )
}