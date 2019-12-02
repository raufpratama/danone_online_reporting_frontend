import React, { Component } from 'react'
import { Text, View, TouchableWithoutFeedback, Alert, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Header, Icon, Divider, Button, Image } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu'
import axios from 'axios'
import ImageView from 'react-native-image-view'
import { connect } from 'react-redux'

import LoadingState from '../sub_components/LoadingState'
import { updateWO, updateFORM } from '../../redux/actions/formwoactions'

const colors = require('../../assets/utils/colors')
const plus = require('../../assets/images/plus.png')
const route_url = require('../../assets/utils/urls')
const options = {
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
  };

const HeaderTitle = ({subtitle}) => {
    return (
        <View>
            <Text style={{fontWeight:'700'}}>Detail Work Order</Text>
            <Text>{subtitle}</Text>
        </View>
    )
}

const Images = (uri1,uri2) => {
    const image = [
        {
            source:{
                uri:uri1
            },
            title:'Image Before'
        },
        {
            source:{
                uri:uri2
            },
            title:'Image After'
        },
    ]
    return image
}


class UploadphotocontifeedScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            header_title:props.navigation.getParam('header_title',''),
            wo_task:props.navigation.getParam('wo_task',''),
            wo_number:props.navigation.getParam('wo_number',''),
            wo_item_id:props.navigation.getParam('wo_item_id',''),
            done_item:props.navigation.getParam('done_item',''),
            image_before:props.navigation.getParam('general_wo').ImgBefore == null ? '' : route_url.header + props.navigation.getParam('general_wo').ImgBefore.replace('.',''),
            image_after:props.navigation.getParam('general_wo').ImgAfter == null ? '' : route_url.header + props.navigation.getParam('general_wo').ImgAfter.replace('.',''),
            image_placeholder:'https://www.bigw.com.au/medias/sys_master/images/images/h40/hed/12107450089502.jpg',
            form_data_before:'',
            form_data_after:'',
            isImageViewVisible:false,
            isVisibleState:false,
        }
        console.log(props.navigation.getParam('general_wo').ImgBefore !== null)
    }

    componentDidMount = () => {
        console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
        console.disableYellowBox = true;
        // console.log(`ini state ${JSON.stringify(this.state)}`)
        console.log(`ini props wo ${JSON.stringify(this.props.wo)}`)
        console.log('ini general wo ' + JSON.stringify(this.props.navigation.getParam('general_wo','')))
    }

    _menu = null;
    menu_ = null

    setMenuRef = (ref) => {
        this._menu = ref
    };

    setMenuRef_ = (ref) => {
        this.menu_ = ref
    };

    hideMenu = (image) => {
        Alert.alert('Perhatian','Apakah anda yakin ingin menghapus foto ?',[
            {
                text: 'YA', onPress: () => this.setState({[image]:''})
            },
            {
                text: 'TIDAK',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            ],
            {cancelable: false},
        )
        image == "image_before" ? this._menu.hide() : this.menu_.hide()
    };

    showMenu = (image) => {
        image == "image_before" ? this._menu.show() : this.menu_.show()
    };

    _uploadPhoto = () => {
        const { image_after, image_before,wo_number,form_data_before,form_data_after, wo_item_id  } = this.state;
        const { userDetail, update_FORM } = this.props;
        const { ImgBefore, ImgAfter } = this.props.navigation.getParam('general_wo','')
        const edit_ImgBefore = `${route_url.header}${ImgBefore !== null ? ImgBefore.replace('.',''): ''}`
        const edit_ImgAfter = `${route_url.header}${ImgAfter !== null ? ImgBefore.replace('.',''): ''}`
        if(image_before == edit_ImgBefore && image_after == edit_ImgAfter) {
            this.props.navigation.goBack()
        } else if(image_after.length > 0 && image_before.length >0) {
            this.setState({isVisibleState:true})
            axios({
                headers:{'Content-Type':'multipart/form-data','Authorization':`Bearer ${userDetail.res.token}`},
                method:'POST',
                url:`${route_url.header}/wo/picBefore/${wo_number}`,
                data:form_data_before
            })
            .then(response=>{
                console.log(response.data)
                // console.log(`ini wo props wo ${JSON.stringify(this.props.wo)}`)
                update_FORM(wo_item_id)
                // userDetail.wo_item_id = [...wo_item_id]
                // await AsyncStorage.setItem(environment.ASYNC_USER_TOKEN,JSON.stringify(userDetail))
                this._editRedux(response.data.res.path,"ImgBefore")
            })
            .catch(e=>console.log(`terjadi kesalahan di upload foto before ${e}`))

            axios({
                headers:{'Content-Type':'multipart/form-data','Authorization':`Bearer ${userDetail.res.token}`},
                method:'POST',
                url:`${route_url.header}/wo/picAfter/${wo_number}`,
                data:form_data_after
            })
            .then(response=>{
                console.log(response.data)
                this._editRedux(response.data.res.path,"ImgAfter")
                this.setState({isVisibleState:false})
                this.props.navigation.goBack();
                // console.log(this.props.wo)
            })
            .catch(e=>console.log(`terjadi kesalahan di upload foto after ${e}`))
        } else {
            alert('Kamu belum upload semua form foto')
        }
    }

    _editRedux = (new_img,img_key) => {
        const temp_wo = this.props.wo;
        const { wo_item_id } = this.state;
        const filter_data = temp_wo.res.filter(ids => {return ids.ID == wo_item_id})
        const index_data = temp_wo.res.findIndex(ids => {return ids.ID == wo_item_id})
        filter_data[img_key] = new_img
        console.log(`ini filter data ${JSON.stringify(filter_data)}`)
        temp_wo.res[index_data] = filter_data
        this.props.update_WO(temp_wo)
    }

    _alertPhoto = () => {
        Alert.alert('Perhatian','Apakah anda yakin ingin menghapus foto ?',[
            {
                text: 'YA', onPress: () => this._uploadPhoto()
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

    _renderFooter({title}) {
        return (
            <View style={styles.footer}>
                <Text style={styles.footerText}>{title}</Text>
            </View>
        );
    }

    _openCamera = (image_key) => {
        ImagePicker.launchCamera(options,(response)=>{
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                let form_data = new FormData();
                form_data.append("file",{uri:response.uri,type:response.type,name:response.fileName});
                form_data.append("nik",this.props.userDetail.res.nik);
                form_data.append("ID",this.state.wo_item_id);
                this.setState({
                    [image_key]: response.uri,
                    [image_key == "image_before" ? "form_data_before":"form_data_after"]:form_data
                });
                console.log(this.state.form_data_after)
                console.log(this.state.form_data_before)
            }
        })
    }

    _isTeco = () => {
        return this.props.userDetail.res.Jabatan == "PRODUCTION SUPERVISOR" ? true : false
    }

    _handleImageViewVisible = () => {
        this.setState({isImageViewVisible:!this.state.isImageViewVisible})
        console.log(`tertekan handle image view visible`)
    }

    render() {
        const { wo_task, image_before, image_after, header_title, image_placeholder, isVisibleState } = this.state;
        const images = [{source:{uri:image_before},title:'Image Before'},{source:{uri:image_after},title:'Image After'}]
        return (
            <View style={{flex:1,backgroundColor:colors.background_screen}}>
                <Header
                    placement='left'
                    leftComponent={<Icon onPress={()=>this.props.navigation.goBack()} type='ionicon' name='ios-arrow-back' containerStyle={{marginLeft:10}}/>}
                    centerComponent={<HeaderTitle subtitle={header_title}/>}
                    containerStyle={{backgroundColor:colors.putih}}
                />
                <ScrollView>
                    <Text style={{marginTop:13,paddingHorizontal:19,paddingVertical:12,backgroundColor:colors.putih}}>
                        <Text style={{fontWeight:'700',fontSize:14}} numberOfLines={3}>{wo_task}</Text>
                    </Text>
                    <View style={{marginTop:13,paddingHorizontal:19,paddingVertical:12,backgroundColor:colors.putih}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={{fontWeight:'700',fontSize:14}}>Before</Text>
                            <Menu
                                ref={this.setMenuRef}
                                button={<Icon type='ionicon' onPress={()=>this.showMenu("image_before")} name='ios-more' size={30}/>}
                            > 
                                <MenuItem onPress={()=>this.hideMenu("image_before")}>Hapus foto</MenuItem>
                            </Menu>
                        </View>
                        <Divider style={{marginVertical:14,backgroundColor:colors.abu_placeholder}}/>
                        <View style={{flexDirection:'row'}}>
                            {image_before.length > 0 ? (
                                <TouchableOpacity onPress={()=>this._handleImageViewVisible()}>
                                    <Image  source={{uri:image_before}} style={{borderWidth:1,width:100,height:130,borderRadius:5}} resizeMode='cover'/>
                                </TouchableOpacity>
                            ) : (
                                <TouchableWithoutFeedback onPress={this._isTeco() ? null : ()=>this._openCamera("image_before")}>
                                    <View style={{justifyContent:'center',alignItems:'center',width:100,height:130,borderRadius:1,borderWidth:1,borderStyle:'dashed',borderColor:colors.abu_placeholder}}>
                                        <Image source={plus} style={{width:50,height:50}} resizeMode='contain'/>
                                    </View>
                                </TouchableWithoutFeedback>
                            )}  
                        </View>
                    </View>
                    <View style={{marginTop:13,paddingHorizontal:19,paddingVertical:12,backgroundColor:colors.putih}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={{fontWeight:'700',fontSize:14}}>After</Text>
                            <Menu
                                ref={this.setMenuRef_}
                                button={<Icon type='ionicon' onPress={()=>this.showMenu("image_after")} name='ios-more' size={30}/>}
                            >
                                <MenuItem onPress={()=>this.hideMenu("image_after")}>Hapus foto</MenuItem>
                            </Menu>
                        </View>
                        <Divider style={{marginVertical:14,backgroundColor:colors.abu_placeholder}}/>
                        <View style={{flexDirection:'row'}}>
                            {image_after.length > 0  ? (
                                <TouchableOpacity onPress={()=>this._handleImageViewVisible}>
                                    <Image source={{uri:image_after}} style={{borderWidth:1,width:100,height:130,borderRadius:5}} resizeMode='cover'/>
                                </TouchableOpacity>
                            ) : (
                                <TouchableWithoutFeedback onPress={this._isTeco() ? null : ()=>this._openCamera("image_after")}>
                                    <View style={{justifyContent:'center',alignItems:'center',width:100,height:130,borderRadius:1,borderWidth:1,borderStyle:'dashed',borderColor:colors.abu_placeholder}}>
                                        <Image source={plus} style={{width:50,height:50}} resizeMode='contain'/>
                                    </View>
                                </TouchableWithoutFeedback>
                            )}  
                        </View>
                    </View>
                </ScrollView>
                {!this._isTeco() ? (
                    <View style={{paddingHorizontal:15,position:'absolute',bottom:0,width:'100%',paddingVertical:12,backgroundColor:colors.putih,elevation:4,alignSelf:'flex-end'}}>
                        <Button onPress={this._uploadPhoto} buttonStyle={{borderRadius:10,backgroundColor:colors.primary_color}} title='Upload photo'/>
                    </View>
                ) : null}
                <LoadingState isVisible={isVisibleState}/>
                <ImageView
                    images={images}
                    imageIndex={0}
                    isVisible={this.state.isImageViewVisible}
                    onClose={this._handleImageViewVisible}
                    renderFooter={this._renderFooter}
                />
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
        update_WO : (data) => dispatch(updateWO(data)),
        update_FORM : (data)=> dispatch(updateFORM(data))
    }
}

const styles = StyleSheet.create({
    footerText: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
    },
    footer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
})

export default connect(mapStateToProps,mapDispatchToProps)(UploadphotocontifeedScreen)
