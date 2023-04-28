import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { Props, ReactElement } from 'shared/ReactTypes'

import {
  createFiberFromElement,
  createWorkInProgress,
  FiberNode
} from './fiber'
import { ChildDeletion, Placement } from './fiberFlags'
import { HostText } from './workTags'

function ChildReconciler(shouldTrackEffects: boolean) {
  function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode) {
    if (!shouldTrackEffects) {
      return
    }
    const deletions = returnFiber.deletions
    if (deletions === null) {
      returnFiber.deletions = [childToDelete]
      returnFiber.flags |= ChildDeletion
    } else {
      deletions.push(childToDelete)
    }
  }

  // 根据element和currentFiber,创建新的Fiber
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElement
  ) {
    const key = element.key
    // update
    work: if (currentFiber !== null) {
      if (currentFiber.key === key) {
        if (element.$$typeof === REACT_ELEMENT_TYPE) {
          if (currentFiber.type === element.type) {
            const existing = useFiber(currentFiber, element.props)
            existing.return = returnFiber
            return existing
          }
          deleteChild(returnFiber, currentFiber)
          break work
        } else {
          if (__DEV__) {
            console.warn('还未实现的react类型', element)
            break work
          }
        }
      } else {
        // 删掉旧的
        deleteChild(returnFiber, currentFiber)
      }
    }
    // 根据jsx创建fiber
    const fiber = createFiberFromElement(element)
    fiber.return = returnFiber
    return fiber
  }

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number
  ) {
    // update
    if (currentFiber !== null) {
      // 类型没变
      if (currentFiber.tag === HostText) {
        const existing = useFiber(currentFiber, { content })
        existing.return = returnFiber
        return existing
      }
      deleteChild(returnFiber, currentFiber)
    }
    const fiber = new FiberNode(HostText, { content }, null)
    fiber.return = returnFiber
    return fiber
  }

  function placeSingleChild(fiber: FiberNode) {
    // 如果可以收集副作用，且当前fiber是新增的
    if (shouldTrackEffects && fiber.alternate === null) {
      fiber.flags |= Placement
    }
    return fiber
  }

  return function reconcileChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild?: ReactElement
  ) {
    // 单节点
    if (typeof newChild === 'object' && newChild !== null) {
      if (newChild.$$typeof === REACT_ELEMENT_TYPE) {
        // 如果是首次渲染，根据newChild创建fiber,并标记上placement
        return placeSingleChild(
          reconcileSingleElement(returnFiber, currentFiber, newChild)
        )
      } else {
        if (__DEV__) {
          console.warn('未实现的$$typeof类型', newChild.$$typeof)
        }
        return null
      }
    }
    // 多节点
    // 新节点是文本节点
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      // 如果是首次渲染，根据newChild创建fiber,并标记上placement
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild)
      )
    }

    // 兜底
    if (currentFiber) {
      deleteChild(returnFiber, currentFiber)
    }

    if (__DEV__) {
      console.warn('未实现的reconcile类型', newChild)
    }
    return null
  }
}

function useFiber(fiber: FiberNode, pendingProps: Props): FiberNode {
  const clone = createWorkInProgress(fiber, pendingProps)
  clone.index = 0
  clone.sibling = null
  return clone
}

export const reconcileChildFibers = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false)
