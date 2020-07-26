/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react';
import { useSpring, animated, config } from 'react-spring';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { TodoState, Todo } from './redux/types';
import { createTodo, updateTodo, removeTodo } from './redux/action';
const List = styled.ul`
    list-style: none;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const ToDoInput = styled.input`
    margin-right: 20px;
`;

const TodoButton = styled.button`
    min-height: 20px;
`;

const TodoHeading = styled.h2<{ checked?: boolean }>`
    width: 300px;
    font-size: larger;
    flex-grow: 2;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    ${(props) => (!props.checked ? '' : 'text-decoration:line-through')};
`;

const TodoSection = styled.section`
    padding: 40px;
    display: flex;
    flex-direction: column;
`;
interface todoRowProp {
    id: number;
    description: string;
    checked: boolean;
}

export const TodoRow: React.FC<todoRowProp> = (props: todoRowProp) => {
    const dispatch = useDispatch();
    const [editValue, setEditValue] = useState(false);
    const [hover, setHover] = useState(false);
    const hoverSpring = useSpring({
        to: { transform: hover && !editValue ? 'scale(1.02)' : 'scale(1)' },
        from: { transform: 'scale(1)' },
    });
    const onEdit = (value: string) => {
        setEditValue(false);
        value.length === 0 ? dispatch(removeTodo(props.id)) : dispatch(updateTodo({ ...props, description: value }));
    };
    return (
        <animated.div style={{ ...hoverSpring, display: 'flex', minHeight: 70 }}>
            <Row onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
                <InputForm
                    clearinput={false}
                    hidden={!editValue}
                    buttonName="update"
                    label="button to update item"
                    placeHolder={props.description}
                    submitCallBack={onEdit}
                    blurCallback={onEdit}
                />

                <Row style={{ display: editValue ? 'none' : 'flex' }}>
                    <ToDoInput
                        type="checkbox"
                        defaultChecked={props.checked}
                        onChange={(e) => dispatch(updateTodo({ ...props, checked: e.target.checked }))}
                    />
                    <TodoHeading checked={props.checked} onClick={() => setEditValue(true)}>
                        {props.description}
                    </TodoHeading>
                    <TodoButton aria-label="Remove a todo item" onClick={() => dispatch(removeTodo(props.id))}>
                        remove
                    </TodoButton>
                </Row>
            </Row>
        </animated.div>
    );
};

export const AddRow: React.FC = () => {
    const dispatch = useDispatch();
    const placeHolder = 'E.g. do a tech test';
    return (
        <Row>
            <InputForm
                buttonName="Add"
                label="button to add todo item"
                placeHolder={placeHolder}
                blurCallback={(e) => {}}
                submitCallBack={(value) => dispatch(createTodo(value))}
            />
        </Row>
    );
};

export interface inputFormProp {
    placeHolder: string;
    submitCallBack: (value: string) => void;
    blurCallback: (value: string) => void;
    buttonName: string;
    label: string;
    hidden?: boolean;
    clearinput?: boolean;
}
export const InputForm: React.FC<inputFormProp> = (props: inputFormProp) => {
    const [inputValue, setInput] = useState(props.clearinput ? '' : props.placeHolder);
    return (
        <form style={{ display: props.hidden ? 'none' : 'block' }}>
            <ToDoInput
                autoFocus
                type="text"
                aria-label={props.label}
                placeholder={props.placeHolder}
                value={inputValue}
                onChange={(e) => setInput(e.target.value)}
                onBlur={(e) => {
                    props.blurCallback(e.target.value);
                }}
            />
            <TodoButton
                type="submit"
                onClick={(e) => {
                    e.preventDefault();
                    props.submitCallBack(inputValue);
                    props.clearinput && setInput('');
                }}
            >
                {props.buttonName}
            </TodoButton>
        </form>
    );
};
InputForm.defaultProps = {
    hidden: false,
    clearinput: true,
};
export const App: React.FC = () => {
    const springProps = useSpring({
        config: config.molasses,
        to: { opacity: 1, transform: 'translateY(0px)' },
        from: { opacity: 0, transform: 'translateY(-50px)' },
    });
    const todoList = useSelector<TodoState, Todo[]>((state) => state.data);
    return (
        <animated.div style={springProps} className="App">
            <TodoSection aria-labelledby="todos-label">
                <h1 id="todos-label">Todo List</h1>
                <List>
                    {todoList.map((todo) => {
                        return (
                            <li key={todo.id}>
                                <TodoRow id={todo.id} description={todo.description} checked={todo.checked} />
                            </li>
                        );
                    })}
                </List>
                <AddRow />
            </TodoSection>
        </animated.div>
    );
};
