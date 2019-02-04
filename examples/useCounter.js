import { customClaw } from 'react-claws';

// Example: customHook.

export default customClaw(({useState}) => {

  // write your hook as if you would normally
  return function useCounter() {
    const [count, setCount] = useState(0);
    const inc = () => setCount((c) => c+1);
    return [count, inc];
  }

});
