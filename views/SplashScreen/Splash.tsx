import { View, Text, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import SplashIMG from '../../assets/img/splash.jpg'


const Splash = () => {

   

    const navigation = useNavigation()

    setTimeout(() => {
        navigation.navigate('onboard')
    }, 5000)


    return (
        <View style={{alignItems:'center', justifyContent:'center' , width:'100%', height:'100%' , backgroundColor:'white'}}>
            <Image style={{width:200, height:200}}  source={SplashIMG}/>
            <Text style={{fontSize:25, fontWeight:'bold'}}>SIHATI</Text>
            <Text style={{fontWeight:'bold'}}>Sistem Informasi Keanekaragaman Hayati</Text>
            <Text >C.XION</Text>
        </View>
    )
}

export default Splash