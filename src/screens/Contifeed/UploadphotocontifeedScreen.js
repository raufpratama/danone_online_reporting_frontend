import React, { Component } from 'react'
import { Text, View, Image, TouchableWithoutFeedback } from 'react-native'
import { Header, Icon, Divider, Button } from 'react-native-elements'

const colors = require('../../assets/utils/colors')
const plus = require('../../assets/images/plus.png')

const HeaderTitle = ({subtitle}) => {
    return (
        <View>
            <Text style={{fontWeight:'700'}}>Detail Work Order</Text>
            <Text>{subtitle}</Text>
        </View>
    )
}

class UploadphotocontifeedScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            header_title:props.navigation.getParam('header_title',''),
            wo_task:props.navigation.getParam('wo_task',''),
            image_before:props.navigation.getParam('image_before',''),
            image_after:props.navigation.getParam('image_after','')
        }
    }
    render() {
        const { wo_task, image_before, image_after, header_title } = this.state;
        return (
            <View style={{flex:1,backgroundColor:colors.background_screen}}>
                <Header
                    placement='left'
                    leftComponent={<Icon onPress={()=>this.props.navigation.goBack()} type='ionicon' name='ios-arrow-back' containerStyle={{marginLeft:10}}/>}
                    centerComponent={<HeaderTitle subtitle={header_title}/>}
                    containerStyle={{backgroundColor:colors.putih}}
                />
                <View style={{marginTop:13,paddingHorizontal:19,paddingVertical:12,backgroundColor:colors.putih}}>
                    <Text style={{fontWeight:'700',fontSize:14}} numberOfLines={3}>{wo_task}</Text>
                </View>
                <View style={{marginTop:13,paddingHorizontal:19,paddingVertical:12,backgroundColor:colors.putih}}>
                    <Text style={{fontWeight:'700',fontSize:14}}>Before</Text>
                    <Divider style={{marginVertical:14,backgroundColor:colors.abu_placeholder}}/>
                    <View style={{flexDirection:'row'}}>
                        <TouchableWithoutFeedback onPress={()=>console.log('tekan')}>
                            <View style={{justifyContent:'center',alignItems:'center',width:100,height:130,borderRadius:1,borderWidth:1,borderStyle:'dashed',borderColor:colors.abu_placeholder}}>
                                <Image source={plus} style={{width:50,height:50}} resizeMode='contain'/>
                            </View>
                        </TouchableWithoutFeedback>
                        {image_before.length > 1 ? (
                            <Image source={{uri:image_before}} style={{width:100,height:130,borderRadius:5}}/>
                        ) : null}
                    </View>
                </View>
                <View style={{marginTop:13,paddingHorizontal:19,paddingVertical:12,backgroundColor:colors.putih}}>
                    <Text style={{fontWeight:'700',fontSize:14}}>After</Text>
                    <Divider style={{marginVertical:14,backgroundColor:colors.abu_placeholder}}/>
                    <View style={{flexDirection:'row'}}>
                        <TouchableWithoutFeedback onPress={()=>console.log('tekan')}>
                            <View style={{justifyContent:'center',alignItems:'center',width:100,height:130,borderRadius:1,borderWidth:1,borderStyle:'dashed',borderColor:colors.abu_placeholder}}>
                                <Image source={plus} style={{width:50,height:50}} resizeMode='contain'/>
                            </View>
                        </TouchableWithoutFeedback>
                        {image_after.length > 1 ? (
                            <Image source={{uri:image_after}} style={{width:100,height:130,borderRadius:5}}/>
                        ) : null}
                    </View>
                </View>
                <View style={{paddingHorizontal:15,position:'absolute',bottom:0,width:'100%',paddingVertical:12,backgroundColor:colors.putih,elevation:4,alignSelf:'flex-end'}}>
                    <Button buttonStyle={{borderRadius:10,backgroundColor:colors.primary_color}} title='Upload photo'/>
                </View>
            </View>
        )
    }
}

export default UploadphotocontifeedScreen
