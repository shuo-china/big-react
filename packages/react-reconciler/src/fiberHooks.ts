import { FiberNode } from './fiber'

// 获取函数式组件的jsx
export function renderWithHooks(wip: FiberNode) {
  const Component = wip.type
  const props = wip.pendingProps
  const children = Component(props)
  return children
}
