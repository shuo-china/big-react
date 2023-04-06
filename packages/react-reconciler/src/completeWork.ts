import {
  appendInitialChild,
  Container,
  createInstance,
  createTextInstance,
  Instance
} from 'hostConfig'

import { FiberNode } from './fiber'
import { NoFlags } from './fiberFlags'
import { HostComponent, HostRoot, HostText } from './workTags'

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
        // 插入到DOM TREE
        appendAllChildren(instance, wip)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      return null
    case HostText:
      if (current !== null && wip.stateNode) {
        // update
      } else {
        // 构建DOM
        const instance = createTextInstance(newProps.content)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      return null
    case HostRoot:
      bubbleProperties(wip)
      return null
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

function bubbleProperties(wip: FiberNode) {
  let subtreeFlags = NoFlags
  let child = wip.child

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags
    subtreeFlags |= child.flags

    child.return = wip
    child = child.sibling
  }

  wip.subtreeFlags = subtreeFlags
}
