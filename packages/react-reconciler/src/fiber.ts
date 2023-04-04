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
  alternate: FiberNode | null
  flags: Flags

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

    this.pendingProps = pendingProps
    this.memoizedProps = null
    this.alternate = null
    this.flags = NoFlags
  }
}
