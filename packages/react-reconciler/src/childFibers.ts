import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { ReactElement } from 'shared/ReactTypes'

import { createFiberFromElement, FiberNode } from './fiber'
import { Placement } from './fiberFlags'
import { HostText } from './workTags'

function ChildReconciler(shouldTrackEffects: boolean) {
  // 根据element和currentFiber,创建新的Fiber
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElement
  ) {
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
    // 文本节点
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      // 如果是首次渲染，根据newChild创建fiber,并标记上placement
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild)
      )
    }
    if (__DEV__) {
      console.warn('未实现的reconcile类型', newChild)
    }
    return null
  }
}

export const reconcileChildFibers = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false)
