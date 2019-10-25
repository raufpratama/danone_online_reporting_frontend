import React, { Component } from 'react'
import { Text, View, ActivityIndicator, AsyncStorage } from 'react-native'

const environment = require('../assets/utils/environment')

class AuthScreen extends Component {
    constructor(props) {
        super(props)
        this._checkLogin()
    }

    _checkLogin = async() => {
        const login = await AsyncStorage.getItem(environment.ASYNC_USER_TOKEN)
        this.props.navigation.navigate(login ? 'App':'Login')
    }

    render() {
        return (
            <View style={{flex:1,justifyContent:'center'}}>
                <ActivityIndicator size={30}/>
            </View>
        )
    }
}

export default AuthScreen
