// Third-party Imports
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import { persistStore, persistReducer } from 'redux-persist'

// Slice Imports
import calendarReducer from '@/redux-store/slices/calendar'
import userReducer from '@/redux-store/slices/userSlice'
import MenuReducer from '@/redux-store/slices/menuSlice'

// Compining reducers
const rootReducer = combineReducers({
  calendar: calendarReducer,
  user: userReducer,
  menu: MenuReducer
}) as any

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'menu'],
  transforms: [
    encryptTransform({
      secretKey: process.env.NEXT_PUBLIC_PERSIST_SECRET || 'fallback-secret',
      onError: error => {
        console.error('Persist encryption error:', error)
      }
    })
  ]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const persistor = persistStore(store)
// persistor.pause()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
