import { appendChildToContainer, Container, Instance } from 'hostConfig'

import { FiberNode, FiberRootNode } from './fiber'
import { MutationMask, NoFlags, Placement } from './fiberFlags'
import { HostComponent, HostRoot, HostText } from './workTags'

let nextEffect: FiberNode | null = null

export const commitMutationEffects = (finishedWork: FiberNode) => {
  nextEffect = finishedWork

  while (nextEffect !== null) {
    const child: FiberNode | null = nextEffect.child
    if (
      (nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
      child !== null
    ) {
      nextEffect = child
    } else {
      // 叶子节点或者没有subtreeFlags了，就没必要再往下遍历了
      up: while (nextEffect !== null) {
        commitMuationEffectsOnFiber(nextEffect)
        const sibling: FiberNode | null = nextEffect.sibling
        if (sibling !== null) {
          nextEffect = sibling
          break up
        } else {
          nextEffect = nextEffect.return
        }
      }
    }
  }
}

// 这个finishedWork一定存在flags
const commitMuationEffectsOnFiber = (finishedWork: FiberNode) => {
  const flags = finishedWork.flags
  // ??? if (flags & Placement),老师的写法应该任何情况都能进去 0 or Placement
  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork)
    // 移除Placement
    finishedWork.flags &= ~Placement
  }
}

const commitPlacement = (finishedWork: FiberNode) => {
  if (__DEV__) {
    console.warn('开始执行Placement', finishedWork)
  }

  const hostParent = getHostParent(finishedWork)

  if (hostParent !== null) {
    appendPlacementNodeIntoContainer(finishedWork, hostParent)
  }
}

// 根据Fiber寻找父级DOM
function getHostParent(fiber: FiberNode): Container | Instance | null {
  let parent = fiber.return
  while (parent) {
    const parentTag = parent.tag
    if (parentTag === HostComponent) {
      return parent.stateNode as Container
    }
    if (parentTag === HostRoot) {
      return (parent.stateNode as FiberRootNode).container
    }
    parent = parent.return
  }

  if (__DEV__) {
    console.warn('为找到Host Parent')
  }

  return null
}

// <App>
//   <Demo />
//   <span></span>
// </App>
// 将finishedWork对应的dom添加到hostParent
function appendPlacementNodeIntoContainer(
  finishedWork: FiberNode,
  hostParent: Container | Instance
) {
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    appendChildToContainer(hostParent, finishedWork.stateNode)
    return
  }

  const child = finishedWork.child
  if (child !== null) {
    appendPlacementNodeIntoContainer(child, hostParent)
    let sibling = child.sibling
    while (sibling !== null) {
      appendPlacementNodeIntoContainer(child, hostParent)
      sibling = sibling.sibling
    }
  }
}
