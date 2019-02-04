import React from 'react';
import { createContext } from 'react';
import withClaws from 'react-claws';

// Example Component

// import other hooks as usual.
import useDoubleCounter from './useDoubleCounter';

export default withClaws(({ useState, useEffect, useRef, useCallback }) => {

  // Write your component as if you would with hook.
  function ToggleButton({title1, title2 }) {
    const [flag, setFlag] = useState(true);
    const [name, setName] = useState('');
    const [counter, doubleCount] = useDoubleCounter();
    const onChange = useCallback((evt) => {
      setName(evt.target.value.toUpperCase())
    }, [])
    const textBox = useRef();

    const toggle = () => setFlag(!flag);

    useEffect(() => {
      console.log('ToggleButton counter didUpdate:', counter);
      return () => {
        console.log('ToggleButton counter cleanup')
      }
    }, [counter]);

    return (
      <div>
        <button onClick={() => textBox.current.focus() }>
          Focus
        </button>
        <button onClick={toggle}>
          {flag ? title1 : title2}
        </button>
        <button onClick={doubleCount}>
          INC: {`${counter}`}
        </button>
        <input ref={textBox} type="text" value={name} onChange={onChange} />
      </div>
    )
  };

  return ToggleButton;
}, 'Claws(ToggleButton)');
