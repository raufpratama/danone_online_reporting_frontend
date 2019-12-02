import React from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import { Overlay } from 'react-native-elements'

const colors = require('../../assets/utils/colors')

const LoadingState = ({isVisible}) => {
        return (
            <Overlay
                isVisible={isVisible}
                windowBackgroundColor="rgba(0, 0, 0, .6)"
                overlayBackgroundColor="transparent"
                overlayStyle={{borderColor:'transparent',elevation:0}}
                height="auto"
                width="auto"
            >
                <ActivityIndicator size={50} color={colors.primary_color}/>
            </Overlay>
        )
}

export default LoadingState;
