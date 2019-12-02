import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'
import LottieView from 'lottie-react-native'
import { Button, Divider, Input } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select'

const colors = require('../../assets/utils/colors')
const font = require('../../assets/utils/fonttype')
const months = [[
    { label: 'Januari', value: '' },
    { label: 'Baseball', value: 'baseball' },
    { label: 'Hockey', value: 'hockey' },
    { label: 'Football', value: 'football' },
    { label: 'Baseball', value: 'baseball' },
    { label: 'Hockey', value: 'hockey' },
    { label: 'Football', value: 'football' },
    { label: 'Baseball', value: 'baseball' },
    { label: 'Hockey', value: 'hockey' },
]]

const PickdateModal = ({isPickdateModalVisible,HandleModal,HandleStartDate,HandleEndDate,endDate,startDate}) => {
    return (
        <Modal
        isVisible={isVisible}
        animationIn={'bounceInUp'}
        animationOut={'bounceOutDown'}
        onBackdropPress={HandleModal}
        onBackButtonPress={HandleModal}
        onSwipeCancel={HandleModal}
        animationInTiming={500}
        animationOutTiming={300}
    >
        <View style={{padding:16,borderRadius:10,backgroundColor:colors.putih}}>
            <View style={{marginVertical:10}}>
                <Text>Select start date</Text>
                <Text>{}</Text>
                <Button onPress={HandleStartDate} title='Select date'/>
            </View>
            <View style={{marginVertical:10}}>
                <Text>Select end date</Text>
                <Text>{}</Text>
                <Button onPress={HandleEndDate} title='Select date'/>
            </View>
        </View>
    </Modal>
    )
}

export default AskrefundModal
