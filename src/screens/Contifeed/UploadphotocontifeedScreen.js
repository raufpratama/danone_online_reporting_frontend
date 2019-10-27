import React, { Component } from 'react'
import { Text, View, TouchableWithoutFeedback, Alert } from 'react-native'
import { Header, Icon, Divider, Button, Image } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu'
import LoadingState from '../sub_components/LoadingState'
import axios from 'axios'

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

class UploadphotocontifeedScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            header_title:props.navigation.getParam('header_title',''),
            wo_task:props.navigation.getParam('wo_task',''),
            wo_item_id:props.navigation.getParam('wo_item_id',''),
            done_item:props.navigation.getParam('done_item',''),
            image_before:props.navigation.getParam('image_before',''),
            image_after:props.navigation.getParam('image_after',''),
            image_placeholder:'https://www.bigw.com.au/medias/sys_master/images/images/h40/hed/12107450089502.jpg',
            form_data_before:'',
            form_data_after:'',
            isVisibleState:false,
        }
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
        const { image_after, image_before,wo_item_id,form_data_before,form_data_after, done_item } = this.state;
        if(image_after.length > 0 && image_before.length >0) {
            this.setState({isVisibleState:true})
            axios({
                method:'POST',
                url:`${route_url.header}/wo/picBefore/${wo_item_id}`,
                data:form_data_before
            })
            .then(response=>{
                console.log(response.data)
                this.setState({isVisibleState:false})
                done_item(wo_item_id)
                this.props.navigation.goBack();
            })
            .catch(e=>console.log(`terjadi kesalahan ${e}`))

            axios({
                method:'POST',
                url:`${route_url.header}/wo/picAfter/${wo_item_id}`,
                data:form_data_after
            })
            .then(response=>{
                console.log(response.data)
                this.setState({isVisibleState:false})
            })
            .catch(e=>console.log(`terjadi kesalahan ${e}`))
        } else {
            alert('Kamu belum upload semua form foto')
        }
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
                this.setState({
                    [image_key]: response.uri,
                    [image_key == "image_before" ? "form_data_before":"form_data_after"]:form_data
                });
            }
        })
    }

    render() {
        const { wo_task, image_before, image_after, header_title, image_placeholder, isVisibleState } = this.state;
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
                            <Image source={{uri:image_before}} style={{borderWidth:1,width:100,height:130,borderRadius:5}} resizeMode='cover'/>
                        ) : (
                            <TouchableWithoutFeedback onPress={()=>this._openCamera("image_before")}>
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
                        {image_after.length > 0 ? (
                            <Image source={{uri:image_after}} style={{borderWidth:1,width:100,height:130,borderRadius:5}} resizeMode='cover'/>
                        ) : (
                            <TouchableWithoutFeedback onPress={()=>this._openCamera("image_after")}>
                                <View style={{justifyContent:'center',alignItems:'center',width:100,height:130,borderRadius:1,borderWidth:1,borderStyle:'dashed',borderColor:colors.abu_placeholder}}>
                                    <Image source={plus} style={{width:50,height:50}} resizeMode='contain'/>
                                </View>
                            </TouchableWithoutFeedback>
                        )}  
                    </View>
                </View>
                <View style={{paddingHorizontal:15,position:'absolute',bottom:0,width:'100%',paddingVertical:12,backgroundColor:colors.putih,elevation:4,alignSelf:'flex-end'}}>
                    <Button onPress={this._uploadPhoto} buttonStyle={{borderRadius:10,backgroundColor:colors.primary_color}} title='Upload photo'/>
                </View>
                <LoadingState isVisible={isVisibleState}/>
            </View>
        )
    }
}

export default UploadphotocontifeedScreen
