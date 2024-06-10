import { View, Text, Image } from 'react-native'
import React from 'react'
import { OnboardFlow } from 'react-native-onboard'
import { useNavigation } from '@react-navigation/native'
import image1 from '.././assets/img/splash3.png'
import image2 from '.././assets/img/splash4.jpg'
import image3 from '.././assets/img/splash5.jpg'
import image4 from '.././assets/img/splash6.jpg'


const Onboard = () => {

  const navigation = useNavigation()


  const PAGES = [
    {
      title: 'Petualangan alam liar',
      subtitle: 'Jelajahi Kehidupan Flora Dan Fauna Pada Handphone Anda',
      imageUri: Image.resolveAssetSource(image1).uri, // Resolve local image to URI
    },
    {
      title: 'Alam pada Ponsel Anda',
      subtitle: 'Temukan Pesona Tumbuhan dan Hewan yang Mengagumkan Dalam Satu Sentuhan',
      imageUri: Image.resolveAssetSource(image2).uri,
    },
    {
      title: 'Dunia Kecil yang Besar',
      subtitle: 'Petualangan Digital Menuju Kehidupan Alam yang Menakjubkan',
      imageUri: Image.resolveAssetSource(image3).uri,

    },
    {
      title: 'Eksplorasi Alam',
      subtitle: 'Temukan Kehidupan Flora dan Fauna dalam Setiap Sentuhan Layar Anda',
      imageUri: Image.resolveAssetSource(image4).uri,

    },
  ]

  return (
    <View>
      <OnboardFlow
        onDone={() => navigation.navigate('HomeTab')}
        pages={PAGES}
        type={'fullscreen'}
        style={{
          color:'red',
          backgroundColor:'white',
          
        }}
      />
    </View>
  )
}

export default Onboard