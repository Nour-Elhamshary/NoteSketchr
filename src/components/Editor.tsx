import { useState } from "react"
import "./Editor.css"
import MarkdownDisplay from "./MarkdownDisplay";

export default function Editor(){
    const [getContent, takeUserInput] = useState('');
    
    return (
        <div className="editorDiv">
            <div className="textAreaDiv">
            <textarea
            value = {getContent}
            onChange = {input => takeUserInput(input.target.value)}
            />
            </div>
            <div className="output">
                <MarkdownDisplay markdown={getContent}/>
            </div>
        </div>
    )
}