function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children
        .flat()
        .filter(
          // falseも除外することで、flag && <p>...</p>のような条件付きレンダリングをサポートする
          (child) => child !== false && child !== null && child !== undefined,
        )
        .map((child) =>
          typeof child === 'object' ? child : createTextElement(child),
        ),
    },
  };
}

function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createDom(fiber) {
  const dom =
    fiber.type == 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

const isEvent = (key) => key.startsWith('on');
const isProperty = (key) => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);
function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = '';
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
  executeEffects();
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent);
    // 削除後はcommitしないようにすることで、commitWorkの再帰呼び出しで削除された要素にアクセスするのを防ぐ
    return;
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
  cleanupEffects(fiber); // アンマウント時のクリーンアップを実行する
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    // fiber.domがない場合は、子要素を再帰的に探して削除する
    let child = fiber.child;
    while (child) {
      commitDeletion(child, domParent);
      child = child.sibling;
    }
  }
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork = null;
let currentRoot = null;
let wipRoot = null;
let deletions = null;
let effects = [];

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

let wipFiber = null;
let hookIndex = null;

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function hookAction(hookFactory) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];

  const hook = hookFactory(oldHook);

  wipFiber.hooks.push(hook);
  hookIndex++;
  return hook;
}

function useState(initial) {
  const hook = hookAction((oldHook) => {
    // useStateのhookは状態(state: any)と更新関数の待ち列(que: Array<function>)を持つ
    const hook = oldHook
      ? {
          state: oldHook.state,
          queue: [...oldHook.queue], // ディープコピーしておく
        }
      : {
          state: initial,
          queue: [],
        };

    // 古いhookの更新関数をすべて実行して、最新の状態を計算する
    const actions = hook.queue;
    hook.queue = [];

    actions.forEach((action) => {
      hook.state = action(hook.state);
    });

    return hook;
  });

  const setState = (actionOrValue) => {
    // actionOrValueが関数ならそのまま、そうでないなら値を返す関数に変換する
    const action =
      typeof actionOrValue === 'function' ? actionOrValue : () => actionOrValue;

    // すぐに状態を更新するのではなく、更新関数を待ち列に追加する
    hook.queue.push(action);

    // UIの更新をスケジュールする
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  return [hook.state, setState];
}

function depsChanged(oldHook, deps) {
  if (!oldHook) return true; // 初回
  if (deps === undefined) return true; // 依存関係が指定されていない場合は常に再計算する
  if (oldHook.deps === undefined || oldHook.deps.length !== deps.length)
    return true; // 普通に使っていれば起きない条件

  // 依存関係のいずれかが変更された場合はtrueを返す
  // Object.isを使うと、NaNや-0/+0も正しく比較できる
  return deps.some((dep, i) => !Object.is(dep, oldHook.deps[i]));
}

function useMemo(factory, deps) {
  const hook = hookAction((oldHook) => {
    if (!depsChanged(oldHook, deps)) {
      return oldHook;
    }

    // useMemoのhookは値(value)と依存関係(deps)を持つ
    return {
      value: factory(),
      deps,
    };
  });

  return hook.value;
}

function useCallback(callback, deps) {
  return useMemo(() => callback, deps);
}

function useEffect(effect, deps) {
  // useEffectはhookの返り値が不要
  hookAction((oldHook) => {
    // useEffectのhookは依存関係(deps)とクリーンアップ関数(cleanup)を持つ
    const hook = {
      deps,
      cleanup: oldHook ? oldHook.cleanup : undefined,
    };

    // 依存関係が変更された場合は、クリーンアップ関数をeffectsに追加して、次のレンダリング後に実行する
    if (depsChanged(oldHook, deps)) {
      effects.push({
        hook,
        effect,
      });
    }

    return hook;
  });
}

// useEffectを実行する
function executeEffects() {
  effects.forEach(({ hook, effect }) => {
    hook.cleanup?.(); // クリーンアップ関数があれば実行する
    hook.cleanup = effect(); // effect関数を実行して、クリーンアップ関数を保存する
  });

  effects = [];
}

// アンマウント時にクリーンアップ関数を実行する
function cleanupEffects(fiber) {
  if (fiber.hooks) {
    fiber.hooks.forEach((hook) => {
      hook.cleanup?.();
    });
  }

  if (fiber.child) cleanupEffects(fiber.child);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && element.type == oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

const Didact = {
  createElement,
  render,
  useState,
  useMemo,
  useCallback,
  useEffect,
};

/** @jsx Didact.createElement */
function Counter() {
  const [count, setCount] = Didact.useState(1);
  const [label, setLabel] = Didact.useState('Hello!');
  const [flag, setFlag] = Didact.useState(false);

  const memoResult = useMemo(() => {
    console.log('useMemo計算実行');
    return count * 2;
  }, [count]);

  const callback = useCallback(() => {
    alert('フラグは' + (flag ? 'ON' : 'OFF') + 'です');
  }, [flag]);

  useEffect(() => {
    console.log('useEffect実行: ' + label);
    return () => {
      console.log('useEffectクリーンアップ');
    };
  }, [label]);

  return (
    <ul>
      <li>
        <h1 onClick={() => setCount((c) => c + 1)}>Count: {count}</h1>
        <p>Memoized Count * 2: {memoResult}</p>
      </li>
      <li>
        <input onChange={(e) => setLabel(e.target.value)} />
        <p>{label}</p>
      </li>
      <li>
        <button onClick={() => setFlag((f) => !f)}>
          {flag ? 'OFFにする' : 'ONにする'}
        </button>
      </li>
      <li>
        <button onClick={callback}>フラグの状態をアラート</button>
      </li>
    </ul>
  );
}

/** @jsx Didact.createElement */
function App() {
  const [showCounter, setShowCounter] = Didact.useState(true);
  return (
    <div>
      <button onClick={() => setShowCounter((s) => !s)}>
        {showCounter ? 'Hide' : 'Show'} Counter
      </button>
      {showCounter && <Counter />}
    </div>
  );
}

const element = <App />;
const container = document.getElementById('root');
Didact.render(element, container);
