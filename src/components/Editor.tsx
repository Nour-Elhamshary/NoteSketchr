import { useState } from "react"
import "./Editor.css"
import MarkdownDisplay from "./MarkdownDisplay";

//Making a prop to hold 
interface EditorProps {

}

export default function Editor({mode}: {mode:number}){
    const [getContent, takeUserInput] = useState('');
    
    return (
        <div className="editorDiv">
            {mode==0 && (
                <div className="textAreaDiv">
                <textarea
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


        </div>
    )
}