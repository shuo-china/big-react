import { ReactElement } from 'shared/ReactTypes'

import { mountChildFibers, reconcileChildFibers } from './childFibers'
import { FiberNode } from './fiber'
import { processUpdateQueue, UpdateQueue } from './updateQueue'
import { HostComponent, HostRoot, HostText } from './workTags'

// 比较，返回子FiberNode(child)
export const beginWork = (wip: FiberNode) => {
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip)
    case HostComponent:
      return updateHostComponent(wip)
    case HostText:
      return null
    default:
      if (__DEV__) {
        console.warn(`beginWork未实现的tag:${wip.tag}`)
      }
      break
  }
  return null
}

// 拿到更新队列中的update,执行这个update,拿到新的memoizedState(ReactElement)
function updateHostRoot(wip: FiberNode) {
  const baseState = wip.memoizedState
  const updateQueue = wip.updateQueue as UpdateQueue<ReactElement>
  const pending = updateQueue.shared.pending
  updateQueue.shared.pending = null
  const { memoizedState } = processUpdateQueue<ReactElement>(baseState, pending)
  wip.memoizedState = memoizedState

  const nextChildren = wip.memoizedState
  reconcileChildren(wip, nextChildren)
  return wip.child
}

// 原生标签
function updateHostComponent(wip: FiberNode) {
  const nextProps = wip.pendingProps
  const nextChildren = nextProps.children
  reconcileChildren(wip, nextChildren)
  return wip.child
}

// 用父级fiberNode和它下级的jsx生成子fiber,同时给子fiber添加flag
function reconcileChildren(wip: FiberNode, children: ReactElement) {
  const current = wip.alternate

  if (current !== null) {
    // update
    wip.child = reconcileChildFibers(wip, current?.child, children)
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, children)
  }
}
