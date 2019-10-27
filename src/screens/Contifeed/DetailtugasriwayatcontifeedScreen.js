import React, { Component } from 'react'
import { Text, View, FlatList, ActivityIndicator, ScrollView } from 'react-native'
import { Header, Icon, Divider, Button, CheckBox } from 'react-native-elements'
import axios from 'axios';
import { connect } from 'react-redux'

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
            loading:true,
        }
    }

    componentDidMount = () => {
        const { detail_wo,wo_tasks } = this.state;
        const { userDetail } = this.props

        axios.post(`${route_url.header}/wo/detail`,{ID:wo_tasks[0].ID,token:userDetail.res.token})
        .then(response=>{
            console.log(response.data)
            this.setState({detail_wo:response.data.res,loading:false})
        })
        .catch(e=>console.log(`terjadi kesalahan ${e}`))
    }

    _renderItemInformasi = ({item}) => {
        return (
            <View>
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
        )
    }

    _renderItemTugasCheckbox = ({item}) => {
        const { header_title } = this.state;
        return (
            <View style={{flexDirection:'row',paddingRight:19}}>
                <CheckBox onPress={()=>this.props.navigation.navigate('Uploadphoto',{header_title,image_before:item.imgBefore,image_after:item.imgAfter,wo_task:item.Location + ' ' + item.Clitr.map(clitrs => ' - ' + clitrs) + ' - ' + item.What + ' - ' + item.Standart + item.ToolsMaterial.map(tools=> ' - ' + tools)})} containerStyle={{backgroundColor:'transparent',paddingRight:19,borderWidth:0}} title={<Text numberOfLines={3} style={{marginVertical:5,textAlign:'justify'}}>{item.Location + ' '}{item.Clitr.map(clitrs => ' - ' + clitrs)}{' - ' + item.What}{' - ' + item.Standart}{item.ToolsMaterial.map(tools=> ' - ' + tools)}</Text>}/>
            </View>
        )
    }

    _renderItemTugas = ({item,index}) => {
        return (
            <View style={{flexDirection:'row',paddingRight:19}}>
                <Text style={{fontWeight:'700',marginVertical:5}}>{index+1}.{' '}</Text>
                <Text numberOfLines={3} style={{marginVertical:5,textAlign:'justify'}}>{item.Location + ' '}{item.Clitr.map(clitrs => ' - ' + clitrs)}{' - ' + item.What}{' - ' + item.Standart}{item.ToolsMaterial.map(tools=> ' - ' + tools)}</Text>
            </View>
        )
    }

    _renderItemTugasClitr = ({item}) => {
        return (
            <View style={{flexDirection:'row'}}>
                <Text>{item + ' '}</Text>
            </View>
        )
    }

    render() {
        const { wo_tasks, header_title, detail_wo, loading } = this.state;
        return (
            <View style={{flex:1,backgroundColor:colors.background_screen}}>
                <Header
                    placement='left'
                    leftComponent={<Icon type='ionicon' name='ios-arrow-back' containerStyle={{marginLeft:10}}/>}
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
                                <FlatList
                                    data={wo_tasks}
                                    renderItem={this._renderItemInformasi}
                                    keyExtractor={(item,id)=>id.toString()}
                                />
                            </View>
                            {/* END OF INFOMRATION */}

                            {/* TUGAS */}
                            <View style={{marginTop:13,marginBottom:13,paddingHorizontal:19,paddingVertical:12,backgroundColor:colors.putih}}>
                                <Text style={{fontWeight:'700',fontSize:14}}>Tugas</Text>
                                <Divider style={{marginVertical:14,backgroundColor:colors.abu_placeholder}}/>
                                <FlatList
                                    data={detail_wo}
                                    renderItem={this._renderItemTugasCheckbox}
                                    keyExtractor={(item,id)=>id.toString()}
                                />
                            </View>
                            {/* END OF TUGAS */}
                        </View>
                    )}
                </ScrollView>
                <View style={{paddingHorizontal:15,paddingVertical:12,backgroundColor:colors.putih,elevation:4}}>
                    <Button buttonStyle={{borderRadius:10,backgroundColor:colors.kuning}} title='Kerjakan'/>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        userDetail:state.user_detail
    }
}

export default connect(mapStateToProps)(DetailtugasriwayatcontifeedScreen)
