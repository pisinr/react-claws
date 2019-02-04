import withClaws, {
  customClaw,
  registerDefaultClaw,
} from './claws';

import useReducer from './useReducer';
import useRef from './useRef';
import useMemo from './useMemo';
import useCallback from './useCallback';
import useImperativeHandle from './useImperativeHandle';
import useDebugValue from './useDebugValue';

registerDefaultClaw('useDebugValue', useDebugValue, 1);
registerDefaultClaw('useRef', useRef, 1);
registerDefaultClaw('useReducer', useReducer, 2);
registerDefaultClaw('useMemo', useMemo, 2);
registerDefaultClaw('useCallback', useCallback, 3);
registerDefaultClaw('useImperativeHandle', useImperativeHandle, 3);

export default withClaws;
export { customClaw };
export { registerDefaultClaw };
