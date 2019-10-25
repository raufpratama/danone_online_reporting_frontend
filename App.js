import React, { Component } from 'react'
import { Text, View } from 'react-native'
// import TugascontifeedScreen from './src/screens/Contifeed/TugascontifeedScreen'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import MainApp from './src/screens/Navigation/NavigationRoute'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainApp/>
      </Provider>
    )
  }
}

export default App
