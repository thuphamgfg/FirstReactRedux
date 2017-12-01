<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.7.2/redux.js"></script>
<script src="https://wzrd.in/standalone/expect@latest"></script>
<script src="https://wzrd.in/standalone/deep-freeze@latest"></script>
<div id="root"></div>


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

    deepFreeze(listBefore);

    expect(addCounter(listBefore))
        .toEqual(listAfter);
};

const testRemoveCounter = () => {
    const listBefore = [1,2,3];
    const listAfter = [1,2];

    deepFreeze(listBefore);

    expect(removeCounter(listBefore, 2))
        .toEqual(listAfter);
}

const testIncrementCounter = () =>{
    const listBefore = [1,2,3];
    const listAfter = [1,2,4];

    deepFreeze(listBefore);

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

    deepFreeze(itemBefore);
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

    deepFreeze(itemBefore);
    deepFreeze(action);

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

    deepFreeze(itemBefore);
    deepFreeze(action);

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

const Filter = ({filter, input}) => {
  return (<a href='#' onClick={ e => {
        e.preventDefault;
        store.dispatch({type:'SET_VISIBILITY', filter});
      }}
      >{input}</a>);
}

const getByVisible = (todos, filter) => {
  switch(filter) {
    case 'SHOW_ALL':
      return todos;
    case 'COMPLETED':
      return todos.filter(t => t.completed);
    case 'ACTIVE':
      return todos.filter(t => !t.completed);
  }
}
let nextTodo = 0;
class AppTodo extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    console.log('vis: ' + this.props.visibility);
    const filteredList = getByVisible(this.props.todoList, this.props.visibility);
    
    return (<div>
        <input ref={(node) => this.input = node} />
        <button onClick={
            () => {store.dispatch({id : nextTodo++,
                            text : this.input.value,
                            type : 'ADD-TODO'});
            this.input.value = '';//clear input field;
          }}>Add</button>
        <ul>
          {
            filteredList.map(t => {
              console.log('element: ');
              console.log(t.text);
              return <li key={t.id} onClick={() => store.dispatch({id : t.id,
                            type : 'TOGGLE-TODO'})}
                       style={{textDecoration:
                              t.completed? 'line-through' : 'none'}}
                       >{t.text}</li>;
            })
          }
        </ul>
        <p />
        <Filter filter='SHOW_ALL' input='All '></Filter><br />
        <Filter filter='ACTIVE' input='Active '></Filter><br />
        <Filter filter='COMPLETED' input='Completed '></Filter><br/>
      
      </div>
            
      );
  }
}
const render = () => {
  ReactDOM.render(<AppTodo todoList={store.getState().todoList} 
                    visibility={store.getState().visibility}/>, document.getElementById('root'));
};
store.subscribe(render);
render();


























