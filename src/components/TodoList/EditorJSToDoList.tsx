
import { BlockTool } from '@editorjs/editorjs';
import TodoList from './todolist';
import { createRoot } from 'react-dom/client';
import {returnSavedData} from "./EditorJSToDoIntermediary";

/*
    ToDoListEJS, the addon component of Editor.js. One of the few classes
    in the React-focused application due to how Editor.js only allows
    classes for addons as to implement the BlockTool class.

    All in all, it just displays the .tsx file of Todo list and renders
    in a manner where it is React friendly, and the intermediary deals with
    saving and loading the data.

*/

export default class ToDoListEJS implements BlockTool{
    divNode = document.createElement("div");
    _container;


    constructor({data}:any) {
        this._container = createRoot(this.divNode);
    }

    static get toolbox(){
        return {
            title: "To-do List",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>'
        }
    }


    save(){
        return returnSavedData();
    }



    render() {
        this._container.render(<TodoList />)
        return this.divNode;
    }
}