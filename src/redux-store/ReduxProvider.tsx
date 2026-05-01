'use client'

// React Imports
import { ReactNode, useEffect } from 'react'

// Third-party Imports
import { Provider } from 'react-redux'
import { useSession } from 'next-auth/react'

import { store, persistor } from '@/redux-store'
import { PersistGate } from 'redux-persist/integration/react'

const PersistenceController = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PersistenceController>{children}</PersistenceController>
      </PersistGate>
    </Provider>
  )
}

export default ReduxProvider
