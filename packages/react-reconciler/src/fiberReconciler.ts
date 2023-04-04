import { Container } from 'hostConfig'
import { ReactElement } from 'shared/ReactTypes'

import { FiberNode, FiberRootNode } from './fiber'
import { createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue'
import { scheduleUpdateOnFiber } from './workLoop'
import { HostRoot } from './workTags'

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
  enqueueUpdate(hostRootFiber.updateQueue, update)
  scheduleUpdateOnFiber(hostRootFiber)
  return element
}
