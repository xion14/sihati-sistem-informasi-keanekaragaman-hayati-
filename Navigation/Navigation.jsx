import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Splash from '../views/SplashScreen/Splash';
import Home from '../views/Home';
import Onboard from '../views/Onboard';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home2 from '../views/Home2';
import Home3 from '../views/Home3';
import { Primary_C } from '../views/styles/Css';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Home4 from '../views/Home4';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function HomeTabsNavigation({ navigation }) {
    return (
        <Tab.Navigator
            initialRouteName='Home1'
            independent={true}
            screenOptions={{
                tabBarLabel: '',
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 8,
                    left: 10,
                    right: 10,
                    elevation: 0,
                    backgroundColor: '#ffffff',
                    borderRadius: 0,
                    height: hp('10%'),

                }
            }}

        >

            <Tab.Screen
                name="Home1"
                component={Home}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Home1')

                            }}
                            style={{ alignItems: 'center', justifyContent: 'center', top: 10, backgroundColor: 'white', width: wp(15) }}>
                            <Image
                                source={require('../assets/TabIcon/paw.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 30,
                                    tintColor: focused ? Primary_C : '#748c94',
                                }}
                            />


                        </TouchableOpacity>
                    )
                }} />
            <Tab.Screen
                name="Home2"
                component={Home2}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Home2')

                            }}
                            style={{ alignItems: 'center', justifyContent: 'center', top: 10, backgroundColor: 'white', width: wp(15) }}>
                            <Image
                                source={require('../assets/TabIcon/qr-code.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 30,
                                    tintColor: focused ? Primary_C : '#748c94',
                                }}
                            />


                        </TouchableOpacity>
                    )
                }} />
            <Tab.Screen
                name="Home3"
                component={Home3}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Home3')

                            }}
                            style={{ alignItems: 'center', justifyContent: 'center', top: 10, backgroundColor: 'white', width: wp(15) }}>
                            <Image
                                source={require('../assets/TabIcon/download.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 30,
                                    tintColor: focused ? Primary_C : '#748c94',
                                }}
                            />


                        </TouchableOpacity>
                    )
                }} />
            <Tab.Screen
                name="Home4"
                component={Home4}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Home4')

                            }}
                            style={{ alignItems: 'center', justifyContent: 'center', top: 10, backgroundColor: 'white', width: wp(15) }}>
                            <Image
                                source={require('../assets/TabIcon/about.png')}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 30,
                                    tintColor: focused ? Primary_C : '#748c94',
                                }}
                            />


                        </TouchableOpacity>
                    )
                }} />


        </Tab.Navigator>
    )
}



const Navigation = () => {
    return (
        <NavigationContainer
            initialRouteName='splash'>
            <Stack.Navigator>
                <Stack.Screen
                    name='splash'
                    component={Splash}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name='HomeTab'
                    component={HomeTabsNavigation}
                    options={
                        { headerShown: false }
                    }
                />
                <Stack.Screen
                    name='onboard'
                    component={Onboard}
                />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        right: -5,
        top: -3,
        backgroundColor: Primary_C,
        borderRadius: 10,
        width: 12,
        height: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge2: {
        position: 'absolute',
        right: -5,
        top: -3,
        backgroundColor: 'white',
        borderRadius: 10,
        width: 12,
        height: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 7,
        fontWeight: 'bold',
    }
})