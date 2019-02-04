import { createRef } from 'react';

export default ({ useState, _setRegisterName}) => {

  return function useRef(initialValue) {
    // eslint-disable-next-line no-unused-vars
    const [ref, _] = useState({});
    _setRegisterName('useRef');
    if (ref.value == null) {
      ref.value = createRef();
      if (initialValue !== undefined) {
        ref.value.current = initialValue;
      }
    }
    return ref.value;
  }

};
