import { Container } from 'hostConfig'
import { Key, Props, Ref } from 'shared/ReactTypes'

import { Flags, NoFlags } from './fiberFlags'
import { WorkTag } from './workTags'

export class FiberNode {
  type: any
  tag: WorkTag
  key: Key
  ref: Ref
  stateNode: any

  return: FiberNode | null
  sibling: FiberNode | null
  child: FiberNode | null
  index: number

  pendingProps: Props
  memoizedProps: Props | null
  memoizedState: any
  alternate: FiberNode | null
  flags: Flags
  updateQueue: any

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    this.type = null
    this.tag = tag
    this.key = key
    this.ref = null
    this.stateNode = null

    this.return = null
    this.sibling = null
    this.child = null
    this.index = 0

    // 工作单元
    this.pendingProps = pendingProps
    this.memoizedProps = null
    this.memoizedState = null
    this.updateQueue = null

    this.alternate = null
    this.flags = NoFlags
  }
}

export class FiberRootNode {
  container: Container
  current: FiberNode
  finishedWork: FiberNode | null

  constructor(container: Container, hostRootFiber: FiberNode) {
    this.container = container
    this.current = hostRootFiber
    hostRootFiber.stateNode = this
    this.finishedWork = null
  }
}

export const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props
): FiberNode => {
  let wip = current.alternate

  if (wip === null) {
    // mount
    wip = new FiberNode(current.tag, pendingProps, current.key)
    wip.stateNode = current.stateNode
    wip.alternate = current
    current.alternate = wip
  } else {
    // update
    wip.pendingProps = pendingProps
    wip.flags = NoFlags
  }

  wip.type = current.type
  wip.updateQueue = current.updateQueue
  wip.child = current.child
  wip.memoizedProps = current.memoizedProps
  wip.memoizedState = current.memoizedState

  return wip
}
