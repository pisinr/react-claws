import React from 'react';
import { Component } from 'react';

const CLAWS = Symbol('claws');

let _currentComponent = null;
export function currentComponent() {
  if (_currentComponent) {
    console.error('Claws being used outside rendering. _currentComponent is null');
  }
  return _currentComponent;
}

export function customClaw(injectsBlock) {
  return (...args) => {
    return injectsBlock(_currentComponent[CLAWS])(...args)
  };
}

let defaultClaws = [];
let clawUsed = false;
export function registerDefaultClaw(name, injectsBlock, order, override) {
  if (clawUsed) {
    console.warn('registerDefaultClaw is called after component is rendered.');
  }
  let oldClaw = null;
  for(let i = 0; i < defaultClaws.length; i++) {
    let claw = defaultClaws[i];
    if (claw.name === name) {
      oldClaw = claw;
      if (override) {
        defaultClaws[i].injectsBlock = injectsBlock;
        defaultClaws[i].order = order;
      }
    }
  }
  if (!oldClaw) {
    defaultClaws.push({
      name,
      injectsBlock,
      order,
    })
  }
  defaultClaws.sort((cf1, cf2) => cf1.order - cf2.order);
}

export default function withClaws(injectsBlock, displayName) {

  const component = class extends Component {
    constructor(props, ref) {
      super(props, ref);
      this.state = {
        registerStacks: []
      }
      _currentComponent = this;
      this.runState = 'init';
      this.registerStacks = this.state.registerStacks;
      this.registerIndex = 0;

      this[CLAWS] = {
        _useRegister: createUseRegister(this),
        _getRegister: createGetRegister(this),
        _setRegisterName: createSetRegisterName(this),
        useState: createUseState(this),
        useEffect: createUseEffect(this),
        useLayoutEffect: createUseEffect(this, true),
        useContext: createUseContext(this),
      }
      clawUsed = true;
      for(let clawConfig of defaultClaws) {
        this[CLAWS][clawConfig.name] = clawConfig.injectsBlock(this[CLAWS], this);
      }
      this.componentBlock = injectsBlock(this[CLAWS]);
      // Run on init to trigger stacks setup.
      // eslint-disable-next-line no-unused-vars
      let _discarded = this.componentBlock(this.props, ref);
    }

    prepareRenderState() {
      _currentComponent = this;
      this.registerIndex = 0;
      this.runState = 'render';
    }

    render() {
      this.prepareRenderState();
      const CComponent = this.componentBlock;

      let ContextWrapped = <CComponent {...this.props} />;
      for(let register of this.registerStacks) {
        if (register.type !== 'useContext') { continue; }
        const Consumer = register.context.Consumer;
        let InnerChild = ContextWrapped;
        ContextWrapped = (
          <Consumer>
            {(value) => {
              register.value = value;
              return InnerChild
            }}
          </Consumer>
        )
      }

      return ContextWrapped
    }

    componentDidMount() {
      for(let register of this.registerStacks) {
        if (register.type !== 'useEffect' && register.type !== 'useLayoutEffect') { continue; }
        let cleanup = register.didUpdate();
        register.cleanup = cleanup;
        register.prevChecks = register.checks;
        register.checks = null;
      }
    }

    componentDidUpdate() {
      for(let register of this.registerStacks) {
        if (register.type !== 'useEffect' && register.type !== 'useLayoutEffect') { continue; }
        let shouldRunEffect = true;
        let { checks, prevChecks } = register;
        if (checks) {
          shouldRunEffect = false;
          prevChecks = prevChecks || [];
          for(let ci = 0; ci < checks.length; ci++) {
            if (checks[ci] !== prevChecks[ci]) {
              shouldRunEffect = true;
              break;
            }
          }
        }
        if (shouldRunEffect) {
          if (register.cleanup) {
            register.cleanup();
            register.cleanup = null;
          }
          register.cleanup = register.didUpdate();
        }
        register.prevChecks = register.checks;
        register.checks = null;
      }
    }

    componentWillUnmount() {
      for(let register of this.registerStacks) {
        if (register.type !== 'useEffect' && register.type !== 'useLayoutEffect') { continue; }
        if (register.cleanup) {
          register.cleanup();
          register.cleanup = null;
        }
      }
    }

  }
  if (displayName) {
    component.displayName = displayName;
  }
  return component;
}

function createUseRegister(self) {
  return (registerType) => {
    const currentRegisterIndex = self.registerIndex++;
    // if (self.runState === 'init') {
    if (!self.registerStacks[currentRegisterIndex]) {
      self.registerStacks.push({
        type: registerType,
        registerName: registerType,
      });
    }
    return [self.registerStacks[currentRegisterIndex], self.runState];
  }
}

function createGetRegister(self) {
  return () => {
    return [self.registerStacks[self.registerIndex - 1], self.runState];
  }
}

function createSetRegisterName(self) {
  return (registerName) => {
    return self.registerStacks[self.registerIndex - 1].registerName = registerName;
  }
}

// TODO: These can probably be moved to their separated files
//  and changed to use `registerDefaultHook` approach.

function createUseState(self) {
  return (initial) => {
    const currentRegisterIndex = self.registerIndex++;
    // if (self.runState === 'init') {
    if (!self.registerStacks[currentRegisterIndex]) {
      self.registerStacks.push({
        type: 'useState',
        value: initial
      });
    }
    const register = self.registerStacks[currentRegisterIndex];
    let setState = (updater) => {
      let newValue = updater;
      if (typeof updater === 'function') {
        newValue = updater(register.value);
      }
      register.value = newValue;
      self.forceUpdate();
    }
    return [register.value, setState];
  }
}

function createUseEffect(self, layoutEffect) {
  return (didUpdate, checks) => {
    const currentRegisterIndex = self.registerIndex++;
    // if (self.runState === 'init') {
    if (!self.registerStacks[currentRegisterIndex]) {
      self.registerStacks.push({
        type: layoutEffect ? 'useLayoutEffect' : 'useEffect',
        didUpdate,
        prevChecks: null,
        checks: null,
        cleanup: null,
      });
    }
    self.registerStacks[currentRegisterIndex].didUpdate = didUpdate;
    self.registerStacks[currentRegisterIndex].checks = checks;
  }
}

function createUseContext(self) {
  return (Context) => {
    const currentRegisterIndex = self.registerIndex++;
    // if (self.runState === 'init') {
    if (!self.registerStacks[currentRegisterIndex]) {
      self.registerStacks.push({
        type: 'useContext',
        context: Context,
        value: Context.Consumer._currentValue,
      });
    }
    return self.registerStacks[currentRegisterIndex].value;
  }
}
