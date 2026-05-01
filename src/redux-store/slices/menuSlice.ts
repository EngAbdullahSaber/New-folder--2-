import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { castDraft } from 'immer'
import { VerticalMenuDataType, HorizontalMenuDataType } from '@/types/menuTypes'

interface MenuState {
  verticalMenuData: VerticalMenuDataType[]
  horizontalMenuData: HorizontalMenuDataType[]
  systemObjects: any[]
  isInitialized: boolean
}

const initialState: MenuState = {
  verticalMenuData: [],
  horizontalMenuData: [],
  systemObjects: [],
  isInitialized: false
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuData: (
      state,
      action: PayloadAction<{
        vertical: VerticalMenuDataType[]
        horizontal: HorizontalMenuDataType[]
        system: any[]
      }>
    ) => {
      state.verticalMenuData = castDraft(action.payload.vertical)
      state.horizontalMenuData = castDraft(action.payload.horizontal)
      state.systemObjects = castDraft(action.payload.system)
      state.isInitialized = true
    },

    clearMenu: state => {
      state.verticalMenuData = []
      state.horizontalMenuData = []
      state.systemObjects = []
      state.isInitialized = false
    }
  }
})

export const { setMenuData, clearMenu } = menuSlice.actions
export default menuSlice.reducer
