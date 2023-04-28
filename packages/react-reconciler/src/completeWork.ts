import {
  appendInitialChild,
  Container,
  createInstance,
  createTextInstance,
  Instance
} from 'hostConfig'

import { FiberNode } from './fiber'
import { NoFlags, Update } from './fiberFlags'
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText
} from './workTags'

function markUpdate(fiber: FiberNode) {
  fiber.flags |= Update
}

// 自下而上执行
// 将flag向上冒泡
// mount的时候构建DOM，赋值到stateNode
export const completeWork = (wip: FiberNode) => {
  const newProps = wip.pendingProps
  const current = wip.alternate

  switch (wip.tag) {
    case HostComponent:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // 构建DOM
        const instance = createInstance(wip.type, newProps)
        // 将wip下的dom 插入到instance
        appendAllChildren(instance, wip)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      break
    case HostText:
      if (current !== null && wip.stateNode) {
        // update
        const oldText = current.memoizedState.content
        const newText = newProps.content
        if (oldText !== newText) {
          markUpdate(wip)
        }
      } else {
        // 构建DOM
        const instance = createTextInstance(newProps.content)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      break
    case HostRoot:
      bubbleProperties(wip)
      break
    case FunctionComponent:
      bubbleProperties(wip)
      break
    default:
      if (__DEV__) {
        console.warn('未处理的completeWork', wip)
      }
      break
  }
}

// <div>       <---parent
// 	<Domo />   ---> <div>123</div>
// 	<span>456</span>
// </div>
// parent: 父级DOM   wip: 父级Fiber
function appendAllChildren(parent: Container | Instance, wip: FiberNode) {
  let node = wip.child

  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode)
    } else if (node.child !== null) {
      node.child.return = node
      node = node.child
      continue
    }

    // ??? 想不到什么场景可以进入
    if (node === wip) {
      console.error('debugger appendAllChildren')
      return
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return
      }
      node = node.return
    }

    node.sibling.return = node.return
    node = node.sibling
  }
}

// 从下而上，给wip赋值subtreeFlags,将下一级的child和sibling的flags都汇总上来
function bubbleProperties(wip: FiberNode) {
  let subtreeFlags = NoFlags
  let child = wip.child

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags
    subtreeFlags |= child.flags

    // ??? 让所有的child的return都指向自己
    child.return = wip
    child = child.sibling
  }

  wip.subtreeFlags = subtreeFlags
}
