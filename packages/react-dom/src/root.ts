import {
  createContainer,
  updateContainer
} from 'react-reconciler/src/fiberReconciler'
import { ReactElement } from 'shared/ReactTypes'

import { Container } from './hostConfig'

// ReactDOM.createRoot(root).render(<App />)
export function createRoot(container: Container) {
  const root = createContainer(container)

  return {
    render(element: ReactElement) {
      updateContainer(element, root)
    }
  }
}
