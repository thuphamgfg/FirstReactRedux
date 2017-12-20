
<script src="https://fb.me/react-15.1.0.js"></script>
<script src="https://fb.me/react-dom-15.1.0.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.7.2/redux.js"></script>
<script src="https://wzrd.in/standalone/expect@latest"></script>
<script src="https://wzrd.in/standalone/deep-freeze@latest"></script>
<script src="https://unpkg.com/prop-types/prop-types.js"></script>
<div id="root"></div>

const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id       : action.id,
                text     : action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }
            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

const { combineReducers } = Redux;
const {connect} = ReactRedux;

const todoApp = combineReducers({
    todos,
    visibilityFilter
});
const { Component } = React;
const Link = ({
    active,
    children,
    onClick
}) => {
    if (active) {
        return <span>{children}</span>;
    }
            
    return (
        <a href="#"
            onClick={(e) => {
            e.preventDefault();
            onClick();
        }}
        >
        {children}
        </a>
    );
};

const mapStateToLinkProps = (state, ownerProp) => {
  return {active : ownerProp.filter ===
                state.visibilityFilter}
}

const mapDispatchToLinkProps = (dispatch, ownerProp) => {
  return {onClick :() => dispatch({
                    type  : 'SET_VISIBILITY_FILTER',
                    filter: ownerProp.filter
                })}
}
const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);
/*class FilterLink extends Component {
    componentDidMount () {
        const { store } = this.context;
        this.unsubscribe = store.subscribe(() => 
            this.forceUpdate()
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
  
    render() {
        const props = this.props;
        const { store } = this.context;
        const state = store.getState();

    return (
        <Link
            active={
                props.filter ===
                state.visibilityFilter
            }
            onClick={() => 
                store.dispatch({
                    type  : 'SET_VISIBILITY_FILTER',
                    filter: props.filter
                })
            }
        >
        {props.children}
        </Link>
    );
  }
} 

FilterLink.contextTypes = {
    store : React.PropTypes.object
};*/

const Footer = () => (
    <p>
        Show:
        {' '}
        <FilterLink
            filter='SHOW_ALL'
            >
            All
        </FilterLink>
        {' '}
        <FilterLink
            filter='SHOW_ACTIVE'
            >
            Active
        </FilterLink>
            {' '}
        <FilterLink
            filter='SHOW_COMPLETED'
            >
            Completed
        </FilterLink>
    </p>
);

const Todo = ({
    onClick,
    completed,
    text
}) => (
    <li 
        onClick={onClick}
        style={{
            textDecoration: 
                completed ?
                'line-through' : 
                'none'
            }}>
        {text}
    </li>
);

const TodoList = ({
    todos,
    onTodoClick
}) => (
    <ul>
        {todos.map(todo=> 
            <Todo
                key={todo.id}
                {...todo}
                onClick={() => onTodoClick(todo.id)}
            />
        )}
    </ul>
);

let nextTodoId = 0;

/*const AddTodo = (props, {store}) => {
    let input;
    return (
        <div>
            <input ref={ node => {
                input = node
            }} />
            <button onClick={()=>{
                store.dispatch({
                    type : 'ADD_TODO',
                    id   : nextTodoId++,
                    text : input.value
                })
                input.value = '';
            }}>
            Add Todo
            </button>
        </div>
    );
};

AddTodo.contextTypes = {
  store : React.PropTypes.object
}*/
let AddTodo = ({dispatch}) => {
    let input;
    return (
        <div>
            <input ref={ node => {
                input = node
            }} />
            <button onClick={()=>{
                dispatch({
                    type : 'ADD_TODO',
                    id   : nextTodoId++,
                    text : input.value
                })
                input.value = '';
            }}>
            Add Todo
            </button>
        </div>
    );
};

//AddTodo do not need state, need dispatch for adding
//AddTodo = connect((state) => {return {}}, (dispatch) => {return {dispatch}})(AddTodo);
AddTodo = connect()(AddTodo);
const getVisibleTodos = (todos, filter) => {
    switch (filter) {
    case 'SHOW_ALL':
        return todos;
    case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed);
    }
};


const mapStateToTodoListProps = (state) => {
  return {todos : getVisibleTodos(
                        state.todos,
                        state.visibilityFilter
                    )};
}

const mapDispatchToTodoListProps = (dispatch) => {
  return {onTodoClick : id =>
                    dispatch({
                        type: 'TOGGLE_TODO',
                        id
                    })}
}
const VisbilityTodoList = connect(mapStateToTodoListProps, mapDispatchToTodoListProps)(TodoList);
/*class VisbilityTodoList extends Component {
    componentDidMount () {
        const { store } = this.context;
        this.unsubscribe = store.subscribe(() => 
            this.forceUpdate()
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
  
    render() {
        const props = this.props;
        const { store } = this.context;
        const state = store.getState();

        return (
            <TodoList 
                todos={
                    getVisibleTodos(
                        state.todos,
                        state.visibilityFilter
                    )
                }
                onTodoClick={
                id =>
                    store.dispatch({
                        type: 'TOGGLE_TODO',
                        id
                    })
                }
            />
        );
    }
}

VisbilityTodoList.contextTypes = {
    store : React.PropTypes.object
};*/

const TodoApp = () => (
    <div>
        <AddTodo />
        <VisbilityTodoList />
        <Footer />
    </div>
);


const { Provider } = ReactRedux;
const { createStore } = Redux;

ReactDOM.render(
    <Provider store={createStore(todoApp)}>
        <TodoApp />
    </Provider>,
    document.getElementById('root')
);






  
  
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
  
  //return the context object which is passed to descendants
  getChildContext() {
    return {store : this.props.store};
  }
  
  render() {
    return this.props.children;
  }
}

//declare structure of context object which is passed to descendants
Provider.childContextTypes = {
  store : PropTypes.object
};

//ReactDOM.render(<AppTodo store = {createStore(appTodo)}/>,
//                document.getElementById('root'));
ReactDOM.render(<Provider store={createStore(appTodo)} > <AppTodo /> </Provider>,
                document.getElementById('root'));



//NOTE: context variables are global variable => this is a bad idea

