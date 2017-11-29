const addCounter = (list) => {
    //return list.concat([0]);
    return[...list, 0] ;
};

const removeCounter = (list, index) => {
    //list.splice(index);
    //return list.slice(0, index)
    // .concat(list.slice(index+1));
    return [...list.slice(0, index), ...list.slice(index+1)];
}

const incrementCounter = (list, index) => {


    return [...list.slice(0, index)
        ,list[index] + 1,
...list.slice(index+1)];
}

const testAddCounter = () => {

    const listBefore = [];
    const listAfter = [0];

    deepfreeze(listBefore);

    expect(addCounter(listBefore))
        .toEqual(listAfter);
};

const testRemoveCounter = () => {
    const listBefore = [1,2,3];
    const listAfter = [1,2];

    deepfreeze(listBefore);

    expect(removeCounter(listBefore, 2))
        .toEqual(listAfter);
}

const testIncrementCounter = () =>{
    const listBefore = [1,2,3];
    const listAfter = [1,2,4];

    deepfreeze(listBefore);

    expect(incrementCounter(listBefore, 2))
        .toEqual(listAfter);
}

testAddCounter();
testRemoveCounter();
testIncrementCounter();
console.log('Test Counter successful.');



const toggleTodo = (item) => {
    return Object.assign({}, item, {
        completed : !item.completed
    });
}

const testToggleTodo = () => {
    const itemBefore = {id :0
        , text : 'text'
        , completed : false};
    const itemAfter = {id :0
        , text : 'text'
        , completed : true};

    deepfreeze(itemBefore);
    expect(toggleTodo(itemBefore)).toEqual(itemAfter);
}

testToggleTodo();
console.log('Test Toggle successful.');

const todo = (state, action) => {
    switch(action.type) {
        case 'ADD-TODO':
            return {id : action.id, text : action.text, completed : false};
        case 'TOGGLE-TODO':
            if(state.id !== action.id) {
                return state;
            }
            return Object.assign({}, state, {completed : !state.completed});
        //return {...state, completed : !state.completed};
        default:
            return state;
    }
};


const todos = (state = [], action) => {
    switch(action.type) {
        case 'ADD-TODO':
            return [...state,
                todo(undefined, action)];
        case 'TOGGLE-TODO':
            return state.map(t => {
                return todo(t, action);
    });
default:
    return state;
}
};

const testTodos = () => {
    const itemBefore = [];
    const action = {
        id: 1, type:'ADD-TODO', text : 'text'
    };
    const itemAfter = [{
        id: 1, text : 'text', completed : false
    }]

    deepfreeze(itemBefore);
    deepfreeze(action);

    expect(todos(itemBefore, action)).toEqual(itemAfter);
};

const testToggleTodos = () => {
    const itemBefore = [
        {id : 1, text : 'text1', completed : false},
        {id : 2, text : 'text2', completed : false}];

    const itemAfter = [
        {id : 1, text : 'text1', completed : true},
        {id : 2, text : 'text2', completed : false}];

    const action = {id: 1, type : 'TOGGLE-TODO'};

    deepfreeze(itemBefore);
    deepfreeze(action);

    expect(todos(itemBefore, action)).toEqual(itemAfter);

}

testTodos();
testToggleTodos();
console.log('Test Todo successful.');

const setVisibilityFilter = (state = 'SHOW_ALL', action) => {
    switch(action.type) {
        case 'SET_VISIBILITY':
            return action.filter;
        default:
            return state;
    }
};


/*const appTodo = (state = {}, action) => {
  return {todoList : todos(state.todoList, action),
          visibility : setVisibilityFilter(state.visibility, action)};
};*/

//const {combineReducers} = Redux;

const combineReducers = (reducers) => {
    return (state = {}, action ) => {
        return Object.keys(reducers).reduce(
            (nextState, key) => {
            nextState[key] = reducers[key](state[key], action);
        return nextState;
    }, {});
    };
}

const appTodo = combineReducers({todoList : todos, visibility : setVisibilityFilter});


const {createStore} = Redux;
const store = createStore(appTodo);

console.log('Initial state: ');
console.log(store.getState());


store.dispatch({ id: 1, type:'ADD-TODO', text : 'text1'});
console.log('1. Current state: ');
console.log(store.getState());

store.dispatch({ id: 2, type:'ADD-TODO', text : 'text2'});
console.log('2. Current state: ');
console.log(store.getState());

store.dispatch({id: 1, type:'TOGGLE-TODO'});
console.log('3. Current state: ');
console.log(store.getState());

store.dispatch({type : 'SET_VISIBILITY', filter : 'SHOW_COMPLETED'});
console.log('4. Current state: ');
console.log(store.getState());
































