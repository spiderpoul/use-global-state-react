# redux-blaze

Create redux actions and reducers in one touch with functions.

## Typescript example

```ts
import { ReducerCur, buildReducer } from "redux-blaze";
import { combineReducers } from 'redux'

interface ToDoState {
  todos: string[]
}

type Reducer<TPayload> = ReducerCur<ToDoState, TPayload>

const initialState = {
  todos: []
}


// define your functions
const addTodo: Reducer<{ todo: string }> = ({ todo }) => s => ({
  ...s,
  todos: [...s.todos, todo]
})

const removeTodo: Reducer<{ todo: string }> = ({ todo }) => s => ({
  ...s,
  todos: s.todos.filter(x => x !== todo)
})
```

Сreate a redux-blaze bundle:

```ts
const reduxBlaze = buildReducer(
  initialState,
  {
    addTodo,
    removeTodo
  },
  { prefix: 'TODO' }
)
```

Here ready to use generated typed reducer:

```ts
export const rootReducer = combineReducers({
  todos: reduxBlaze.reducer
})
```

Here ready to use generated typed action creators:

```ts
const todoActions = reduxBlaze.actionCreators;
dispatch(todoActions.addTodo({todo: 'Install redux'}))
```

Or bind to actions to dispatch and emit action directly:

```ts
const todoBindActions = reduxBlaze.bind(dispatch);
todoBindActions.addTodo({todo: 'Install redux-blaze'});
```

## Creation common reducer

You can create a common bundler for repeated logic, f.e. fetching data:

```ts
import { ReducerCur, buildReducer } from "redux-blaze";
import { Dispatch, combineReducers } from "redux";

export function createCommonReducer<TState, TModel>(arg: { initialState: TState; prefix: string }) {
  const { initialState, prefix } = arg;
  type Reducer<TPayload> = ReducerCur<TState, TPayload>;

  const loadRequest: Reducer<{}> = () => s => ({ ...s, isLoading: true });

  const loadSuccess: Reducer<{ data: TModel }> = ({ data }) => s => ({
    ...s,
    model: data,
    isLoading: false,
    error: false
  });

  const loadError: Reducer<{ error: any }> = ({ error }) => s => ({
    ...s,
    error,
    isLoading: false
  });

  const bundle = buildReducer(
    initialState,
    {
      loadRequest,
      loadSuccess,
      loadError
    },
    { prefix }
  );

  return {
    bindActions: bundle.bind,
    reducer: bundle.reducer
  };
}

```

Lets use it:

```ts
interface ItemModel {
  name: string;
  id: string;
}

interface AppState {
  error: null,
  isLoading: false,
  model: ItemModel | null;
}

const initialState: AppState = {
  error: null,
  isLoading: false,
  model: null
};

export const appReduxBlaze = createCommonReducer<AppState, ItemModel>({
  initialState,
  prefix: 'APP'
});
```

And here we have ready to use action creators:

```ts
const bindActions = appReduxBlaze.bindActions(dispatch);

try {
  bindActions.loadRequest({});
  const res = await fetch('/api/data');

  bindActions.loadSuccess({data: res.json()});
} catch (e) {
  bindActions.loadError({error: e});
}
```

No extra line of code!

## Special thanks

Huge thanks for initial idea and inspiration to [Yakov Zhmurov](https://github.com/jakobz).
