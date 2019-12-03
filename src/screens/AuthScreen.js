import React, { Component } from 'react'
import { Text, View, ActivityIndicator, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'

import { userLogin } from '../redux/actions/useractions'

const environment = require('../assets/utils/environment')
const managers = ["PLANT MANAGER","ENGINEERING MANAGER","MANUFACTURING MANAGER"]

class AuthScreen extends Component {
    constructor(props) {
        super(props)
        this._checkLogin()
    }

    _checkLogin = async() => {
        const get_data = await AsyncStorage.getItem(environment.ASYNC_USER_TOKEN)
        if(get_data) {
            const result_data = JSON.parse(get_data)
            console.log(result_data)
            this.props.user_Login(result_data)
            this.props.navigation.navigate(managers.includes(result_data.res.Jabatan) ? 'Manager' : 'App')
        } else {
            this.props.navigation.navigate('Login')
        }
    }

    render() {
        return (
            <View style={{flex:1,justifyContent:'center'}}>
                <ActivityIndicator size={30}/>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        user_Login : (data)=>dispatch(userLogin(data))
    }
}

export default connect(null,mapDispatchToProps)(AuthScreen)
