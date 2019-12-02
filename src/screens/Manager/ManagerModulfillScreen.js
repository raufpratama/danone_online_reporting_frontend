import React, { Component } from 'react'
import { Text, View, FlatList, AsyncStorage, ActivityIndicator, Image, TouchableWithoutFeedback, Alert, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import { Icon } from 'react-native-elements'
import ActionButton from 'react-native-action-button';
import DocumentPicker from 'react-native-document-picker';

import ErrorScreen from '../sub_components/ErrorScreen'
import { userLogin, userLogout } from '../../redux/actions/useractions'
import moment from 'moment'

class ManagerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wo_tasks:'',
            loading:true,
        }
    }

    componentDidMount = () => {
        this._refresh()
    }

    _refresh = () => {
        const { userDetail } = this.props;
        console.log(userDetail.res.token)
        axios.get(`${route_url.header}/wo/list/${area.modulfill}`,{headers:{'Authorization':`Bearer ${userDetail.res.token}`}})
        .then(response=>{
            console.log(response.data)
            this.setState({
            wo_tasks:response.data.res,
            loading:false,
            network:true
        })})
        .catch(e=>{
            console.log(e.message)
            if(e.message == "Network Error") {
                this.setState({network:false})
            }
        })
    }

    componentWillUnmount = () => {
        this._refresh()
    }

    _renderItem = ({item}) => {
        return (
            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Detail',{refresh:this._refresh,wo_tasks:item,header_title:item.Area == "K442113" ? "Contiform" : item.Area == "K998848" ? "Contifeed" : "Modulfill"})}>
                <View style={{elevation:4,borderRadius:5,paddingHorizontal:13,paddingVertical:14}}>
                    <View style={{flexDirection:'row',height:160}}>
                        <View style={{width:135,justifyContent:'space-evenly'}}>
                            <Text style={{fontSize:13,fontWeight:'700'}}>WO number</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Work center</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Planned Duration</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Description</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Personel</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Tanggal</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Status</Text>
                        </View>
                        <View style={{justifyContent:'space-evenly'}}>
                            <Text style={{fontSize:13}}>: {item.WoNumber}</Text>
                            <Text style={{fontSize:13}}>: SPS</Text>
                            <Text style={{fontSize:13}}>: {JSON.parse(item.JSONData).plannedDuration}</Text>
                            <Text style={{fontSize:13}} numberOfLines={2}>: {JSON.parse(item.JSONData).description.full}</Text>
                            <Text style={{fontSize:13}}>: {item.Who}-{item.WhoName.replace(' ','-').toUpperCase()}</Text>
                            <Text style={{fontSize:13}}>: {moment(item.TanggalAktif).format('DD MMMM YYYY')}</Text>
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
        const { userDetail } = this.props;
        return (
            <View style={{flex:1,justifyContent:'center'}}>
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
                    <Text style={{fontSize:12,width:254,color:colors.abu_placeholder,textAlign:'center'}} numberOfLines={2}>Tidak ada work order hari ini, atau anda sudah menyelesaikan semuanya</Text>
                </View>
            )}
            {userDetail.res.Jataban == "MAINTENANCE PLANNER" ? (
                <ActionButton buttonColor="rgba(231,76,60,1)">
                    <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={this._document_Pick}>
                        <Icon type='ionicon' name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
            ) : null}
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        userDetail:state.userreducer.user_detail
    }
}

const mapDispatchToProps = dispatch => {
    return {
        user_Login : (data)=>dispatch(userLogin(data)),
        user_Logout:(data)=>dispatch(userLogout(data))
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
  });

export default connect(mapStateToProps,mapDispatchToProps)(ManagerScreen)
