import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import { ElementType, Key, Props, ReactElement, Ref } from 'shared/ReactTypes'

const ReactElement = function (
  type: ElementType,
  key: Key,
  ref: Ref,
  props: Props
): ReactElement {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: 'Shuo' as const
  }
  return element
}

export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
  let key: Key = null
  let ref: Ref = null
  const props: Props = {}

  for (const prop in config) {
    const val = config[prop]

    if (prop === 'key') {
      if (val != null) {
        key = '' + val
      }
      continue
    }

    if (prop === 'ref') {
      if (val != null) {
        ref = val
      }
      continue
    }

    if (Object.prototype.hasOwnProperty.call(config, prop)) {
      props[prop] = val
    }

    const maybeChildrenLength = maybeChildren.length
    if (maybeChildrenLength) {
      if (maybeChildrenLength === 1) {
        props.children = maybeChildren[0]
      } else {
        props.children = maybeChildren
      }
    }

    return ReactElement(type, key, ref, props)
  }
}

export const jsxDEV = jsx
