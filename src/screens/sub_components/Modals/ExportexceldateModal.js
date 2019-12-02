import React, { Component } from 'react'
import { View, Text, ActivityIndicator, Linking } from 'react-native'
import Modal from 'react-native-modal'
import { Button, Divider, Input } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select'
import axios from 'axios'
import { connect } from 'react-redux'

const colors = require('../../../assets/utils/colors')
const route_header = require('../../../assets/utils/urls')
const months = [
    { label: 'Januari', value: '01' },
    { label: 'Februari', value: '02' },
    { label: 'Maret', value: '03' },
    { label: 'April', value: '04' },
    { label: 'Mei', value: '05' },
    { label: 'Juni', value: '06' },
    { label: 'Juli', value: '07' },
    { label: 'Agustus', value: '08' },
    { label: 'September', value: '09' },
    { label: 'Oktober', value: '10' },
    { label: 'November', value: '11' },
    { label: 'Desember', value: '12' },
]

const years = [
    { label: '2019', value: '2019' },
    { label: '2020', value: '2020' },
    { label: '2021', value: '2021' },
    { label: '2022', value: '2022' },
    { label: '2023', value: '2023' },
]


class ExportexceldateModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            month:'',
            year:'',
            isloading:false,
            excel_url:'',
            export_complete:false
        }
    }

    _handleValueChange = (name) => {
        return (value) => {
            this.setState({ [name]:value })
        }
    }

    _downloadExcel = () => {
        Linking.openURL(`${route_header.header}${this.state.excel_url.length > 0 ? this.state.excel_url.replace('.','') : null}`)
        .then(()=>this.props.handlemodal)
        .catch(e=>console.log(`terjadi kesalahan ${e}`))
    }

    _exportExcel = () => {
        if(this.state.month.length > 0 && this.state.year.length > 0) {
            this.setState({isloading:true})
            axios.get(`${route_header.header}/wo/export/${this.state.year}/${this.state.month}`,{headers:{'Authorization':`Bearer ${this.props.userDetail.res.token}`}})
            .then(response=>{
                this.setState({excel_url:response.data.res.excelUrl},()=>this.setState({isloading:false,export_complete:true}))
            })
            .catch(e=>console.log(`terjadi kesalahan saat ingin export excel`))
        } else {
            alert('silahkan pilih bulan dan tahun terlebih dahulu')
        }
    }
    
    render() {
        const { isloading, export_complete } = this.state;
        return (
            <Modal
            isVisible={this.props.isVisible}
            animationIn={'bounceInUp'}
            animationOut={'bounceOutDown'}
            onBackdropPress={this.props.handlemodal}
            onBackButtonPress={this.props.handlemodal}
            onSwipeCancel={this.props.handlemodal}
            animationInTiming={500}
            animationOutTiming={300}
        >
            <View style={{padding:16,borderRadius:10,backgroundColor:colors.putih}}>
                {/* <View style={{marginVertical:10}}>
                    <Text>Select start date</Text>
                    <Text>{}</Text>
                    <Button onPress={HandleStartDate} title='Select date'/>
                </View>
                <View style={{marginVertical:10}}>
                    <Text>Select end date</Text>
                    <Text>{}</Text>
                    <Button onPress={HandleEndDate} title='Select date'/>
                </View> */}
                {isloading ? (
                    <ActivityIndicator/>
                ) : export_complete ? (
                    <View>
                        <Text>Export success!</Text>
                        <Button title='download excel' onPress={this._downloadExcel}/>
                    </View>
                ) :
                    <View>
                        <View style={{marginVertical:10}}>
                            <Text>Select month</Text>
                            <RNPickerSelect
                                items={months}
                                onValueChange={this._handleValueChange("month")}
                            />
                        </View>
                        <View style={{marginVertical:10}}>
                            <Text>Select year</Text>
                            <RNPickerSelect
                                items={years}
                                onValueChange={this._handleValueChange("year")}
                            />
                        </View>
                        <Button onPress={this._exportExcel} title='export'/>
                    </View>
                }
            </View>
        </Modal>
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

export default connect(mapStateToProps)(ExportexceldateModal)
