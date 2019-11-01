import { combineReducers } from 'redux'

import userreducer from './userreducer'
import formworeducer from './formworeducer'

const reducer = combineReducers({userreducer,formworeducer})

export default reducer;