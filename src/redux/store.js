import { createStore } from 'redux'

import userreducer from './reducers/userreducer'

const store = createStore(userreducer)

export default store