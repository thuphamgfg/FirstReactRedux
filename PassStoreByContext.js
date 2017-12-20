
<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.7.2/redux.js"></script>
<script src="https://wzrd.in/standalone/expect@latest"></script>
<script src="https://wzrd.in/standalone/deep-freeze@latest"></script>
<script src="https://unpkg.com/prop-types/prop-types.js"></script>
<div id="root"></div>

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
//const store = createStore(appTodo);

//============================================
/*const Header = (props, {store}) => {
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
}*/

const Header = (props, context) => {
  let inputNode;
  const {store} = context;
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

Header.contextTypes = {
  store : PropTypes.object
}

//==============================================
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

class VisibleTodoList extends React.Component {
  
  componentDidMount() {
    const {store} = this.context;
    console.log(" VisibleTodoList Call Did Mount");
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }
  
  componentWillUnmount() {
    console.log("VisibleTodoList Call Will Un Mount");
    this.unsubscribe;
  } 
  
  render() {
    console.log("VisibleTodoList Call Render");
    
    const {store} = this.context;
    const state = store.getState();
    
    return (
      <TodoList todoList={getFilteredList(state.todoList, state.visibility)}
          onClickTodoList={(id) => {
            store.dispatch({type:'TOGGLE_TODO', id : id})
          }}/>
    );
  }
}

VisibleTodoList.contextTypes = {
  store : PropTypes.object
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

//============================================
const Filter = ({input, handleOnClick}) => {
  return (
    <button onClick={() => handleOnClick()}>
      {input}
    </button>)
}

class FilterButton extends React.Component {
  
  /*componentDidMount() {
    const {store} = this.context;
    console.log("FilterButton Call Did Mount");
    this.unsubscribe = store.subscribe(() => this.forceUpdate()); //for re-render button list, if we need change button style after click
  }
  
  componentWillUnmount() {
    console.log("FilterButton Call Will Unmount");
    this.unsubscribe;
  }*/
  
  render() {
    console.log("FilterButton Call Render");
    
    const props = this.props;
    const {store} = this.context;
    
    return (<Filter input={props.children} handleOnClick={() => {
          store.dispatch({type:'SET_VISIBILITY', filter : props.filter });
        }}/>)
  }
}

FilterButton.contextTypes = {
  store : PropTypes.object
}

const Footer = () => {
  return (
    <div>
      <FilterButton filter ='SHOW_ALL'>All</FilterButton>
      <FilterButton filter ='ACTIVE' children = 'Active'/>
      <FilterButton filter ='COMPLETED' children = 'Completed'/>
    </div>);
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

class Provider extends React.Component {
  
  getChildContext() {
    return {store : this.props.store};
  }
  
  render() {
    return this.props.children;
  }
}

Provider.childContextTypes = {
  store : PropTypes.object
};

//ReactDOM.render(<AppTodo store = {createStore(appTodo)}/>,
//                document.getElementById('root'));
ReactDOM.render(<Provider store={createStore(appTodo)} > <AppTodo /> </Provider>,
                document.getElementById('root'));



//NOTE: context variables are global variable => this is a bad idea

