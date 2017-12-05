const todo = (state = {}, action) => {
   switch(action.type) {
     case 'ADD_TODO':
       return {
         id : action.id,
         text : action.text,
         isCompleted : false
       };
     case 'TOGGLE_TODO':
       if(state.id === action.id) {
         return Object.assign({}, state, {isCompleted : !state.isCompleted});
       }
       return state;
       
     default:
       return state;
   }
}

const testAddTodo = () => {
  const objectAfter = {id : 1, text : 'text1', isCompleted : false};
  const action = {id : 1, text : 'text1', type : 'ADD_TODO'};
    
  expect(todo({}, action)).toEqual(objectAfter);
}
testAddTodo();
console.log('Test Add Todo Successfully.');

const testToggleTodo = () => {
  const objectBefore =  {id : 1, text : 'text1', isCompleted : false};
  const objectAfter =  {id : 1, text : 'text1', isCompleted : true};
  const action = {type : 'TOGGLE_TODO', id : 1};
  
  deepFreeze(objectBefore);
  
  expect(todo(objectBefore, action)).toEqual(objectAfter);
}

testToggleTodo();
console.log('Test Toggle Todo Successfully.');

const todos = (state = [], action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return [...state, todo({}, action)]
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
}

const testAddTodos = () => {
  const listBefore = [{id : 1, text : 'text1', isCompleted : false}];
  const listAfter = [{id : 1, text : 'text1', isCompleted : false},
                     {id : 2, text : 'text2', isCompleted : false}];
  const action = {id : 2, text : 'text2', type : 'ADD_TODO'};
  
  deepFreeze(listBefore);
  
  expect(todos(listBefore, action)).toEqual(listAfter);
  
}

testAddTodos();
console.log("Test Add Todos Successfully.");

const testToggleTodos = () => {
  const listBefore = [{id : 1, text : 'text1', isCompleted : false},
                     {id : 2, text : 'text2', isCompleted : false}];
  const listAfter = [{id : 1, text : 'text1', isCompleted : true},
                     {id : 2, text : 'text2', isCompleted : false}];
  const action = {type: 'TOGGLE_TODO', id : 1};
  
  deepFreeze(listBefore);
  
  expect(todos(listBefore, action)).toEqual(listAfter);
}

testToggleTodos();
console.log('Test Toggle Todos Successfully.');

//set Visible
const setVisible = (state = 'SHOW_ALL', action) => {
   switch(action.type) {
        case 'SET_VISIBILITY':
            return action.filter;
        default:
            return state;
    }
}

const {combineReducers} = Redux;
const appTodo = combineReducers({todoList : todos,  visibility : setVisible});

const {createStore} = Redux;
const store = createStore(appTodo);

const TodoItem = (input) => {
  return <li>{input}</li>
}

const Todo = ({onClick, isCompleted, text}) => {
  return <li onClick={onClick}
    style={{
      textDecoration : isCompleted ?
        'line-through':
        'none'}} >
    {text}
  </li>
};

const TodoList = ({todoList, onClickTodoList}) => {
  return (
    <ul>
      {todoList.map(t => {
       return <Todo key={t.id}
         onClick={() => onClickTodoList(t.id)}
         {...t}/>
      })}
    </ul>
  );
};

const Filter = ({input, handleOnClick}) => {
  return (
    <button onClick={() => handleOnClick()}>
      {input}
    </button>)
}

class FilterButton extends React.Component {
  
  componentDidMount() {
    console.log("FilterButton Call Did Mount");
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }
  
  componentWillUnmount() {
    console.log("FilterButton Call Will Un Mount");
    this.unsubscribe;
  }
  
  render() {
    console.log("FilterButton Call Render");
    
    const props = this.props;
    return (<Filter input={props.children} handleOnClick={() => {
          store.dispatch({type:'SET_VISIBILITY', filter : props.filter });
        }}/>)
  }
  
   /*onClickFilter={(visibleMode) => {
            console.log(visibleMode);
            store.dispatch({type:'SET_VISIBILITY', filter : visibleMode });
          }}*/
}

const Footer = ({onClickFilter}) => {
  return (
    <div>
      <FilterButton filter ='SHOW_ALL'>All</FilterButton>
      <FilterButton filter ='ACTIVE' children = 'Active'/>
      <FilterButton filter ='COMPLETED' children = 'Completed'/>
    </div>);
}

const Header = () => {
  let inputNode;
  return (
    <div>
      <input ref={(node) => inputNode = node} />
        <button onClick={() => {store.dispatch({id : nodeNumber++,
                            text : inputNode.value,
                            type : 'ADD_TODO'});
            inputNode.value=''; }}>
          Add
        </button>
    </div>
  );
}

class VisibleTodoList extends React.Component {
  
  componentDidMount() {
    console.log(" VisibleTodoList Call Did Mount");
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }
  
  componentWillUnmount() {
    console.log("VisibleTodoList Call Will Un Mount");
    this.unsubscribe;
  } 
  
  render() {
    console.log("VisibleTodoList Call Render");
    
    const props = this.props;
    const state = store.getState();
    
    return (
      <TodoList todoList={getFilteredList(state.todoList, state.visibility)}
          onClickTodoList={(id) => {
            store.dispatch({type:'TOGGLE_TODO', id : id})
          }}/>
    );
  }
}


const getFilteredList = (todoList, visibleMode) => {
  switch(visibleMode) {
    case 'SHOW_ALL':
      return todoList;
    case 'ACTIVE':
      return todoList.filter(t => !t.isCompleted);
    case 'COMPLETED':
      return todoList.filter(t => t.isCompleted);
  }
}

let nodeNumber = 0;

const AppTodo = () => {
  return (
      <div>
        <Header />
        <VisibleTodoList />
        <Footer />
      </div>
       
    );
}

ReactDOM.render(<AppTodo />,
                document.getElementById('root'));


