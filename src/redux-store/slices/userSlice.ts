// redux-store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  userData: any | null
  filter_with_city: boolean
  is_tab_active: boolean
}

const initialState: UserState = {
  userData: null,
  filter_with_city: true,
  is_tab_active: true
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<any>) => {
      state.userData = action.payload
    },
    clearUserData: state => {
      state.userData = null
    },
    setFilterWithCity: (state, action: PayloadAction<boolean>) => {
      state.filter_with_city = action.payload
    },
    setIsTabActive: (state, action: PayloadAction<boolean>) => {
      state.is_tab_active = action.payload
    }
  }
})

export const { setUserData, clearUserData, setFilterWithCity, setIsTabActive } = userSlice.actions
export default userSlice.reducer
