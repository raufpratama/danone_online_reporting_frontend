import React, { Component } from 'react'
import { View, Text, Image, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import { Input, Icon, Button } from 'react-native-elements'

import { userLogin } from '../redux/actions/useractions'
import LoadingState from './sub_components/LoadingState'

const agua = require('../assets/images/AGUA.png')
const route_url = require('../assets/utils/urls')
const colors = require('../assets/utils/colors')
const environment = require('../assets/utils/environment')
const managers = ["PLANT MANAGER","ENGINEERING MANAGER","ASSET ENGINEER","MANUFACTURING MANAGER"]

class LoginScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            NIK:'',
            password:'',
            isVisible:false
        }
    }

    _login = () => {
        const { NIK, password } = this.state;
        this.setState({isVisible:true})
        if(NIK.length > 0 && password.length >0) {
            axios.post(`${route_url.header}/user/login`,{NIK,Password:password})
            .then(async response=>{
                if(response.data.res !== "NIK salah" || response.data.res !== "Password salah") {
                    console.log(response.data)
                    const respon = response.data
                    respon.res.nik = NIK
                    this.props.user_Login(respon)
                    await AsyncStorage.setItem(environment.ASYNC_USER_TOKEN,JSON.stringify(respon))
                    this.setState({isVisible:false})
                    this.props.navigation.navigate(managers.includes(response.data.res.Jabatan) ? 'Manager' : 'App')
                } else {
                    this.setState({isVisible:false})
                    alert('NIK/password salah')
                }
            })
            .catch(e=>console.log(`terjadi kesalahan ${e}`))
        }
    }

    render() {
        const { NIK, password, isVisible } = this.state;
        return (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Image source={agua} style={{width:200,height:200}}/>
                <Input onChangeText={(text)=>this.setState({NIK:text})} keyboardType='number-pad' containerStyle={{width:'80%',marginVertical:22}} inputContainerStyle={{borderBottomColor:colors.primary_color}} value={NIK} placeholder='Masukan NIK' leftIcon={<Icon type='ionicon' name='ios-card' color={colors.primary_color}/>}/>
                <Input onChangeText={(text)=>this.setState({password:text})} secureTextEntry containerStyle={{width:'80%'}} inputContainerStyle={{borderBottomColor:colors.primary_color}} value={password} placeholder='Masukan Password' leftIcon={<Icon type='ionicon' name='ios-lock' color={colors.primary_color}/>}/>
                <Button title='LOGIN' onPress={this._login} buttonStyle={{backgroundColor:colors.primary_color}} containerStyle={{marginVertical:25,width:'80%'}}/>
                <LoadingState isVisible={isVisible}/>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userDetail:state.user_detail
    }
}

const mapDispatchToProps = dispatch => {
    return {
        user_Login : (data) => dispatch(userLogin(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
