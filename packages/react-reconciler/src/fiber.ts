import { Container } from 'hostConfig'
import { Key, Props, ReactElement, Ref } from 'shared/ReactTypes'

import { Flags, NoFlags } from './fiberFlags'
import { FunctionComponent, HostComponent, WorkTag } from './workTags'

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
  subtreeFlags: Flags
  updateQueue: any
  deletions: FiberNode[] | null

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
    // 如果是函数式组件，这个就是hooks的链表的第一个hook
    this.memoizedState = null
    this.updateQueue = null

    this.alternate = null

    // 副作用
    this.flags = NoFlags
    this.subtreeFlags = NoFlags
    this.deletions = null
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

//            fiberRootNode
//         current⬇    ⬆stateNode                      alternate
// current:   hostRootFiber(包含updateQueue)             ➡ ⬅             wip（复用current）
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
    wip.subtreeFlags = NoFlags
    wip.deletions = null
  }

  wip.type = current.type
  wip.updateQueue = current.updateQueue
  wip.child = current.child
  wip.memoizedProps = current.memoizedProps
  wip.memoizedState = current.memoizedState

  return wip
}

// 根据jsx创建Fiber
export function createFiberFromElement(element: ReactElement): FiberNode {
  const { type, key, props } = element
  // 先给一个默认的tag
  let fiberTag: WorkTag = FunctionComponent

  if (typeof type === 'string') {
    fiberTag = HostComponent
  } else if (typeof type === 'function' && __DEV__) {
    console.warn('未定义的类型', element)
  }
  const fiber = new FiberNode(fiberTag, props, key)
  fiber.type = type
  return fiber
}
