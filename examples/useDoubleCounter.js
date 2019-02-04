import { customClaw } from 'react-claws';

// Example custom hook that use other custom hooks.

// You can import other hooks
import useCounter from './useCounter';

export default customClaw(() => {

  return function useDoubleCounter() {
    const [count, inc] = useCounter();
    const double = () => {
      inc();
      inc();
    }
    return [count, double];
  }

});
