export default ({ useMemo, _setRegisterName}) => {

  return function useImperativeHandle(ref, objectFunc, inputs) {
    const handle = useMemo(objectFunc, inputs);
    _setRegisterName('useImperativeHandle:objectFunc');
    console.log('ref:', ref)
    if (ref) {
      ref.current = handle;
    } else {
      console.warn('useImperativeHandle should be supply with a ref')
    }
    return ref;
  }

};
