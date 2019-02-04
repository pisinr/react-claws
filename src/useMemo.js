export default ({useRef, _setRegisterName}) => {

  return function useMemo(compute, checks) {
    const memoRef = useRef();
    _setRegisterName('useMemo');
    if (memoRef.current == null) {
      // inital call.
      let value = compute();
      memoRef.current = {
        compute,
        checks,
        value,
      }
      return value;
    } else {
      let shouldCompute = false;
      const prevChecks = memoRef.current.checks;
      if (checks == null) {
        shouldCompute = true;
      } else if (prevChecks.length != checks.length) {
        shouldCompute = true;
      } else {
        for(let i = 0; i < checks.length; i++) {
          if(prevChecks[i] !== checks[i]) {
            shouldCompute = true;
            break;
          }
        }
      }
      if (shouldCompute) {
        let value = compute();
        memoRef.current.compute = compute;
        memoRef.current.checks = checks;
        memoRef.current.value = value;
      }
      return memoRef.current.value;
    }
  }

};
