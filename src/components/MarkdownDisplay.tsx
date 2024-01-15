import {createRoot} from 'react-dom/client'
import Markdown from 'react-markdown'

export default function MarkdownDisplay({markdown}: {markdown:string}) {
    return <Markdown>{markdown}</Markdown>
}