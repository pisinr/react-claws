export default ({ useState, useRef, _setRegisterName }) => {

  return function useReducer(reducer, initialState, initialAction) {
    let initialActionRef = useRef(initialAction);
    _setRegisterName('useReducer:initialAction')
    if (initialActionRef.current) {
      initialState = reducer(initialState, initialAction);
      initialActionRef.current = null;
    }
    let storeStateRef = useRef(initialState);
    _setRegisterName('useReducer:storeState');
    let [state, setState] = useState(initialState);
    _setRegisterName('useReducer:state');
    let dispatchRef = useRef(null);
    _setRegisterName('useReducer:dispatch');

    if (!dispatchRef.current) {
      dispatchRef.current = (action) => {
        let storeState = storeStateRef.current;
        const newState = reducer(storeState, action);
        setState(newState);
        storeStateRef.current = newState;
        return newState;
      }
    }

    return [state, dispatchRef.current];
  }

};
