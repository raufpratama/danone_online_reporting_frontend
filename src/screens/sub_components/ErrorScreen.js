import React from 'react'
import { View, Text } from 'react-native'
import { Image, Button } from 'react-native-elements'

const network_error = require('../../assets/images/network_error.png')
const colors = require('../../assets/utils/colors')

const ErrorScreen = () => {
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Image source={network_error} style={{width:200,height:200}} resizeMode='contain'/>
            <Text style={{marginTop:10,color:colors.abu_subtitle,textAlign:'center'}}>Koneksi Gagal</Text>
            <Button type='clear' onPress={this.props.refresh} icon={{type:'ionicon',name:'ios-refresh',color:colors.abu_subtitle,size:25}} containerStyle={{marginTop:10}}/>
        </View>
    )
}

export default ErrorScreen
