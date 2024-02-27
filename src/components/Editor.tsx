import { useEffect, useRef, useState } from "react"
import "./Editor.css"
import MarkdownDisplay from "./MarkdownDisplay";
import Markdown from 'react-markdown'
import EditorJS from '@editorjs/editorjs';





export default function Editor({mode, stringOfNote, checkNoteLoad, forwardedRef}: {mode:number, stringOfNote:string, checkNoteLoad:boolean, forwardedRef:any}){
    
    const [getContent, takeUserInput] = useState('');

    console.log(checkNoteLoad);

    useEffect(() => {
            takeUserInput(stringOfNote);
            console.log("It should load something!")
    }, [stringOfNote])

    

    return (
        <>
            {mode==2 && (
                <div className="textAreaDiv">
                <textarea
                ref ={forwardedRef}
                value = {getContent}
                onChange = {input => takeUserInput(input.target.value)}
                />
                </div>
            )  
            }
            {
                mode==1 && (
                    <div className="output">
                    <MarkdownDisplay markdown={getContent}/>
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