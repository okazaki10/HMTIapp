import React, { createRef, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, Alert, ImageBackground, RefreshControl } from 'react-native';
import { Text, Button } from 'react-native-elements';

import { colors } from '../globalstyles';

import style from '../globalstyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';
import { formatDistance } from 'date-fns';
import { id } from 'date-fns/locale';

import Spinner from 'react-native-loading-spinner-overlay';
import messaging from '@react-native-firebase/messaging';
var PushNotification = require("react-native-push-notification");
function Feed(props) {
    const { width: DEVICE_WIDTH } = Dimensions.get('window');
    const [searchmode, setsearchmode] = useState(false)
    const [list, setlist] = useState([{}])
    const [readby, setreadby] = useState([{}])
    const [profile, setprofile] = useState({})
    const globallimit = 20;




    useEffect(() => {


        messaging()
            .subscribeToTopic('event')
            .then(() => console.log('Subscribed to topic!'));
        // Assume a message-notification contains a "type" property in the data payload of the screen to open

        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification,
            );

        });

        // Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );

                }

            });
    }, []);
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {

        })
        return unsubscribe;
    }, [])
    useState(() => {
        messaging()
            .getToken()
            .then(token => {
                console.log(token)
            });
    })
    const feed = (key, limit, offset) => {
        fetch(global.url + "/feed/index?limit=" + limit + "&offset=" + offset, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + key,
            },
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json))
                if (list.length >= json.data.length) {
                    setscrollable(false)
                } else {
                    setscrollable(true)
                }
                setlist(json.data)
                setRefreshing(false)
            })
            .catch((error) => console.error(error));
    };

    const searchfeed = (search) => {

        fetch(global.url + "/feed/searchfeed?search=" + search, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global.key,
            },
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(JSON.stringify(json))
                setlist(json.data)
            })
            .catch((error) => console.error(error));
    };


    const inputview = (id) => {

        fetch(global.url + "/feed/viewer/input", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global.key,
            },
            body: JSON.stringify({
                feed_id: id
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)

            })
            .catch((error) => {
                console.error(error)
            });
    };

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
    const authorize = (key) => {
        fetch(global.url + "/user", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + key,
            },
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                setprofile(json)
            })
            .catch((error) => console.error(error));
    };
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('key')
            if (value !== null) {
                feed(value, globallimit, 0)
                authorize(value)
            }
        } catch (e) {
            // error reading value
        }
    }

    const togglesearch = () => {
        setsearchmode(!searchmode)
    }
    const [scrollOffset, setscroll] = useState(Number | undefined)
    const scrollViewRef = createRef()
    const [isModalVisible, setModalVisible] = useState(false);
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
        return formatDistance(new Date(), time, { includeSeconds: true, locale: id })
    }

    const [feedsid, setfeedsid] = useState("")
    const [type, settype] = useState("")
    const [gambar2, setgambar2] = useState("")
    const [title2, settitle2] = useState("")
    const [description2, setdescription2] = useState("")
    const [isModalVisible2, setModalVisible2] = useState(false);
    const [isipesan, setisipesan] = useState("")

    const setmodal = (itemid, itemgambar, itemtitle, itemdescription) => {
        toggleModal2()
        setfeedsid(itemid)
        settype("2")
        setgambar2(itemgambar)
        settitle2(itemtitle)
        setdescription2(itemdescription)
    };
    const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2);
    };

    const feeddelete = () => {
        setspinner(true)
        fetch(global.url + "/feed/delete", {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global.key,
            },
            body: JSON.stringify({
                feed_id: feedsid
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                setspinner(false)
                toggleModal2()
                feed(global.key, globallimit, 0)
            })
            .catch((error) => {
                console.error(error)
                setspinner(false)
            });
    };

    const substringnama = (value) => {
        var name = value.indexOf(" ")
        var name2;
        if (name != -1) {
            name2 = value.substring(0, name)
        } else {
            name2 = value
        }
        return name2
    }
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        feed(global.key, globallimit, 0)
    }, []);
    const [limit, setlimit] = useState(globallimit)
    const [scrollable, setscrollable] = useState(true)
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {

        const paddingToBottom = 3;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };

    useState(() => {
        getData()
        setlimit(globallimit)
        setscroll(null)
    })
    const [spinner, setspinner] = React.useState(false)
    return (
        <View style={style.main}>
            <Spinner
                visible={spinner}
                textContent={'Loading...'}
                textStyle={{ color: '#FFF' }}
            />
            <Modal isVisible={isModalVisible2}
                onBackdropPress={toggleModal2}
                onBackButtonPress={toggleModal2}>
                <View style={style.content}>
                    <Text style={[style.nunitosans, { textAlign: "center" }]}>{isipesan}</Text>
                    <View style={{ flexDirection: "row", marginTop: 40 }}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Button onPress={feeddelete} title="Hapus" titleStyle={[style.nunitosans, { textAlign: "center", color: "red" }]} buttonStyle={{ backgroundColor: "white" }}></Button>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Button onPress={() => {
                                props.navigation.navigate("Tambahfeed", { feedsid: feedsid, type: type, gambar2: gambar2, judul2: title2, description2: description2 })
                                toggleModal2()
                            }} title="Edit" titleStyle={[style.nunitosans, { textAlign: "center", color: "#E3DB69" }]} buttonStyle={{ backgroundColor: "white" }}>
                            </Button>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Button onPress={toggleModal2} title="Batal" titleStyle={[style.nunitosans, { textAlign: "center", color: "black" }]} buttonStyle={{ backgroundColor: "white" }}>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
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
                                            source={{ uri: item.foto_profil ? item.foto_profil : "https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144849704.jpg" }}
                                            style={{ width: 40, height: 40, borderRadius: 200 }}
                                            resizeMode="cover"
                                        ></Image>
                                        <Text style={[style.poppinsmedium, { marginLeft: 15 }]}>{item.name}</Text>
                                    </View>) : (null))}


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
                    <TouchableOpacity onPress={togglesearch}>
                        <FontAwesomeIcon icon={faSearch} size={28} color={"white"}></FontAwesomeIcon>
                    </TouchableOpacity>
                    {searchmode ?
                        (<TextInput placeholder={"Ketik Sesuatu"} onChangeText={searchfeed} style={{ color: "white", flex: 1, marginLeft: 15, marginRight: 15 }} placeholderTextColor={"white"}></TextInput>)
                        :
                        (<Text style={[style.poppinsbold, { color: "white", fontSize: 20, textAlign: "center", flex: 1 }]}>Feeds</Text>)}
                    <TouchableOpacity onPress={() => {

                        props.navigation.navigate("Profil")

                    }} style={{ justifyContent: "center", alignItems: "center" }}>
                        <Image
                            source={{ uri: profile.image != "" ? profile.image : "https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144849704.jpg" }}
                            style={{ width: 40, height: 40, borderRadius: 50 }}
                            resizeMode="cover"
                        ></Image>
                        <Text style={[style.nunitosansemi, { color: "white", textAlign: "center" }]}>{profile.user ? substringnama(profile.user.userable.name) : ""}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            <ScrollView
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent) && scrollable) {
                        console.log("asdasd")
                        setlimit(limit + globallimit)
                        console.log(limit)
                        feed(global.key, limit + globallimit, 0)
                    }
                }
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={style.container}>
                    {list.map(item => item.id ? (<View style={{ marginBottom: 30 }}>
                        <TouchableOpacity onPress={() => {
                            inputview(item.id)
                            props.navigation.navigate("Feeditem", { feedsid: item.id, title: item.title, created_at: item.created_at, viewer: item.number_of_viewer, caption: item.caption, image: item.image[0] })
                        }
                        }
                            onLongPress={() => {
                                if (status == 1) {
                                    setisipesan("Pilih tindakan mengubah feed")
                                    setmodal(item.id, item.image[0], item.title, item.caption)
                                }
                            }}
                        >
                            <Text style={style.poppinsmedium}>{item.title}</Text>
                            <Text style={style.nunitosansemi}>{timeelapsed(new Date(item.created_at))} yang lalu</Text>

                            <Image
                                source={{ uri: item.image[0] }}
                                style={{ width: "100%", height: DEVICE_WIDTH * 0.7, marginTop: 5 }}
                                resizeMode="contain"
                            ></Image>

                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => read_by(item.id)}>
                            <Text style={[style.nunitosansemi, { textAlign: "right", flex: 1, marginTop: 2 }]}>Dilihat oleh {item.number_of_viewer} orang</Text>
                        </TouchableOpacity>
                    </View>) : (null))}
                </View>
            </ScrollView >
            {
                global.status == 1 ? (<View style={{ position: "absolute", bottom: 10, right: 0, paddingRight: 20 }}>
                    <TouchableOpacity onPress={() => { props.navigation.navigate("Tambahfeed") }}>
                        <Image
                            source={require("../assets/image/tambah.png")}
                            style={{ width: 75, height: 75, borderRadius: 200 }}
                            resizeMode="contain"
                        ></Image>
                    </TouchableOpacity>
                </View>) : (null)
            }

        </View >
    );
};

export default Feed;


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
