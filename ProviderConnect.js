<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>JS Bin</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.0.4/redux.js"></script>
<script src="//fb.me/react-0.14.0.js"></script>
<script src="//fb.me/react-dom-0.14.0.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/react-redux/4.0.0/react-redux.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>


const { Component } = React;

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

//============= Action ==============//
let nextTodoId = 0;
const toggleTodoAction = (id) => {
  return {type: 'TOGGLE_TODO', id};
}

const addTodoAction = (text) => {
  return {type : 'ADD_TODO',
          id   : nextTodoId++,
          text
         }
}

const setFilterAction = (filter) => {
  return {type  : 'SET_VISIBILITY_FILTER',
          filter
         }
}

//==============Addition function ===========//
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
                    dispatch(toggleTodoAction(id))}
}

//==============AddTodoForm=======================//
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
                dispatch(addTodoAction(input.value))
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


//==============List=========================//
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


//==============Footer=======================//
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
  return {onClick :() => dispatch(setFilterAction(ownerProp.filter))}
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






  
  






  
  