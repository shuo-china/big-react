// @ts-ignore
import { createRoot } from 'react-dom'
import { ReactElement } from 'shared/ReactTypes'

export function renderIntoDocument(element: ReactElement) {
  const div = document.createElement('div')
  return createRoot(div).render(element)
}
