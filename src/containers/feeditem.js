import React, { createRef, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, ImageBackground } from 'react-native';
import { Text} from 'react-native-elements';

import  { colors } from '../globalstyles';

import style from '../globalstyles';

import { TouchableOpacity } from 'react-native-gesture-handler';
import HyperLink from 'react-native-hyperlink';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { formatDistance } from 'date-fns';
import { id } from 'date-fns/locale';
function Feeditem(props) {
    const { width: DEVICE_WIDTH } = Dimensions.get('window');
    const {feedsid,title,caption,viewer,image,created_at} = props.route.params
    const [readby, setreadby] = useState([{}])

    const click = () => {

    }
    const [scrollOffset, setscroll] = useState(Number | undefined)
    const scrollViewRef = createRef()
    useState(() => {
        setscroll(null)
    })
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const handleScrollTo = (p) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo(p);
        }
    };

    const handleOnScroll = (event) => {

        setscroll(event.nativeEvent.contentOffset.y)

    };
    const timeelapsed = (time) => {
        return formatDistance(new Date(),time,{includeSeconds: true,locale:id})
    }
    const [isModalVisible, setModalVisible] = useState(false);
    
    const read_by = (id) => {
        toggleModal()
        fetch(global.url + "/feed/viewer?feed_id=" + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global.key,
            }
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                setreadby(json)

            })
            .catch((error) => {
                console.error(error)
            });
    };
    return (
        <View style={style.main}>
            <Modal
                onSwipeComplete={toggleModal}
                onBackdropPress={toggleModal}
                onBackButtonPress={toggleModal}
                testID={'modal'}
                isVisible={isModalVisible}
                swipeDirection={['down']}
                scrollTo={handleScrollTo}
                scrollOffset={scrollOffset}
                scrollOffsetMax={400 - 300} // content height - ScrollView height
                propagateSwipe={true}
                style={[styles.modal, { marginBottom: -90 }]}>
                <View style={{ backgroundColor: "white", height: 500 }}>
                    <ScrollView
                        ref={scrollViewRef}
                        onScroll={handleOnScroll}
                        scrollEventThrottle={16}>
                        <View style={{}}>
                            <View
                                style={{
                                    backgroundColor: 'lightgray',
                                    width: 30,
                                    height: 2,
                                    alignSelf: 'center',
                                    marginTop: 20,
                                }}
                            />
                            <View style={[styles.content]}>


                                <Text style={[style.nunitosansemi]}>Read by</Text>
                                <View style={style.line}></View>
                                {readby.map(item => item.name ? (
                                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
                                        <Image
                                            source={{ uri: item.foto_profil?item.foto_profil:"https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144849704.jpg" }}
                                            style={{ width: 40, height: 40, borderRadius: 200 }}
                                            resizeMode="cover"
                                        ></Image>
                                        <Text style={[style.poppinsmedium, { marginLeft: 15 }]}>{item.name}</Text>
                                    </View>):(null))}


                                <View style={{ height: 75 }}>

                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>


            <ImageBackground
                source={require("../assets/image/header.png")}
                style={{ height: 71, width: "100%" }}
                resizeMode="stretch"
            >
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 30, marginRight: 30 }}>
               

                    <Text style={[style.poppinsbold, { color: "white", fontSize: 20, textAlign: "center", flex: 1 }]}>Feeds</Text>
               
                </View>
            </ImageBackground>
            <ScrollView>
                <View style={style.container}>
                    <View style={{ marginBottom: 30 }}>
                        <View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={[style.poppinsmedium, { flex: 1 }]}>{title}</Text>
                                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                                    <Ionicons name={'close'} size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                            <Text style={style.nunitosansemi}>{timeelapsed(new Date(created_at))} yang lalu</Text>
                            <Image
                                source={{ uri: image }}
                                style={{ width: "100%", height: DEVICE_WIDTH*0.7,marginTop:5 }}
                                resizeMode="contain"
                            ></Image>
                        </View>
                        <TouchableOpacity style={{ flexDirection: "row" }} onPress={()=>{read_by(feedsid)}}>
                            <Text style={[style.nunitosansemi, { textAlign: "right", flex: 1, marginTop: 2 }]}>Dilihat oleh {viewer} orang</Text>
                        </TouchableOpacity>
                    </View>
                    <HyperLink linkDefault={true} linkStyle={{ color: '#2980b9' }}>
                        {/*<Text style={[style.nunitosans]}>Pembayaran ukt dapat dilakukan mulai minggu depan ke rekening bank masing - masing. Jangan lupa kode untuk ukt adalah 91 sedangkan untuk pembayaran yang lain dengan kode 92.
                        {"\n\n"}
                                untuk pendataan biaya dapat mengunjungi link berikut : https://intip.in/Biayauktbosq # Vivaaaaaaat</Text>*/}
                    <Text style={[style.nunitosans]}>{caption}</Text>
                    </HyperLink>

                </View>
            </ScrollView>
        </View>
    );
};

export default Feeditem;


const styles = StyleSheet.create({
    buttonblue: {
        backgroundColor: colors.primary, borderRadius: 50, marginRight: 40, marginLeft: 40, marginBottom: 20
    },
    fontsbold: {
        fontSize: 15,
        fontFamily: "Raleway-Bold",
    },
    fontsregular: {
        fontSize: 14,
        fontFamily: "Raleway-Regular",
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,

    },
    scrollableModal: {
        height: 300,
    },
    scrollableModalContent1: {
        height: 200,
        backgroundColor: '#87BBE0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollableModalText1: {
        fontSize: 20,
        color: 'white',
    },
    scrollableModalContent2: {
        height: 200,
        backgroundColor: '#A9DCD3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollableModalText2: {
        fontSize: 20,
        color: 'white',
    },
    isigender2: {
        backgroundColor: '#fff',
        height: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        borderRadius: 10,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    harga2: {
        backgroundColor: '#fff',
        height: 70,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 10,
        borderRadius: 10,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    isigender: {
        backgroundColor: colors.primary,
        height: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        borderRadius: 10,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    isibutton2: {
        backgroundColor: '#fff',
        height: 70,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        borderRadius: 10,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    isibutton: {
        backgroundColor: colors.primary,
        height: 70,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
        borderRadius: 10,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    harga: {
        backgroundColor: colors.primary,
        height: 70,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 10,
        borderRadius: 10,
        elevation: 3,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    content: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        height: '100%',
    },
    content2: {
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    judulmenu: {

        fontSize: 17,
        marginLeft: 10,
        marginRight: 50,
        fontFamily: "Raleway-Bold",
    },
    judul: {
        marginTop: 20,

        fontSize: 20,
        fontFamily: "Raleway-Bold",
    },
    judul2: {

        fontSize: 20,
        fontFamily: "Raleway-Bold",
    },
    cardview: {},
    meetmassage: {
        flex: 1,
        marginRight: 1,
        padding: 5,
    },
    meetclean: {
        flex: 1,
        marginLeft: 1,
        padding: 5,
    },
    gopay: {
        backgroundColor: '#fcfcfc',
        flex: 1,
        height: 30,
        marginRight: 1,
        flexDirection: 'row',
        padding: 5,
    },
    isi: {
        flex: 1,
        marginLeft: 1,
        backgroundColor: '#fcfcfc',
        height: 30,
        padding: 5,
    },

    item: {
        width: Dimensions.get('window').width * 0.5,
        height: 100,
        borderWidth: 1,
        borderColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemIcon: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    itemTitle: {
        marginTop: 16,
    },
    isitext: {
        marginLeft: 5,
        fontFamily: "Raleway-Bold",
        color: 'dimgray',
    },
    main: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {

        marginBottom: 15,
    },
    section_one: {
        marginVertical: 25,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    section_two: {
        flex: 3,
    },
    section_header: {
        color: 'blue',
    },
    tnc: {
        textAlign: 'center',
    },
    tnc_wrapper: {
        flex: 1,
        flexDirection: 'column-reverse',
        backgroundColor: 'red',
    },
});
