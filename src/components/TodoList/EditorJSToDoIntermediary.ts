/*
    This is an intermediary of the To-do list function component and the
    To-do list EditorJS class add-on, where they save and load the data
    in such a manner:

    SavedData deals with data that is going to be saved to EditorJS
    normal Data means that it shows what the current data for the 
    items in To-Do list is.
*/

interface todoItemsData {
    data: {
    "todoItems":string[]
}
}

export let tempTodoData:todoItemsData = {
    data: {
    todoItems: []
}
};

export let tempSaveTodoData:todoItemsData = {
    data: {
    todoItems: []
}
};

export function flushData() {
    while (tempTodoData.data.todoItems.length > 0) {
        tempTodoData.data.todoItems.pop();
    }
}

export function flushSavedData() {
    while (tempSaveTodoData.data.todoItems.length > 0) {
        tempSaveTodoData.data.todoItems.pop();
    }
}

export function getData(data:todoItemsData) {
    tempTodoData = data;

}

export function getSavedData(data:todoItemsData) {
    tempSaveTodoData = data;

}

export function returnData(): todoItemsData {
    return tempTodoData;
}

export function returnSavedData(): todoItemsData {
    return tempSaveTodoData;
}
