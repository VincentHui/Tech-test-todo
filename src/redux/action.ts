import { TodoActionsTypes, Todo, CREATE_TODO_REQUEST, UPDATE_TODO_REQUEST, DELETE_TODO_REQUEST } from './types';
let nextTodoId = 0;

export const getIdIncrementer = (): number => nextTodoId;

export const createTodo = (description: string): TodoActionsTypes => {
    nextTodoId++;
    return {
        type: CREATE_TODO_REQUEST,
        payload: { todo: { description: description, checked: false, id: nextTodoId } },
    };
};
export const updateTodo = (todo: Todo): TodoActionsTypes => {
    return {
        type: UPDATE_TODO_REQUEST,
        payload: { todo },
    };
};
export const removeTodo = (todoId: number): TodoActionsTypes => {
    return {
        type: DELETE_TODO_REQUEST,
        id: todoId,
    };
};
