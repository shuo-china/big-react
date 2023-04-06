import { beginWork } from './beginWork'
import { commitMutationEffects } from './commitWork'
import { completeWork } from './completeWork'
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber'
import { MutationMask, NoFlags } from './fiberFlags'
import { HostRoot } from './workTags'

let workInProgress: FiberNode | null = null

function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInProgress(root.current, {})
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  const root = markUpdateFromFiberToRoot(fiber)
  renderRoot(root)
}

// 从任意Fiber遍历到FiberRootNode
function markUpdateFromFiberToRoot(fiber: FiberNode) {
  // hostRootFiber
  let node = fiber
  let parent = node.return
  // parent === null 说明node是HostRootFiber
  while (parent !== null) {
    node = parent
    parent = node.return
  }
  // 返回FiberRootNode
  if (node.tag === HostRoot) {
    return node.stateNode
  }
  return null
}

function renderRoot(root: FiberRootNode) {
  prepareFreshStack(root)

  try {
    workLoop()
  } catch (e) {
    if (__DEV__) {
      console.warn('workLoop发生错误', e)
    }
    workInProgress = null
  }

  const finishedWork = root.current.alternate
  root.finishedWork = finishedWork

  commitRoot(root)
}

function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork

  if (finishedWork === null) {
    return
  }

  if (__DEV__) {
    console.warn('commit阶段开始', finishedWork)
  }

  root.finishedWork = null

  const subtreeHasEffect =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags

  if (subtreeHasEffect || rootHasEffect) {
    // beforeMutation
    // mutation
    commitMutationEffects(finishedWork)
    root.current = finishedWork
    // layout
  } else {
    root.current = finishedWork
  }
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber)
  fiber.memoizedProps = fiber.pendingProps

  if (next === null) {
    completeUnitOfWork(fiber)
  } else {
    workInProgress = next
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber
  while (node !== null) {
    completeWork(node)
    const sibling = node.sibling
    if (sibling !== null) {
      workInProgress = sibling
      return
    } else {
      node = node.return
      workInProgress = node
    }
  }
}
