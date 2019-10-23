import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class TugascontiformScreen extends Component {
    render() {
        return (
            <View>
                <Text onPress={()=>this.props.navigation.navigate('Detail')}> textInComponent </Text>
            </View>
        )
    }
}
