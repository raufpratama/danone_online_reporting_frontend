import React, { Component } from 'react'
import { Text, View, FlatList, AsyncStorage, ActivityIndicator, Image, TouchableWithoutFeedback, Alert } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'

import { userLogin, userLogout } from '../../redux/actions/useractions'

const dummy_wo_task = [
    {
        op_number:'0010',
        work_center:'SPS',
        number_of_people:'1',
        planned_duration:'30 menit',
        personal_number:'23484-MHD-JOHAN',
        status:'belum dikerjakan'
    }
]
const route_url = require('../../assets/utils/urls')
const list_placeholder = require('../../assets/images/list_placeholder.png')
const area = require('../../assets/utils/area')
const environment = require('../../assets/utils/environment')
const colors = require('../../assets/utils/colors')

class RiwayatcontifeedScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wo_tasks:'',
            loading:true
        }
    }

    componentDidMount = async() => {
        this._refresh()
    }

    _alertLogout = () => {
        Alert.alert('Perhatian','Apakah anda yakin ingin keluar ?',[
            {
                text: 'YA', onPress: () => this._logout()
            },
            {
                text: 'TIDAK',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            ],
            {cancelable: false},
        )
    }

    _logout = async() => {
        await AsyncStorage.removeItem(environment.ASYNC_USER_TOKEN)
        this.props.user_Logout([])
        this.props.navigation.navigate('Login')
    }

    _refresh = () => {
        const { userDetail } = this.props;
        console.log(userDetail)
        axios.post(`${route_url.header}/wo/list`,{area:area.contiform,token:userDetail.res.token})
        .then(response=>{
            console.log(response.data)
            this.setState({
            wo_tasks:response.data.res.filter(ress=>ress.Status == 3),
            loading:false
        })})
        .catch(e=>console.log(`terjadi kesalahan ${e}`))
    }

    _renderItem = ({item}) => {
        return (
            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Detail',{refresh:this._refresh,wo_tasks:this.state.wo_tasks,header_title:item.Area == "K442113" ? "Contiform" : item.Area == "K998848" ? "Contifeed" : "Modulfill"})}>
                <View style={{elevation:4,borderRadius:5,paddingHorizontal:13,paddingVertical:14}}>
                    <View style={{flexDirection:'row',height:160}}>
                        <View style={{width:135,justifyContent:'space-evenly'}}>
                            <Text style={{fontSize:13,fontWeight:'700'}}>WO number</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Work center</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Planned Duration</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Personel</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Description</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Tanggal</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Status</Text>
                        </View>
                        <View style={{justifyContent:'space-evenly'}}>
                            <Text style={{fontSize:13}}>: {item.WONumber}</Text>
                            <Text style={{fontSize:13}}>: SPS</Text>
                            <Text style={{fontSize:13}}>: {item.EstDuration}</Text>
                            <Text style={{fontSize:13}}>: 1-WK-PM {item.Area == "K442113" ? " Contiform " : item.Area == "K998848" ? " Contifeed " : " Modulfill "}{item.Area}</Text>
                            <Text style={{fontSize:13}}>: {item.Who}-{item.WhoName.replace(' ','-').toUpperCase()}</Text>
                            <Text style={{fontSize:13}}>: 22 November 2019</Text>
                            <View style={{paddingHorizontal:5,paddingVertical:3,width:60,alignItems:'center',borderRadius:10,backgroundColor:item.Status == 1 ? colors.hijau_benar : item.Status == 2 ? colors.kuning : item.status == 3 ? colors.blue_link : colors.abu_placeholder}}>
                                <Text style={{fontSize:13,color:colors.putih,fontWeight:'700'}}>{item.Status == 1 ? "Open" : item.Status == 2 ? "Working" : item.status == 3 ? "Submit" : "Close"}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    render() {
        const { loading, wo_tasks } = this.state;
        return (
            <View style={{flex:1}}>
                {loading ? (
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <ActivityIndicator style={{flex:1}} size={25}/>
                    </View>
                ) : wo_tasks.length > 0 ? (
                    <FlatList
                        data={wo_tasks}
                        renderItem={this._renderItem}
                        contentContainerStyle={{padding:16}}
                        keyExtractor={(item,id)=>id.toString()}
                    />
                ) : (
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Image source={list_placeholder} style={{width:136,height:185}} resizeMode='contain'/>
                        <Text style={{fontSize:12,width:254,color:colors.abu_placeholder}} numberOfLines={2}>Tidak ada work order hari ini, atau anda sudah menyelesaikan semuanya</Text>
                    </View>
                )}
                <Text onPress={this._alertLogout} style={{color:colors.abu_placeholder,textDecorationLine:'underline',alignSelf:'center',paddingBottom:20}}>Logout</Text>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        userDetail:state.user_detail
    }
}

const mapDispatchToProps = dispatch => {
    return {
        user_Login : (data)=>dispatch(userLogin(data)),
        user_Logout:(data)=>dispatch(userLogout(data))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(RiwayatcontifeedScreen)
