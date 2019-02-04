export default ({_useRegister}) => {

  return function useDebugValue(value, format) {
    const register = _useRegister('useDebugValue');
    register.value = value;
    register.formatFunction = format;
  }

};
