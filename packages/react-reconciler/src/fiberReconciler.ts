import { Container } from 'hostConfig'
import { ReactElement } from 'shared/ReactTypes'

import { FiberNode, FiberRootNode } from './fiber'
import { createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue'
import { scheduleUpdateOnFiber } from './workLoop'
import { HostRoot } from './workTags'

//    fiberRootNode
// current⬇    ⬆stateNode
//    hostRootFiber
export function createContainer(container: Container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null)
  const root = new FiberRootNode(container, hostRootFiber)
  hostRootFiber.updateQueue = createUpdateQueue()
  return root
}

export function updateContainer(
  element: ReactElement | null,
  root: FiberRootNode
) {
  const hostRootFiber = root.current
  const update = createUpdate<ReactElement | null>(element)
  // 向hostRootFiber中加入一个更新任务
  enqueueUpdate(hostRootFiber.updateQueue, update)
  // 从hostRootFiber开始调度更新
  scheduleUpdateOnFiber(hostRootFiber)
  return element
}
