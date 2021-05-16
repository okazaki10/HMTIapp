import React, { useState } from 'react';
import { View, Image, Dimensions, ImageBackground } from 'react-native';
import { Text, Button } from 'react-native-elements';

import  { colors } from '../globalstyles';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import style from '../globalstyles';

import AsyncStorage from '@react-native-community/async-storage';
function Mainpage(props) {
    const { width: DEVICE_WIDTH } = Dimensions.get('window');
    const [entries, setentries] = useState(
        [{
            title: "Main Feeds",
            gambar: require("../assets/image/Activities.jpg"),
            subtitle: "Menyediakan informasi teraktual dan terpercaya seputar kegiatan Himpunan Teknik Industri ITS."
        }, {
            title: "Notifications",
            gambar: require("../assets/image/Calendar.jpg"),
            subtitle: "Fitur pengingat untukmu agar kamu tidak ketinggalan informasi penting seputar Himpunan"
        }, {
            title: "Calendar",
            gambar: require("../assets/image/Feeds.jpg"),
            subtitle: "Memberikanmu akses untuk mengetahui berbagai kegiatan yang sudah dijadwalkan oleh Himpunanmu"
        }, {
            title: "Main Feeds",
            gambar: require("../assets/image/Profile.jpg"),
            subtitle: "Menyediakan informasi teraktual dan terpercaya seputar kegiatan Himpunan Teknik Industri ITS."
        }]
    )
    const storeData = async (guide) => {
        try {
            await AsyncStorage.setItem("guide", guide)
            props.navigation.navigate("Login")
        } catch (e) {
            // saving error
        }
    }
    const [activeSlide, setactiveSlide] = useState(0)
    const _renderItem = ({ item, index }) => {
        return (
            <View>
        
                <Image
                    source={item.gambar}
                    style={{ width: DEVICE_WIDTH, marginTop: 0,height:500 }}
                    resizeMode="contain"
                />

            </View>
        )
    }

    return (
        <View style={style.main}>
            
            <ImageBackground
                source={require("../assets/image/back_to_school.png")}
                style={{ flex: 1 }}
                resizeMode="stretch">
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <View>
                            <Carousel
                                data={entries}
                                renderItem={_renderItem}
                                onSnapToItem={(index) => setactiveSlide(index)}
                                sliderWidth={DEVICE_WIDTH}
                                itemWidth={DEVICE_WIDTH}
                                layout="default"
                                //containerCustomStyle={{width:100,height:100}}
                                //contentContainerCustomStyle={{width:100,height:100}}
                                inactiveSlideScale={1}
                                slideStyle={{ width: DEVICE_WIDTH }}
                            />
                        </View>
                        <Pagination
                            dotsLength={entries.length}
                            activeDotIndex={activeSlide}
                            dotStyle={{
                                width: 10,
                                height: 10,
                                borderRadius: 5,

                                backgroundColor: colors.button
                            }}
                            inactiveDotStyle={{
                                // Define styles for inactive dots here
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                        />
                    </View>
                    <View style={{ alignItems: "center", marginBottom: 20 }}>
                        <Button title="Lewati" onPress={() => {
                    
                            storeData("0")}} buttonStyle={style.button} titleStyle={{ color: colors.black, fontFamily: "NunitoSans-SemiBold", fontSize: 18 }}></Button>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default Mainpage;

