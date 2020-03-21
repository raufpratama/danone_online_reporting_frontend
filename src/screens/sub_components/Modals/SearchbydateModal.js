import React, { Component } from 'react'
import { View, Text, ActivityIndicator, Linking, DatePickerAndroid } from 'react-native'
import Modal from 'react-native-modal'
import { Button, Divider, Input } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select'
import axios from 'axios'
import { connect } from 'react-redux'
import moment from 'moment'

const colors = require('../../../assets/utils/colors')
const route_header = require('../../../assets/utils/urls')
const area = require('../../../assets/utils/area')


class SearchbydateModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isloading:false,
            excel_url:'',
            export_complete:false,
            start_date:'',
            end_date:''
        }
    }

    _handleValueChange = (name) => {
        return (value) => {
            this.setState({ [name]:value })
        }
    }

    _datePickerStartDate = async(key) => {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
              // Use `new Date()` for current date.
              // May 25 2020. Month 0 is January.
              date: new Date(),
              mode:'calendar',
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                let date = new Date(year, month, day);
                let new_date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate().length < 10 ? '0'+date.getDate() : date.getDate()}`
                this.setState({start_date:new_date})
                // let newState = {};
                // newState['date'] = date;
                // newState['dateText'] = date.toLocaleDateString("en-US");
                // this.setState(newState);
            }
          } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
          }
    }

    _datePickerEndtDate = async(key) => {
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
              // Use `new Date()` for current date.
              // May 25 2020. Month 0 is January.
              date: new Date(),
              mode:'calendar',
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                let date = new Date(year, month, day);
                let new_date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate().length < 10 ? '0'+date.getDate() : date.getDate()}`
                this.setState({end_date:new_date})
                // let newState = {};
                // newState['date'] = date;
                // newState['dateText'] = date.toLocaleDateString("en-US");
                // this.setState(newState);
            }
          } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
          }
    }

    _search = () => {
        if(this.state.start_date.length > 0 && this.state.end_date.length > 0) {
            this.setState({isloading:true})
            axios.get(`${route_header.header}/wo/list/${this.props.searchEndpoint}/${this.state.start_date}/to/${this.state.end_date}`,{headers:{'Authorization':`Bearer ${this.props.userDetail.res.token}`}})
            .then(response=>{
                this.setState({isloading:false})
                this.props.handlesearch(response.data.res)
            })
            .catch(e=> {
                console.log(`terjadi kesalahan saat ingin search date ${e}`)
                this.setState({isloading:false})
            })
        } else {
            alert('silahkan pilih bulan dan tahun terlebih dahulu')
            this.setState({isloading:false})
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
                ) : 
                    <View>
                        <View style={{marginVertical:10}}>
                            <Text>Select start date</Text>
                            <Button type='clear' title={this.state.start_date.length > 0 ? this.state.start_date : 'select date'} onPress={this._datePickerStartDate}/>
                        </View>
                        <View style={{marginVertical:10}}>
                            <Text>Select end date</Text>
                            <Button type='clear' title={this.state.end_date.length > 0 ? this.state.end_date : 'select date'} onPress={this._datePickerEndtDate}/>
                        </View>
                        <Button onPress={this._search} title='search'/>
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

export default connect(mapStateToProps)(SearchbydateModal)
