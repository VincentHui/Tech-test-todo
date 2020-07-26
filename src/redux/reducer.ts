/* reducer.ts */

import { TodoState, TodoActionsTypes, CREATE_TODO_REQUEST, UPDATE_TODO_REQUEST, DELETE_TODO_REQUEST } from './types';

const initialState: TodoState = {
    data: [
        { id: -1, description: 'make tests', checked: false },
        { id: -2, description: 'make store logic', checked: false },
        { id: -3, description: 'make ui', checked: true },
    ],
};

export default function todoReducer(state = initialState, action: TodoActionsTypes): TodoState {
    switch (action.type) {
        case CREATE_TODO_REQUEST:
            return {
                data: [...state.data, action.payload.todo],
            };
        case UPDATE_TODO_REQUEST:
            return {
                data: state.data.map((todo) => (todo.id === action.payload.todo.id ? action.payload.todo : todo)),
            };
        case DELETE_TODO_REQUEST:
            return {
                data: state.data.filter((todo) => todo.id !== action.id),
            };
        default:
            return state;
    }
}
