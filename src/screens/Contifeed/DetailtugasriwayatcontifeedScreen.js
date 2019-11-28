import React, { Component } from 'react'
import { Text, View, FlatList, ActivityIndicator, ScrollView, Alert, Linking } from 'react-native'
import { Header, Icon, Divider, Button, CheckBox } from 'react-native-elements'
import axios from 'axios';
import { connect } from 'react-redux'
import moment from 'moment'

import LoadingState from '../sub_components/LoadingState';
import { updateFORM, updateWO } from '../../redux/actions/formwoactions'

const colors = require('../../assets/utils/colors')
const route_url = require('../../assets/utils/urls')
const HeaderTitle = ({subtitle}) => {
    return (
        <View>
            <Text style={{fontWeight:'700'}}>Detail Work Order</Text>
            <Text>{subtitle}</Text>
        </View>
    )
}

class DetailtugasriwayatcontifeedScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wo_tasks:props.navigation.getParam('wo_tasks',''),
            header_title:props.navigation.getParam('header_title',''),
            detail_wo:'',
            refresh:props.navigation.getParam('refresh',''),
            isVisibleState:false,
            done_items:[],
            loading:true,
        }
    }

    componentDidMount = () => {
        console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
        console.disableYellowBox = true;
        const { detail_wo,wo_tasks } = this.state;
        const { userDetail, update_WO, wo } = this.props
        console.log(detail_wo)
        console.log(wo.length > 0 && wo.id_wo == wo_tasks.ID)
        console.log(`id wo ${JSON.stringify(wo_tasks)}`)
        console.log(' ini wo di redux ' + JSON.stringify(wo))
        if(Object.keys(wo).length > 0 && wo.id_wo == wo_tasks.ID) {
            this.setState({detail_wo:wo.res,loading:false})
        } else {
            axios.get(`${route_url.header}/wo/detail/${wo_tasks.WoNumber}`,{headers:{'Authorization':`Bearer ${userDetail.res.token}`}})
            .then(response=>{
                console.log(response.data)
                const temp = response.data
                temp.id_wo = wo_tasks.ID
                update_WO(temp)
                this.setState({detail_wo:response.data.res,loading:false})
            })
            .catch(e=>console.log(`terjadi kesalahan ${e}`))
        }
    }

    _renderItemInformasi = () => {
        return (
            <View>
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
                    <Text style={{fontSize:13}}>: {this.state.wo_tasks.WoNumber}</Text>
                            <Text style={{fontSize:13}}>: SPS</Text>
                        <Text style={{fontSize:13}}>: {JSON.parse(this.state.wo_tasks.JSONData).plannedDuration}</Text>
                        <Text style={{fontSize:13}} numberOfLines={2}>: {JSON.parse(this.state.wo_tasks.JSONData).description.full}</Text>
                        <Text style={{fontSize:13}}>: {this.state.wo_tasks.Who}-{this.state.wo_tasks.WhoName.replace(' ','-').toUpperCase()}</Text>
                        <Text style={{fontSize:13}}>: {moment(this.state.wo_tasks.TanggalAktif).format('DD MMMM YYYY')}</Text>
                        <View style={{paddingHorizontal:5,paddingVertical:3,width:60,alignItems:'center',borderRadius:10,backgroundColor:this.state.wo_tasks.Status == 1 ? colors.hijau_benar : this.state.wo_tasks.Status == 2 ? colors.kuning : this.state.wo_tasks.status == 3 ? colors.blue_link : colors.abu_placeholder}}>
                            <Text style={{fontSize:13,color:colors.putih,fontWeight:'700'}}>{this.state.wo_tasks.Status == 1 ? "Open" : this.state.wo_tasks.Status == 2 ? "Working" : this.state.wo_tasks.Status == 3 ? "Submit" : "Close"}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    _renderItemTugasCheckbox = ({item}) => {
        return (
            <View style={{flexDirection:'row',paddingRight:19}}>
                <CheckBox checked={false} onPress={()=>this.props.navigation.navigate('Uploadphoto',{general_wo:this._filterObject(item.ID),header_title:'Upload photo',done_item:this._doneItem,wo_item_id:item.WoNumber,image_before:item.imgBefore,image_after:item.imgAfter,wo_task:item.Task})} containerStyle={{backgroundColor:'transparent',paddingRight:19,borderWidth:0}} title={<Text numberOfLines={3} style={{marginVertical:5,textAlign:'justify'}}>{item.Task}</Text>}/>
            </View>
        )
    }

    _renderItemTugas = ({item,index}) => {
        return (
            <View style={{flexDirection:'row',paddingRight:19}}>
                <Text numberOfLines={3} style={{marginVertical:5,textAlign:'justify'}}>{item.Task}</Text>
            </View>
        )
    }

    _filterObject = (id) => {
        const filter_data = this.props.wo.res.filter(ids => {return ids.ID == id})
        console.log(filter_data[0])
        return filter_data[0]
    }

    _alertAccept = () => {
        const { wo_tasks } = this.state; 
        Alert.alert('Perhatian',wo_tasks.Status == 1 ? 'Apakah anda yakin ingin memulai WO ?' : 'Apakah anda yakin ingin menutup WO',[
            {
                text: 'YA', onPress: () => this._acceptWo()
            },
            {
                text: 'TIDAK',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            ],
            {cancelable: false},
        )
        // image == "image_before" ? this._menu.hide() : this.menu_.hide()
    }

    _acceptWo = () => {
        const { wo_tasks, refresh, done_items, detail_wo } = this.state;
        const { userDetail, form } = this.props;
        console.log(userDetail)
        console.log(`${route_url.header}/wo/${wo_tasks.Status == 1 ? 'accept' : 'close'}/${wo_tasks.WoNumber}`)
        if(wo_tasks.Status == 1 || wo_tasks.Status == 2 && form.length == detail_wo.length) {
            this.setState({isVisibleState:true})
            axios.patch(`${route_url.header}/wo/${wo_tasks.Status == 1 ? 'accept' : 'close'}/${wo_tasks.WoNumber}`,{},{headers:{'Content-Type':'application/json','Authorization':`Bearer ${userDetail.res.token}`}})
            .then(response=>{
                console.log(response.data)
                alert(`Work order berubah status menjadi ${wo_tasks.Status == 1 ? 'dikerjakan':'close'}`)
                refresh()
                this.setState({isVisibleState:false})
                this.props.navigation.goBack()
            })
            .catch(e=>console.log(`terjadi kesalahan ${e}`))
        } else {
            alert('Task work order ada yang belum selesai')
        }
    }

    render() {
        const { wo_tasks, header_title, detail_wo, loading, isVisibleState } = this.state;
        const { userDetail } = this.props;
        return (
            <View style={{flex:1,backgroundColor:colors.background_screen}}>
                <Header
                    placement='left'
                    leftComponent={<Icon onPress={()=>this.props.navigation.goBack()} type='ionicon' name='ios-arrow-back' containerStyle={{marginLeft:10}}/>}
                    centerComponent={<HeaderTitle subtitle={header_title}/>}
                    containerStyle={{backgroundColor:colors.putih}}
                />
                <ScrollView>
                    {loading ? (
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <ActivityIndicator style={{flex:1}} size={25}/>
                        </View>
                    ) : (
                        <View>
                            {/* INFORMATION */}
                            <View style={{marginTop:13,paddingHorizontal:19,paddingVertical:12,backgroundColor:colors.putih}}>
                                <Text style={{fontWeight:'700',fontSize:14}}>Informasi</Text>
                                <Divider style={{marginVertical:14,backgroundColor:colors.abu_placeholder}}/>
                                {this._renderItemInformasi()}
                                {/* <FlatList
                                    data={wo_tasks}
                                    renderItem={this._renderItemInformasi}
                                    keyExtractor={(item,id)=>id.toString()}
                                /> */}
                            </View>
                            {/* END OF INFOMRATION */}

                            {/* TUGAS */}
                            <View style={{marginTop:13,marginBottom:13,paddingHorizontal:19,paddingVertical:12,backgroundColor:colors.putih}}>
                                <Text style={{fontWeight:'700',fontSize:14}}>Tugas</Text>
                                <Divider style={{marginVertical:14,backgroundColor:colors.abu_placeholder}}/>
                                <FlatList
                                    data={detail_wo}
                                    renderItem={wo_tasks.Status == 1 || wo_tasks.Status == 3 ? this._renderItemTugas:this._renderItemTugasCheckbox}
                                    keyExtractor={(item,id)=>id.toString()}
                                />
                            </View>
                            {/* END OF TUGAS */}
                        </View>
                    )}
                </ScrollView>
                {wo_tasks.Status == 1 || wo_tasks.Status == 2 ? (
                    <View style={{paddingHorizontal:15,paddingVertical:12,backgroundColor:colors.putih,elevation:4}}>
                        <Button onPress={this._alertAccept} buttonStyle={{borderRadius:10,backgroundColor:wo_tasks.Status == 1 ? colors.kuning : colors.primary_color}} title={wo_tasks.Status == 1 ? 'Kerjakan':'Close'}/>
                    </View>
                ): wo_task.Status == 3 && userDetail.res.Jabatan == "PRODUCTION SUPERVISOR" ? (<View style={{paddingHorizontal:15,paddingVertical:12,backgroundColor:colors.putih,elevation:4}}>
                    <Button onPress={this._alertAccept} buttonStyle={{borderRadius:10,backgroundColor:wo_tasks.Status == 1 ? colors.kuning : colors.primary_color}} title={'Complete'}/>
                </View>) : null}
                <LoadingState isVisible={isVisibleState}/>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        userDetail:state.userreducer.user_detail,
        wo:state.formworeducer.wo,
        form:state.formworeducer.form
    }
}

const mapDispatchToProps = dispatch => {
    return {
        update_WO:(data)=>dispatch(updateWO(data)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(DetailtugasriwayatcontifeedScreen)
