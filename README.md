# React-Claws
A poor man's react-hooks.

## Overview

React-Claws allow you to write your React Component using hooks where hooks isn't yet available, for example on React Native.

## Requirement.

React 16+ (It uses new Context API).

## How to use React-Claws

To define a component:

```javascript
// ToggleButton.js
import withClaws from 'react-claws';
export default withClaws(({ useState }) => {

  return function ToggleButton({ titleA, titleB } => {
    const [count, setCount] = useState(false);
    const inc = () => setCount(count+1);
    return <button onClick={inc}>{`${inc}`}</button>
  })

}, 'StatedToggleButton'); // component name is optional
```

To define a claw(hook):

```javascript
// useCounter.js
import { customClaw } from 'react-claws';
export default customClaw(({ useState }) => {

  return function useCounter(() => {
    const [count, setCount] = useState(false);
    const inc = ()=> setCount((count) => count+1);
    return [count, inc];
  });

});
```

Basically, what you write inside `withClaws/customClaw` is what you would write if you use react-hooks. You will also see that the standard hooks such as `useState`, are available and injected as argument to the block.

You *have* to return the component from the block. You also can only define one component per `withClaws` block. It's prefered to put one componet per file and use `export default` for each of them.

## How it works.

React Claws create one extra HoC on wrapping your functional component.
It then bind hooks-like named methods and inject into the block for your component.

## Why Claws instead of standard React Component?

Hooks is simply easier to compose. It enables new way of thinking.
So I think it's worth a shot to be able to write hooks like approach in older React environment.

## Why Claws instead of `recompose`?

Level of nested component using `recompose` is just ridiculously high.
Claws adds exactly one component HoC on top of your functional component, regardless of how many hooks you use, with the exception of nested `Context.Consumer` which is unavoidable.

## WARNING: Claws probably will never be the same as hooks.

It is, first and foremost, my learning exercise done in a couple days.
You may find some bug. I'm certain I haven't completely copied all behavior of a hook in some edge case. I may even misunderstand how some hooks are supposed to work. Bugs reports and contributions are welcomed.

Since it's just a simple wrapper over standard React. It may never be able to completely mimic what hooks can do. Still, from what I have tested so far you shouldn't see any obvious different.

## Limitation.

1. It uses HoC, so `ref` is not going to point to your functional component.
2. `useEffect` currently works exactly at the same time as `useLayoutEffect`, in `componentDidXXX`. IMO, this is a minor behavior changes.
3. I could use some help on adding debugging info. But I don't want to spend times on this unless people actually uses this library.
4. Currently `forWardRef` to `ref=` props doesn't yet work. I think this is doable, though. Noted that `forwardRef` and `useImperativeHandle` still work if you pass it to a custom prop, say `innerRef`.
5. `useDebugValue` doesn't work with the debugger, obviously. You can use chrome react inspector to inspect the state of the component. You will see array of states. (NOTES: Claws doesn't actually need or use `this.state`, but I set it to point to the internal register stack just so that's debugging/inspecting is possible.)
6. My English is not the best. Contributions to correct any grammar mistakes are welcomed. Just be gentle :P
