import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions, ScrollView, Alert, ImageBackground, BackHandler } from 'react-native';
import { Input, Text, Button } from 'react-native-elements';

import { colors } from '../globalstyles';

import style from '../globalstyles';
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format} from 'date-fns';
import { id } from 'date-fns/locale';
import messaging from '@react-native-firebase/messaging';

function Profil(props) {

    const [gambar, setgambar] = useState("")

    const [hide, sethide] = useState(true)
    const [profile, setprofile] = useState({})
    const [name, setname] = useState("")
    const [address, setaddress] = useState("")
    const [password, setpassword] = useState("")
    const [passwordbaru, setpasswordbaru] = useState("")
    const [konfirmasipasswordbaru, setkonfirmasipasswordbaru] = useState("")
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [options, setoptions] = useState({
        title: 'Select Avatar',
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        quality: 0.5
    })

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showDatepicker = (tipe) => {
        setMode(tipe);
        setShow(true);
    };
    const gantiprofil = () => {
        if (global.status == 0) {
            ImagePicker.showImagePicker(options, (response) => {
                //console.log('Response = ', response);

                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    if (response.uri) {
                        sethide(false)
                        setgambar(response.uri)
                        updatefoto(response.data)
                    }

                    // You can also display the image using data:
                    // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                }
            });
        }
    }

    const updatefoto = (gambar) => {
        setspinner(true)
        fetch(global.url + '/user/updatefoto', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global.key,
            },
            body: JSON.stringify({
                image_string: gambar
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                //console.log(gambarstring)
                setspinner(false)
                if (!json.errors) {

                } else {
                    Alert.alert(json.message)
                }
            })
            .catch((error) => {
                console.error(error)
                setspinner(false)
            });
    }
    const storeData = () => {
        setspinner(true)
        fetch(global.url + "/logout", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + global.key,
            },
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                messaging()
                    .unsubscribeFromTopic('event')
                    .then(() => console.log('Unsubscribed fom the topic!'));
                storeData2()
            })
            .catch((error) => {
                console.error(error)
                setspinner(false)
            });
    };

    const storeData2 = async () => {
        try {
            await AsyncStorage.setItem('key', "")
            setspinner(false)
            global.key = ""
            props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (e) {
            // saving error
        }
    }

    const authorize = () => {
        fetch(global.url + "/user", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + global.key,
            },
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                setprofile(json)
                setgambar(json.image)
                setname(json.user.userable.name)
                setaddress(json.user.userable.address)
                if (json.user.userable.birthday) {
                    setDate(new Date(json.user.userable.birthday))
                }
            })
            .catch((error) => console.error(error));
    };

    const updateprofile = () => {
        if (name == "" || address == "") {
            setisipesan2("Data tidak boleh ada yang kosong")
            toggleModal3()
        } else {
            setspinner(true)
            fetch(global.url + '/user/update', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + global.key,
                },
                body: JSON.stringify({
                    name: name,
                    birthday: format(date, "yyyy-MM-dd"),
                    address: address,

                })
            })
                .then((response) => response.json())
                .then((json) => {
                    console.log(json)
                    setspinner(false)
                    if (!json.errors) {
                        if (password != "") {
                            updatepasswords()
                        } else {
                            props.navigation.reset({
                                index: 0,
                                routes: [{ name: 'Menu_bar' }],
                            });
                        }
                    } else {
                        setisipesan2(json.message)
                        toggleModal3()
                    }
                })
                .catch((error) => {
                    console.error(error)
                    setspinner(false)
                });
        }
    }
    const updatepasswords = () => {
        if (passwordbaru.length >= 8) {
            if (passwordbaru == konfirmasipasswordbaru) {
                fetch(global.url + '/user/updatepasswords', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + global.key,
                    },
                    body: JSON.stringify({
                        password: password,
                        new_password: passwordbaru
                    })
                })
                    .then((response) => response.json())
                    .then((json) => {
                        console.log(json)
                        setspinner(false)
                        if (!json.errors) {
                            props.navigation.reset({
                                index: 0,
                                routes: [{ name: 'Menu_bar' }],
                            });
                        } else {
                            setisipesan2(json.errors.email ? json.errors.email : json.message)
                            toggleModal3()
                        }
                    })
                    .catch((error) => {
                        console.error(error)
                        setspinner(false)
                    });
            } else {
                setisipesan2("Password baru dan konfirmasi password baru tidak sama")
                toggleModal3()
            }
        } else {
            setisipesan2("Password baru harus lebih dari 8 karakter")
            toggleModal3()
        }
    }

    const [spinner, setspinner] = React.useState(false)
    useState(() => {
        authorize()
    })

    const [isipesan2, setisipesan2] = useState("")
    const toggleModal3 = () => {
        setModalVisible3(!isModalVisible3);
    };
    const [isModalVisible3, setModalVisible3] = useState(false);
    const [showerrorkah, setshowerrorkah] = useState(true)
    useEffect(() => {
        const backhandler = BackHandler.addEventListener('hardwareBackPress', kembali);
        return () => backhandler.remove()
    })
    const kembali = () => {
        props.navigation.reset({
            index: 0,
            routes: [{ name: 'Menu_bar' }],
        });
        return true
    }
    return (
        <View style={style.main}>
            <Modal isVisible={isModalVisible3}
                onBackdropPress={toggleModal3}
                onBackButtonPress={toggleModal3}>
                <View style={style.content}>
                    <View>
                        <TouchableOpacity style={{ alignItems: "flex-end" }} onPress={toggleModal3}>
                            <FontAwesomeIcon icon={faTimes} size={22} color={"black"}></FontAwesomeIcon>
                        </TouchableOpacity>
                        {showerrorkah ? (<View style={{ alignItems: "center" }}>
                            <Image
                                source={require("../assets/image/exit.png")}
                                style={{ width: 50, height: 50 }}
                                resizeMode="contain"
                            />
                        </View>) : (null)}
                        <Text style={[style.nunitosans, { textAlign: "center", marginTop: 15 }]}>{isipesan2}</Text>
                    </View>
                </View>
            </Modal>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}

                />
            )}
            <Spinner
                visible={spinner}
                textContent={'Loading...'}
                textStyle={{ color: '#FFF' }}
            />
            <ScrollView>
                <ImageBackground
                    source={require("../assets/image/profile.png")}
                    style={{ height: 400, width: "100%" }}
                    resizeMode="stretch"
                >
                    <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 30, marginRight: 30 }}>
                        <Text style={[style.poppinsbold, { color: "white", fontSize: 20, textAlign: "center", flex: 1, marginLeft: 25 }]}>Profile</Text>
                        <TouchableOpacity onPress={() =>
                            props.navigation.reset({
                                index: 0,
                                routes: [{ name: 'Menu_bar' }],
                            })}>
                            <Ionicons name={'close'} size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={gantiprofil} style={{ flexDirection: "row", justifyContent: "center", marginTop: 30 }}>
                        <Image
                            source={{ uri: gambar == "" ? "https://thumbs.dreamstime.com/b/creative-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mockup-144849704.jpg" : gambar }}
                            style={{ width: 200, height: 200, borderRadius: 100 }}
                            resizeMode="cover"
                        ></Image>
                        <View style={{ position: "absolute", bottom: 10, paddingLeft: 140 }}>
                            <Image
                                source={require("../assets/image/tambahprofil.png")}
                                style={{ width: 50, height: 50, borderRadius: 200 }}
                                resizeMode="contain"
                            ></Image>
                        </View>
                    </TouchableOpacity>
                    <Text style={[style.nunitosansemi, { color: "white", fontSize: 25, textAlign: "center", marginTop: 15 }]}>{profile.user ? profile.user.userable.name : ""}</Text>
                    <Text style={[style.nunitosans, { color: "white", fontSize: 15, textAlign: "center", marginTop: 5 }]}>{profile.user ? profile.user.userable.nrp : ""}</Text>
                </ImageBackground>
                {global.status == 0 ? (<View style={{ flex: 1, padding: 22 }}>
                    <Text style={[style.poppinsbold, { textAlign: "center" }]}>Ganti Identitas</Text>
                    <View >
                        <Input placeholder="Nama Lengkap" value={name} onChangeText={setname} style={{ marginTop: 15 }}></Input>
                        <Input placeholder="Alamat" value={address} onChangeText={setaddress}></Input>
                        <Text style={[style.nunitosans, { color: "black", fontSize: 18, marginLeft: 10 }]}>Tanggal Lahir</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
                            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => showDatepicker('date')}>
                                <Text style={[style.nunitosansemi, { fontSize: 15, color: "black" }]}>{format(date, "iii', 'dd' 'MMM', 'yyyy'", { locale: id })}</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}></View>
                        </View>
                        <View style={[style.line, { backgroundColor: "black", marginRight: 10, marginLeft: 10 }]}></View>
                        <Text style={[style.nunitosans, { color: "black", fontSize: 18, marginLeft: 10, marginTop: 15 }]}>Ganti Password (Kosongkan jika tidak ingin mengganti)</Text>
                        <Input placeholder="Password Lama" onChangeText={setpassword} secureTextEntry={true} style={{ marginTop: 15 }}></Input>
                        <Input placeholder="Password Baru" onChangeText={setpasswordbaru} secureTextEntry={true}></Input>
                        <Input placeholder="Konfirmasi Password Baru" onChangeText={setkonfirmasipasswordbaru} secureTextEntry={true}></Input>
                    </View>
                </View>) : (null)}

            </ScrollView>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20, marginRight: 10, marginLeft: 10 }}>
                {global.status == 0 ? (<View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                    <Button title="Simpan" onPress={updateprofile} buttonStyle={style.button} titleStyle={{ color: colors.black, fontFamily: "NunitoSans-SemiBold", fontSize: 18 }}></Button>
                </View>) : (null)}

                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                    <Button title="Logout" onPress={storeData} buttonStyle={[style.button, { backgroundColor: "red" }]} titleStyle={{ color: "white", fontFamily: "NunitoSans-SemiBold", fontSize: 18 }}></Button>
                </View>
            </View>
        </View >
    );
};

export default Profil;
