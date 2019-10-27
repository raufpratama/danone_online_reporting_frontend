import React, { Component } from 'react'
import { Text, View, Image, TouchableWithoutFeedback } from 'react-native'

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

class UploadphotocontiformScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            header_title:props.navigation.getParam('header_title',''),
            wo_task:props.navigation.getParam('wo_task',''),
            images:props.navigation.getParam('images','')
        }
    }
    render() {
        const { wo_task, images } = this.state;
        return (
            <View style={{flex:1}}>
                <Header
                    placement='left'
                    leftComponent={<Icon type='ionicon' name='ios-arrow-back' containerStyle={{marginLeft:10}}/>}
                    centerComponent={<HeaderTitle subtitle={header_title}/>}
                    containerStyle={{backgroundColor:colors.putih}}
                />
                <View style={{marginTop:13,paddingHorizontal:19,paddingVertical:12,backgroundColor:colors.putih}}>
                    <Text style={{fontWeight:'700',fontSize:14}}>Before</Text>
                    <Divider style={{marginVertical:14,backgroundColor:colors.abu_placeholder}}/>
                    <View style={{flexDirection:'row'}}>
                        {images.length > 0 ? (
                            <FlatList
                            data={wo_tasks}
                            renderItem={this._renderItemInformasi}
                            keyExtractor={(item,id)=>id.toString()}
                            />
                        ) : null}
                        <TouchableWithoutFeedback onPress={()=>console.log('tekan')}>
                            <View style={{justifyContent:'center',alignItems:'center',width:100,height:170,borderRadius:1,borderWidth:1,borderStyle:'dashed',borderColor:colors.abu_placeholder}}>
                                <Image source={plus} style={{width:50,height:50}} resizeMode='contain'/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={{marginTop:13,paddingHorizontal:19,paddingVertical:12,backgroundColor:colors.putih}}>
                    <Text style={{fontWeight:'700',fontSize:14}}>Before</Text>
                    <Divider style={{marginVertical:14,backgroundColor:colors.abu_placeholder}}/>
                    <View style={{flexDirection:'row'}}>
                        {images.length > 0 ? (
                            <FlatList
                            data={wo_tasks}
                            renderItem={this._renderItemInformasi}
                            keyExtractor={(item,id)=>id.toString()}
                            />
                        ) : null}
                        <TouchableWithoutFeedback onPress={()=>console.log('tekan')}>
                            <View style={{justifyContent:'center',alignItems:'center',width:100,height:170,borderRadius:1,borderWidth:1,borderStyle:'dashed',borderColor:colors.abu_placeholder}}>
                                <Image source={plus} style={{width:50,height:50}} resizeMode='contain'/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        )
    }
}

export default UploadphotocontiformScreen
