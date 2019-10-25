import React, { Component } from 'react'
import { Text, View, FlatList } from 'react-native'
import axios from 'axios'

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
const area = require('../../assets/utils/area')

class TugascontifeedScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wo_tasks:''
        }
    }

    componentDidMount = () => {
        axios.get(`${route_url}/wo/list`,{})
    }

    _renderItem = ({item}) => {
        return (
            <View style={{elevation:4,borderRadius:5,paddingHorizontal:13,paddingVertical:14}}>
                <View style={{width:126}}>
                    <Text style={{}}></Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex:1}}>
                <FlatList
                    data={dummy_wo_task}
                    renderItem={this._renderItem}
                    contentContainerStyle={{padding:16}}
                    keyExtractor={(item,id)=>item.op_number}
                />
            </View>
        )
    }
}

export default TugascontifeedScreen
