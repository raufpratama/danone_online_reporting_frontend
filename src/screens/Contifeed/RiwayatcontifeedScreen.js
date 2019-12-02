import React, { Component } from 'react'
import { Text, View, FlatList, AsyncStorage, ActivityIndicator, Image, DatePickerAndroid, TouchableWithoutFeedback, Alert, StyleSheet, Linking } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import { Icon, Button } from 'react-native-elements'
import ActionButton from 'react-native-action-button';
import DocumentPicker from 'react-native-document-picker';

import ErrorScreen from '../sub_components/ErrorScreen'
import { userLogin, userLogout } from '../../redux/actions/useractions'
import moment from 'moment'
import ExportexceldateModal from '../sub_components/Modals/ExportexceldateModal'
import Badger from  '../sub_components/BadgeStatusWo';

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
const managers = ["PLANT MANAGER","ENGINEERING MANAGER","ASSET ENGINEER","MANUFACTURING MANAGER"]

class RiwayatcontifeedScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wo_tasks:'',
            loading:true,
            network:true,
            isVisibleExportModal:false,
        }
    }

    componentDidMount = async() => {
        console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
        console.disableYellowBox = true;
        this._refresh()
        console.log(this.props.userDetail)
    }

    _document_Pick = async() => {
        try {
            const res = await DocumentPicker.pick({
              type: [DocumentPicker.types.pdf],
            });
            console.log(
              res.uri,
              res.type, // mime type
              res.name,
              res.size
            );

            let form_data = new FormData();
            form_data.append("file",res);
            form_data.append("nik",this.props.userDetail.res.nik)
            console.log(`ini form data ${JSON.stringify(form_data)}`)
            this.setState({loading:true})
            axios({
                headers:{
                    'Authorization':`Bearer ${this.props.userDetail.res.token}`,
                    'Content-Type':'multipart/form-data'
                },
                method:'POST',
                url:`${route_url.header}/wo`,
                data:form_data,
            })
            .then(async response=>{
                console.log(response.data)
                this._refresh()
            })
            .catch(e=>{
                console.log(`trerjadi error upload pdf ${e}`)
            })
          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
              // User cancelled the picker, exit any dialogs or menus and move on
            } else {
              throw err;
            }
          }
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
        this.props.navigation.navigate('Login')
        this.props.user_Logout()
    }

    _refresh = (kondisi) => {
        const { userDetail } = this.props;
        console.log(userDetail.res.token)
        axios.get(`${route_url.header}/wo/list/${area.contifeed}`,{headers:{'Authorization':`Bearer ${userDetail.res.token}`}})
        .then(response=>{
            console.log(response.data)
            this.setState({
            wo_tasks:response.data.res.filter(ress=> ress.Status == 4),
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

    _renderItem = ({item}) => {
        return (
            <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Detail',{refresh:this._refresh,wo_tasks:item,header_title:item.Area == "K442113" ? "Contiform" : item.Area == "K998848" ? "Contifeed" : "Modulfill"})}>
                <View style={{elevation:4,borderRadius:5,paddingHorizontal:13,paddingVertical:14}}>
                    <View style={{flexDirection:'row',height:160}}>
                        <View style={{width:135,justifyContent:'space-evenly'}}>
                            <Text style={{fontSize:13,fontWeight:'700'}}>WO number :</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Work center :</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Planned Duration :</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Description :</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Personel :</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Tanggal :</Text>
                            <Text style={{fontSize:13,fontWeight:'700'}}>Status :</Text>
                        </View>
                        <View style={{justifyContent:'space-evenly'}}>
                            <Text style={{fontSize:13}}>{item.WoNumber}</Text>
                            <Text style={{fontSize:13}}>SPS</Text>
                            <Text style={{fontSize:13}}>{JSON.parse(item.JSONData).plannedDuration}</Text>
                            <Text style={{fontSize:12,width:'90%'}} numberOfLines={2}>{JSON.parse(item.JSONData).description.full}</Text>
                            <Text style={{fontSize:13}}>{item.Who}-{item.WhoName.replace(' ','-').toUpperCase()}</Text>
                            <Text style={{fontSize:13}}>{moment(item.TanggalAktif).format('DD MMMM YYYY')}</Text>
                            <View style={{paddingHorizontal:5,paddingVertical:3,maxWidth:80,alignItems:'center',borderRadius:10,backgroundColor:Badger.color(item.Status)}}>
                                <Text style={{fontSize:13,color:colors.putih,fontWeight:'700'}}>{Badger.text(item.Status)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _datePicker = async() => {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
              // Use `new Date()` for current date.
              // May 25 2020. Month 0 is January.
              date: new Date(),
              mode:'calendar',
            });
            if (action !== DatePickerAndroid.dismissedAction) {
              // Selected year, month (0-11), day
            }
          } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
          }
    }

    _renderFloatingAction = () => {
        if(this.props.isLogin) {
            if(this.props.userDetail.res.Jabatan == "MAINTENANCE PLANNER") {
                return (
                    <ActionButton buttonColor="rgba(231,76,60,1)">
                        <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={this._document_Pick}>
                            <Icon type='ionicon' name="md-create" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                ) 
            }   else if(managers.includes(this.props.userDetail.res.Jabatan)) {
                return (
                    <ActionButton buttonColor="rgba(231,76,60,1)">
                        <ActionButton.Item buttonColor='green' title="Export excel" onPress={this._handleExportExcelModal}>
                            <Icon type='ionicon' name="md-create" color={'white'} style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#9b59b6' title="Search WO by date" onPress={this._datePicker}>
                            <Icon type='ionicon' name="md-search" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                )
            }
    } else {
        return null
    }
    }

    _handleExportExcelModal = () => {
        this.setState({isVisibleExportModal:!this.state.isVisibleExportModal})
    }

    render() {
        const { loading, wo_tasks, network } = this.state;
        const { userDetail, isLogin } = this.props;
        return (
            <View style={{flex:1}}>
                {loading ? (
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <ActivityIndicator style={{flex:1}} size={25}/>
                    </View>
                ) : !network ? (
                    <ErrorScreen refresh={this._refresh}/>
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
                {wo_tasks.length <=0 ? (
                    <Button title='refresh' buttonStyle={{backgroundColor:colors.primary_color,borderRadius:20,width:'40%',alignSelf:'center',marginVertical:20}}/>
                ) : null}
                {isLogin ? this._renderFloatingAction() : null}
                <Text onPress={this._alertLogout} style={{color:colors.abu_placeholder,textDecorationLine:'underline',alignSelf:'center',paddingBottom:20}}>Logout</Text>
                <ExportexceldateModal isVisible={this.state.isVisibleExportModal} handlemodal={this._handleExportExcelModal}/>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        userDetail:state.userreducer.user_detail,
        isLogin:state.userreducer.isLogin
    }
}

const mapDispatchToProps = dispatch => {
    return {
        user_Login : (data)=>dispatch(userLogin(data)),
        user_Logout:()=>dispatch(userLogout())
    }
}

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
  });

export default connect(mapStateToProps,mapDispatchToProps)(RiwayatcontifeedScreen)
