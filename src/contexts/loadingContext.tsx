'use client'
import { onEvent } from '@/libs/eventBus'
import { toggleLoading } from '@/shared'
import { createContext, useEffect, useReducer } from 'react'

type LoadingList = 'list' | 'details' | 'create' | 'update' | 'delete' | 'download'

export interface IInternalState {
  loading: LoadingList[]
}

export const internalState: IInternalState = {
  loading: []
}

interface IProps {
  children: React.ReactNode
}

export const LoadingContext = createContext(internalState)

type Action = { type: 'LOADING'; payload: { loading: LoadingList[] | LoadingList } } | { type: 'CLEAR_LOADING' }

const reducer = (state: IInternalState, action: Action): IInternalState => {
  switch (action.type) {
    case 'LOADING': {
      return {
        ...state,
        loading: toggleLoading(state.loading, action.payload.loading)
      }
    }
    case 'CLEAR_LOADING': {
      return {
        ...state,
        loading: [] // clear all
      }
    }
  }
}

const LoadingContextProvider: React.FC<IProps> = props => {
  const [state, dispatch] = useReducer(reducer, internalState)

  useEffect(() => {
    const loadingEmit = onEvent('loading', event => {
      dispatch({ type: 'LOADING', payload: { loading: event.detail.type } })
    })

    return loadingEmit
  }, [])

  useEffect(() => {
    if (state.loading.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_LOADING' })
      }, 5000) // clears after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [state.loading])

  // useEffect(() => {
  //   //console.log('loading', state.loading)
  // }, [state.loading])

  return <LoadingContext.Provider value={state}>{props.children}</LoadingContext.Provider>
}

export default LoadingContextProvider
