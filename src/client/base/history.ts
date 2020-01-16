import { createBrowserHistory, createMemoryHistory } from 'history'

interface HistoryParams {
  initialEntries?: any[]
}

export const createUniversalHistory = ({ initialEntries = [] }: HistoryParams = {}) => {
  if (__BROWSER__) {
    const history = (window as any).browserHistory || createBrowserHistory()
    if (process.env.NODE_ENV === 'development' && !window.browserHistory) {
      window.browserHistory = history
    }
    return history
  }
  return createMemoryHistory({ initialEntries })
}

export default createUniversalHistory
