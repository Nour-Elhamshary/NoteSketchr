/* 
    Okay, so how can we approach this?

    Ionic has the list component, so that should be used to show the list themselves
    There should be functions to add, and remove each individual lists.

    Loading and saving should be a priority here, it would be saved as a json file 
    for simplest method of storage.

    The list is stored in react useState array of strings that can be updated and modified, and where
    it shows the current data of the current note file. Since it would be saved and loaded
    from the json file, it means that it doesn't have to worry about different notes being loaded.

    To delete, the function takes in the id number of the element, and then
    deletes it using Array.filter() function. A global variable will be used that
    basically stores in the deleted ID, and the new function will just take it instead
    if it exists before turning it to null.

    That way, it will not have to rely on a variable that forever increases for the id, and
    it will have something quick to replace if one of them has been deleted just so there won't
    be a same id incident.


*/

import React, { useState } from 'react';
import { IonButton, IonItem, IonLabel, IonList, IonIcon, IonInput } from '@ionic/react';
import { trashBin } from 'ionicons/icons';

//First, we add in the string array

let nextId = 0;
let oldIdValue: number|null = null;
let tempString = "";


export default function TodoList() {
   
    const todoListItems: string[] = [];
    const [listState, setListState] = useState(Array<{id: number, content: string}>);

    const getTempString = (ev: Event) => {
        tempString = (ev.target as HTMLInputElement).value;
    }

    function addInList(text:string) {
        console.log("We should be adding something in the list!");

        console.log("oldIdValue: " + oldIdValue);
        let valueToSet = 0;
        if (oldIdValue != null) {
            valueToSet = oldIdValue
            oldIdValue = null;
        }
        else {valueToSet = listState.length}
        valueToSet = nextId;
        setListState([
            ...listState,
            {id: valueToSet, content: text}
        ]);
        nextId++;
        console.log("The nextId is:" + valueToSet);
    }

    function removeInList(id:number) {
        console.log("We should be removing something in the list.")
        oldIdValue = id;
        console.log(id);
        setListState(
            listState.filter(item => item.id !== id)
        )
    }

    /*
        We want the JSON object to look like this:
        "data": {
            "todoItems": [
                "test1",
                "test2",
                "test3"
            ]
        }
    
    */
    function saveList(arrayToSave:Array<{id: number, content: string}>) {
        var jsonObj = {
            "todoItems":[
                ""
            ]
        };

        for (var i = 0; i < arrayToSave.length; i++) {
            jsonObj.todoItems[i] = arrayToSave[i].content;
        }

        console.log(JSON.stringify(jsonObj));
    }

    function loadList() {
        //Logically, it should load a file and then does that, but for
        //testing purposes, we just do a random object for now.
        var jsonObj = {
            "todoItems":[
                "Hi! If you see this",
                "Then that means that the loading",
                "Is fully working!"
            ]
        };

        var tempArray: Array<{id: number, content: string}> = new Array<{id: number, content: string}>();

        for (var i = 0; i < jsonObj.todoItems.length; i++) {
            tempArray.push({ id: (i), content: (jsonObj.todoItems[i]) });
        }

        setListState(tempArray);
    }

    return (
    <>  
    <IonItem>  
        <IonInput onIonInput={(event) => getTempString(event)} placeholder="Insert a task here."/>
        <IonButton onClick={() => addInList(tempString)}>+</IonButton>
        <IonButton onClick={() => saveList(listState)}>Save</IonButton>
        <IonButton onClick={() => loadList()}>Load</IonButton>
    </IonItem>
    <IonList>

    {
        listState.map(item => (
            <IonItem key={item.id}>
            {item.content}
            <IonButton slot="end" color="danger" onClick={() => removeInList(item.id)}>
                 <IonIcon icon={trashBin}></IonIcon>
            </IonButton>
          </IonItem>
        ))
    }
    </IonList>
    </>
    )
}