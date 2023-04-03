export type ElementType = any
export type Key = string | null
export type Props = any
export type Ref = any

export interface ReactElement {
  $$typeof: symbol | number
  type: ElementType
  key: Key
  props: Props
  ref: Ref
  __mark: 'Shuo'
}
