import {createReducer, PayloadAction} from '@reduxjs/toolkit'

import * as actions from '../actions/sfActions'
import {SFState} from '../types'

const initialState: SFState = {}

const sfReducer = createReducer(initialState, {
  [actions.setBackendLink.type]: (state, action: PayloadAction<string>) => {
    state.initBackendLink = action.payload
  }
})

export default sfReducer
