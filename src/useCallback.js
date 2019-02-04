export default ({useMemo, _setRegisterName}) => {

  return function useCallback(callback, checks) {
    const ret = useMemo(()=> callback, checks);
    _setRegisterName('useCallback');
    return ret;
  }

};
