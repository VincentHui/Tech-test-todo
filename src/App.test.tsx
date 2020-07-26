/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { InputForm, TodoRow, AddRow, App } from './App';
import { createTodo, updateTodo, removeTodo, getIdIncrementer } from './redux/action';
import { CREATE_TODO_REQUEST, DELETE_TODO_REQUEST, UPDATE_TODO_REQUEST } from './redux/types';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoReducer from './redux/reducer';
import renderer from 'react-test-renderer';

describe('snapshot tests', () => {
    it('InputForm', () => {
        const link = renderer
            .create(
                <InputForm
                    blurCallback={(e) => {}}
                    submitCallBack={(e) => {}}
                    buttonName="test button"
                    label="test label"
                    placeHolder={'test placeholder'}
                />,
            )
            .toJSON();
        expect(link).toMatchSnapshot();
    });
    it('todoRow', () => {
        const store = createStore(todoReducer);
        const todoRow = renderer
            .create(
                <Provider store={store}>
                    <TodoRow id={1} description="test description" checked={false} />
                </Provider>,
            )
            .toJSON();
        expect(todoRow).toMatchSnapshot();
    });
    it('AddRow', () => {
        const store = createStore(todoReducer);
        const addRow = renderer
            .create(
                <Provider store={store}>
                    <AddRow />
                </Provider>,
            )
            .toJSON();
        expect(addRow).toMatchSnapshot();
    });
});

describe('input form test', () => {
    it('InputForm', () => {
        const result = render(
            <InputForm
                clearinput={false}
                blurCallback={(e) => {}}
                submitCallBack={(e) => {}}
                buttonName="test button"
                label="test label"
                placeHolder={'test placeholder'}
            />,
        );

        const input = result.getByLabelText('test label') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'test input' } });
        fireEvent.blur(input);
        expect(input.value).toBe('test input');
        const submit = result.getByText('test button') as HTMLButtonElement;
        fireEvent.change(input, { target: { value: 'change for submission' } });
        fireEvent.click(submit);
        expect(input.value).toBe('change for submission');
    });
});

describe('actions', () => {
    it('add todo action', () => {
        const description = 'text description';
        const id = getIdIncrementer() + 1;
        const expectedAction = {
            type: CREATE_TODO_REQUEST,
            payload: { todo: { description: description, checked: false, id: id } },
        };
        expect(createTodo(description)).toEqual(expectedAction);
    });
    it('remove todo action', () => {
        const id = 2;
        const expectedAction = {
            type: DELETE_TODO_REQUEST,
            id: 2,
        };
        expect(removeTodo(id)).toEqual(expectedAction);
    });
    it('update todo action', () => {
        const todoUpdate = { id: 1, checked: false, description: 'update' };
        const expectedAction = {
            type: UPDATE_TODO_REQUEST,
            payload: { todo: todoUpdate },
        };
        expect(updateTodo(todoUpdate)).toEqual(expectedAction);
    });
});

describe('connected store', () => {
    it('todo logic', () => {
        const testStore = createStore(todoReducer);
        const testDescription = 'test description';
        testStore.dispatch(createTodo('test description'));
        render(
            <Provider store={testStore}>
                <App />
            </Provider>,
        );
        expect(screen.getByText(testDescription)).toBeInTheDocument();
        const createdToDo = testStore.getState().data.filter((todo) => todo.description === testDescription)[0];
        testStore.dispatch(updateTodo({ id: createdToDo.id, checked: true, description: 'updated' }));
        expect(screen.getByText('updated')).toBeInTheDocument();
        testStore.dispatch(removeTodo(createdToDo.id));
        expect(screen.queryByText('updated') === null);
    });
});
