## useGlobalState

**Simple useGlobalState hook for React!** 

Do you need your data shared across other components, and you simply don't want to pass props all the way down, create context or use state management tool?

Just use `useGlobalState`, it's really simple and does all the magic for you:
- first argument is a key for your store
- second argument is optional - initial value

Try [Codesandbox example](https://codesandbox.io/s/boring-cerf-j4ub4)

### Example:
```ts
import { useGlobalState } from 'use-global-state-react';

const TASK_STORE_KEY = 'tasks';

const Tasks = () => {
    const [tasks, setTasks] = useGlobalState<string[]>(TASK_STORE_KEY, []);
    
    ...
}
```

and then you can use the same hook everywhere, data will be shared across components and component will rerender if changes happened in store:

```ts
const AddTaskButton = () => {
    const [, setTasks] = useGlobalState(TASK_STORE_KEY, []);
    
    const onTaskAdd = (newTask: stirng) => setTasks(prev => [...prev, newTask]);
    
    ...
}

const TasksTotal = () => {
    const [tasks] = useGlobalState<string[]>(TASK_STORE_KEY, []);
    
    return tasks.length;
}
```


or use helper `createGlobalStore` to create custom hook with shared data:

```ts
import { createGlobalStore } from 'use-global-state-react';

const useTasks = createGlobalStore<string[]>(TASK_STORE_KEY, []);


const Tasks = () => {
    const [tasks, setTasks] = useTasks();
    ...
}

```

## Installation

```
  npm i use-global-state-react
```

or

```
  yarn add use-global-state-react
```
