import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import createMaterialTopTabNavigator from 'react-navigation-tabs/src/navigators/createMaterialTopTabNavigator'
import { Icon } from 'react-native-elements'

const colors = require('../../assets/utils/colors')
const danone_logo_online_report_logo = require('../../assets/images/AGUA.png')

import LoginScreen from '../LoginScreen'

import AuthScreen from '../AuthScreen'

import TugascontifeedScreen from '../Contifeed/TugascontifeedScreen'
import RiwayatcontifeedScreen from '../Contifeed/RiwayatcontifeedScreen'
import DetailtugasriwayatcontifeedScreen from '../Contifeed/DetailtugasriwayatcontifeedScreen'
import UploadphotocontifeedScreen from '../Contifeed/UploadphotocontifeedScreen'

import TugascontiformScreen from '../Contiform/TugascontiformScreen'
import RiwayatcontiformScreen from '../Contiform/RiwayatcontiformScreen'
import DetailtugasriwayatcontiformScreen from '../Contiform/DetailtugasriwayatcontiformScreen'
import UploadphotocontiformScreen from '../Contiform/UploadphotocontiformScreen'

import TugasmodulfillScreen from '../Modulfill/TugasmodulfillScreen'
import RiwayatmodulfillScreen from '../Modulfill/RiwayatmodulfillScreen'
import DetailtugasriwayatmodulfillScreen from '../Modulfill/DetailtugasriwayatmodulfillScreen'
import UploadphotomodulfillScreen from '../Modulfill/UploadphotomodulfillScreen'
import ManagerScreen from '../Manager/ManagerScreen'

const logos = [
    {
        active:require('../../assets/images/factory_active.png'),
        placeholder:require('../../assets/images/industry_outline.png')
    },
    {
        active:require('../../assets/images/industry_active.png'),
        placeholder:require('../../assets/images/industry_outline.png')
    },
    {
        active:require('../../assets/images/pabrik_active.png'),
        placeholder:require('../../assets/images/pabrik_outline.png')
    },
]

const ContifeedtabStack = createMaterialTopTabNavigator({
    Tugas:TugascontifeedScreen,
    Riwayat:RiwayatcontifeedScreen,
},{
    initialRouteName:'Tugas',
    tabBarOptions:{
        labelStyle:{
            fontSize:16,
        },
        activeTintColor:colors.primary_color,
        inactiveTintColor:colors.abu_subtitle,
        indicatorStyle:{
            backgroundColor:colors.primary_color  
        },
        style:{
            backgroundColor:colors.putih,
        },
        upperCaseLabel:false
    }
})

const ContiformtabStack = createMaterialTopTabNavigator({
    Tugas:TugascontiformScreen,
    Riwayat:RiwayatcontiformScreen,
},{
    initialRouteName:'Tugas',
    tabBarOptions:{
        labelStyle:{
            fontSize:16,
        },
        activeTintColor:colors.primary_color,
        inactiveTintColor:colors.abu_subtitle,
        indicatorStyle:{
            backgroundColor:colors.primary_color  
        },
        style:{
            backgroundColor:colors.putih,
        },
        upperCaseLabel:false
    }
})

const ModulfilltabStack = createMaterialTopTabNavigator({
    Tugas:TugasmodulfillScreen,
    Riwayat:RiwayatmodulfillScreen,
},{
    initialRouteName:'Tugas',
    tabBarOptions:{
        labelStyle:{
            fontSize:16,
        },
        activeTintColor:colors.primary_color,
        inactiveTintColor:colors.abu_subtitle,
        indicatorStyle:{
            backgroundColor:colors.primary_color  
        },
        style:{
            backgroundColor:colors.putih,
        },
        upperCaseLabel:false
    }
})

const ContifeedStack = createStackNavigator({
    Mainstack:{
        screen:ContifeedtabStack,
        navigationOptions:{
            headerTitle:'Online Reporting',
            headerTitleStyle:{
                marginHorizontal:40,
            },
            headerLeft:(<Image source={danone_logo_online_report_logo} style={{width:72,height:72,marginHorizontal:10}} resizeMode='contain'/>),
            headerStyle:{
                elevation:0,
            }
        }
    },
    Detail:{
        screen:DetailtugasriwayatcontifeedScreen,
        navigationOptions:{
            header:null
        }
    },
    Uploadphoto:{
        screen:UploadphotocontifeedScreen,
        navigationOptions:{
            header:null
        }
    }
},{
    initialRouteName:'Mainstack',
})

const ContiformStack = createStackNavigator({
    Mainstack:{
        screen:ContiformtabStack,
        navigationOptions:{
            headerTitle:'Online Reporting',
            headerTitleStyle:{
                marginHorizontal:40,
            },
            headerLeft:(<Image source={danone_logo_online_report_logo} style={{width:72,height:72,marginHorizontal:10}} resizeMode='contain'/>),
            headerStyle:{
                elevation:0,
            }
        }
    },
    Detail:{
        screen:DetailtugasriwayatcontiformScreen,
        navigationOptions:{
            header:null
        }
    },
    Uploadphoto:{
        screen:UploadphotocontiformScreen,
        navigationOptions:{
            header:null
        }
    }
},{
    initialRouteName:'Mainstack',
})

const ModulfillStack = createStackNavigator({
    Mainstack:{
        screen:ModulfilltabStack,
        navigationOptions:{
            headerTitle:'Online Reporting',
            headerTitleStyle:{
                marginHorizontal:40,
            },
            headerLeft:(<Image source={danone_logo_online_report_logo} style={{width:72,height:72,marginHorizontal:10}} resizeMode='contain'/>),
            headerStyle:{
                elevation:0,
            }
        }
    },
    Detail:{
        screen:DetailtugasriwayatmodulfillScreen,
        navigationOptions:{
            header:null
        }
    },
    Uploadphoto:{
        screen:UploadphotomodulfillScreen,
        navigationOptions:{
            header:null
        }
    }
},{
    initialRouteName:'Mainstack',
})

ContifeedStack.navigationOptions = ({navigation}) => {
    let tabBarVisible;
    if (navigation.state.routes.length > 1) {
        navigation.state.routes.map(route => {
        if (route.routeName === "Detail" || route.routeName === 'Uploadphoto' ) {
            tabBarVisible = false;
        } else {
            tabBarVisible = true;
        }
        });
    }
    return {
        tabBarVisible
    };
};

ContiformStack.navigationOptions = ({navigation}) => {
    let tabBarVisible;
    if (navigation.state.routes.length > 1) {
        navigation.state.routes.map(route => {
        if (route.routeName === "Detail" || route.routeName === 'Uploadphoto') {
            tabBarVisible = false;
        } else {
            tabBarVisible = true;
        }
        });
    }
    return {
        tabBarVisible
    };
};

ModulfillStack.navigationOptions = ({navigation}) => {
    let tabBarVisible;
    if (navigation.state.routes.length > 1) {
        navigation.state.routes.map(route => {
        if (route.routeName === "Detail" || route.routeName === 'Uploadphoto') {
            tabBarVisible = false;
        } else {
            tabBarVisible = true;
        }
        });
    }
    return {
        tabBarVisible
    };
};

const AppStack = createBottomTabNavigator({
    Contifeed:{
        screen:ContifeedStack,
        navigationOptions: {
            tabBarIcon: ({ focused,tintColor }) => {
                // return <Icon type='material-community' name={focused ? 'home' : 'home-outline'} size={25} color={tintColor} />;
                return <Image source={focused ? logos[0].active : logos[0].placeholder } style={{width:25,height:25}} resizeMode='contain'/>
            }
        }
    },
    Contiform:{
        screen:ContiformStack,
        navigationOptions:({navigation}) => {
            return {
                    tabBarIcon: ({ focused,tintColor }) => {
                        // return <Icon type='material-community' name={focused ? 'home' : 'home-outline'} size={25} color={tintColor} />;
                        return <Image source={focused ? logos[2].active : logos[2].placeholder } style={{width:25,height:25}} resizeMode='contain'/>
                    },
            }
        }
    },
    Modulfill:{
        screen:ModulfillStack,
        navigationOptions: {
            tabBarIcon: ({ focused,tintColor }) => {
                // return <Icon type='material-community' name={focused ? 'home' : 'home-outline'} size={25} color={tintColor} />;
                return <Image source={focused ? logos[1].active : logos[1].placeholder } style={{width:25,height:25}} resizeMode='contain'/>
            }
        }
    },
},{
        tabBarOptions: {
            activeTintColor: colors.primary_color,
            inactiveTintColor: colors.abu_placeholder,
            style:{
                shadowOffset:{height:-1},shadowRadius:5,shadowOpacity:0.3,shadowColor:'#7a7a7a',borderTopWidth:0,elevation:10
            },
        }
})

const MainApp = createSwitchNavigator({
    Auth:AuthScreen,
    Login:LoginScreen,
    Manager:ManagerScreen,
    App:AppStack
}, {
    initialRouteName:'Auth',
    defaultNavigationOptions:{
        header:null
    }
})

export default createAppContainer(MainApp)