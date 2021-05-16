import React, {useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, Alert, ImageBackground } from 'react-native';
import {  Text, Button } from 'react-native-elements';

import  { colors } from '../globalstyles';

import style from '../globalstyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock,  faTimes } from '@fortawesome/free-solid-svg-icons';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

import { format } from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { id } from 'date-fns/locale';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
function Tambahkalender(props) {

  const [date, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());


  const [name, setname] = useState("")
  const [category, setcategory] = useState("GENERAL")
  const [description, setdescription] = useState("")
  const [background_color, setbackground_color] = useState("#48bf8e")
  const { eventid2, type, name2, category2, background_color2, start_date2, end_date2, description2 } = props.route.params ? props.route.params : "1"
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    if (selectedDate != undefined) {
      var sekarang = new Date()
      if (currentDate >= sekarang) {
        setDate(currentDate);
        var a = new Date(date2)
        a.setDate(currentDate.getDate())
        a.setMonth(currentDate.getMonth())
        a.setFullYear(currentDate.getFullYear())
        setDate2(a)
        if (currentDate.getHours() > date2.getHours()) {
          setDate2(currentDate);
        }
      } else {
        Alert.alert("Tidak bisa set tanggal lebih awal dari tanggal sekarang")
      }
    }
  };

  const showDatepicker = (tipe) => {
    setMode(tipe);
    setShow(true);
  };


  const [show2, setShow2] = useState(false);
  const [mode, setMode] = useState('date');
  const [mode2, setMode2] = useState('date');
  const [ulangi, setulangi] = useState("Setiap Minggu")
  const [show, setShow] = useState(false);
  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow2(Platform.OS === 'ios');
    if (currentDate < date) {
      Alert.alert("Waktu selesai tidak bisa lebih awal dari mulai")
    } else {
      setDate2(currentDate);
    }
  };

  const showDatepicker2 = (tipe) => {
    setMode2(tipe);
    setShow2(true);
  };

  const modal2 = (pesan) => {
    setulangi(pesan)
    toggleModal()
  }

  const addkalender = () => {
    if (name == "" || category == "" || description == "") {
      setisipesan2("Data tidak boleh ada yang kosong")
      toggleModal3()
    } else if (type == "2") {
      updatekalender()
    } else {
      setspinner(true)
      fetch(global.url + '/event/post', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + global.key,
        },
        body: JSON.stringify({
          calendar_date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
          name: name,
          category: category,
          description: description,
          background_color: background_color,
          start_date: format(date, "yyyy-MM-dd HH:mm:ss"),
          end_date: format(date2, "yyyy-MM-dd HH:mm:ss"),
          kategori: "running_new"
        })
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json)
          console.log(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
          setspinner(false)
          if (!json.errors) {
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'Menu_bar' }],
            });
          } else {
            Alert.alert(json.message)
          }

        })
        .catch((error) => {
          console.error(error)
          setspinner(false)
        });
    }
  };
  const updatekalender = () => {
    setspinner(true)
    fetch(global.url + '/event/update', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + global.key,
      },
      body: JSON.stringify({
        event_id: eventid2,
        calendar_date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        name: name,
        category: category,
        description: description,
        background_color: background_color,
        start_date: format(date, "yyyy-MM-dd HH:mm:ss"),
        end_date: format(date2, "yyyy-MM-dd HH:mm:ss"),
        kategori:"update"
      })
    })
      .then((response) => response.json())
      .then((json) => {

        console.log(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
        setspinner(false)
        if (!json.errors) {
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'Menu_bar' }],
          });
        } else {
          Alert.alert(json.message)
        }
      })
      .catch((error) => {
        console.error(error)
        setspinner(false)
      });
  };
  const momendate = (date) => {
    return moment(date, 'YYYY-M-DD HH:mm:ss')
  }
  useState(() => {
    if (type == "2") {
      setname(name2)
      setcategory(category2)
      setdescription(description2)
      setbackground_color(background_color2)
      setDate(new Date(momendate(start_date2)))
      setDate2(new Date(momendate(end_date2)))
    }
  })
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [isModalVisible2, setModalVisible2] = useState(false);
  const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
  };
  const [isModalVisible4, setModalVisible4] = useState(false);
  const toggleModal4 = () => {
    setModalVisible4(!isModalVisible4);
  };
  const [spinner, setspinner] = React.useState(false)
  const [isipesan2, setisipesan2] = useState("")
  const toggleModal3 = () => {
    setModalVisible3(!isModalVisible3);
  };
  const [isModalVisible3, setModalVisible3] = useState(false);
  const [showerrorkah, setshowerrorkah] = useState(true)
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
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
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
      {show2 && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date2}
          mode={mode2}
          is24Hour={true}
          display="default"
          onChange={onChange2}

        />
      )}
      <Modal isVisible={isModalVisible4}
        onBackdropPress={toggleModal4}
        onBackButtonPress={toggleModal4}>
        <View style={style.content}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={[style.nunitosansemi, { fontSize: 15, color: "black", marginLeft: 10, textAlign: "center", marginBottom: 15 }]}>Pilih Kategori</Text>
            <View style={{ flexDirection: "row" }}>
              <Button title="GENERAL" onPress={() => {
                setcategory("GENERAL")
                setbackground_color("#48bf8e")
                toggleModal4()
              }} buttonStyle={{ backgroundColor: "#48bf8e", width: 100, height: 30,marginRight:5 }} titleStyle={{ color: "white" }}></Button>
              <Button title="PSDM-D" onPress={() => {
                setcategory("PSDM-D")
                setbackground_color("#bf5468")
                toggleModal4()
              }} buttonStyle={{ backgroundColor: "#bf5468", width: 100, height: 30 }} titleStyle={{ color: "white" }}></Button>
            </View>
            <View style={{ marginTop: 5 }}></View>
            <View style={{ flexDirection: "row" }}>
              <Button title="PSDM-L" onPress={() => {
                setcategory("PSDM-L")
                setbackground_color("#a2fa12")
                toggleModal4()
              }} buttonStyle={{ backgroundColor: "#a2fa12", width: 100, height: 30,marginRight:5 }} titleStyle={{ color: "white" }}></Button>
              <Button title="SOSMA" onPress={() => {
                setcategory("SOSMA")
                setbackground_color("#8265cd")
                toggleModal4()
              }} buttonStyle={{ backgroundColor: "#8265cd", width: 100, height: 30 }} titleStyle={{ color: "white" }}></Button>
            </View>
            <View style={{ marginTop: 5 }}></View>
            <View style={{ flexDirection: "row" }}>
              <Button title="KESMA" onPress={() => {
                setcategory("KESMA")
                setbackground_color("#dbe9a8")
                toggleModal4()
              }} buttonStyle={{ backgroundColor: "#dbe9a8", width: 100, height: 30,marginRight:5 }} titleStyle={{ color: "white" }}></Button>
              <Button title="HUBLU" onPress={() => {
                setcategory("HUBLU")
                setbackground_color("#f75ef0")
                toggleModal4()
              }} buttonStyle={{ backgroundColor: "#f75ef0", width: 100, height: 30 }} titleStyle={{ color: "white" }}></Button>
            </View>
            <View style={{ marginTop: 5 }}></View>
            <View style={{ flexDirection: "row" }}>
              <Button title="PROFKIL" onPress={() => {
                setcategory("PROFKIL")
                setbackground_color("#93a470")
                toggleModal4()
              }} buttonStyle={{ backgroundColor: "#93a470", width: 100, height: 30,marginRight:5 }} titleStyle={{ color: "white" }}></Button>
              <Button title="KOMINFO" onPress={() => {
                setcategory("KOMINFO")
                setbackground_color("#dfccfa")
                toggleModal4()
              }} buttonStyle={{ backgroundColor: "#dfccfa", width: 100, height: 30 }} titleStyle={{ color: "white" }}></Button>
            </View>
            <View style={{ marginTop: 5 }}></View>
            <View style={{ flexDirection: "row" }}>
              <Button title="KWU" onPress={() => {
                setcategory("KWU")
                setbackground_color("#3a718b")
                toggleModal4()
              }} buttonStyle={{ backgroundColor: "#3a718b", width: 100, height: 30,marginRight:5 }} titleStyle={{ color: "white" }}></Button>
              <Button title="LIMPUS" onPress={() => {
                setcategory("LIMPUS")
                setbackground_color("#e3ae8c")
                toggleModal4()
              }} buttonStyle={{ backgroundColor: "#e3ae8c", width: 100, height: 30 }} titleStyle={{ color: "white" }}></Button>
            </View>
            <View style={{ marginTop: 5 }}></View>
            <View style={{ flexDirection: "row" }}>
              <Button title="IE-FAIR" onPress={() => {
                setcategory("IE-FAIR")
                setbackground_color("#c53607")
                toggleModal4()
              }} buttonStyle={{ backgroundColor: "#c53607", width: 100, height: 30,marginRight:5 }} titleStyle={{ color: "white" }}></Button>
              <View style={{ backgroundColor: "white", width: 100, height: 30 }}></View>
            </View>
            <View style={{ marginTop: 5 }}></View>
          </View>

        </View>
      </Modal>
      <Modal isVisible={isModalVisible2}
        onBackdropPress={toggleModal2}
        onBackButtonPress={toggleModal2}>
        <View style={style.content}>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={[style.nunitosansemi, { fontSize: 15, color: "black", marginLeft: 10, textAlign: "center", marginBottom: 15 }]}>Pilih Warna Kategori</Text>
            <Button onPress={() => {
              setbackground_color("#8894B7")
              toggleModal2()
            }} buttonStyle={{ backgroundColor: "#8894B7", width: 100, height: 30 }}></Button>
            <View style={{ marginTop: 15 }}></View>
            <Button onPress={() => {
              setbackground_color("red")
              toggleModal2()
            }} buttonStyle={{ backgroundColor: "red", width: 100, height: 30 }}></Button>
            <View style={{ marginTop: 15 }}></View>
            <Button onPress={() => {
              setbackground_color("blue")
              toggleModal2()
            }} buttonStyle={{ backgroundColor: "blue", width: 100, height: 30 }}></Button>
            <View style={{ marginTop: 15 }}></View>
            <Button onPress={() => {
              setbackground_color("green")
              toggleModal2()
            }} buttonStyle={{ backgroundColor: "green", width: 100, height: 30 }}></Button>
            <View style={{ marginTop: 15 }}></View>
            <Button onPress={() => {
              setbackground_color("gold")
              toggleModal2()
            }} buttonStyle={{ backgroundColor: "gold", width: 100, height: 30 }}></Button>
            <View style={{ marginTop: 15 }}></View>
          </View>

        </View>
      </Modal>
      <Modal isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}>
        <View style={style.content}>

          <View>
            <TouchableOpacity onPress={() => modal2("Tidak berulang")}>
              <Text style={[style.nunitosansemi, { fontSize: 15, color: "black", marginLeft: 10, textAlign: "center" }]}>Tidak berulang</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => modal2("Setiap hari")} style={{ marginTop: 15 }}>
              <Text style={[style.nunitosansemi, { fontSize: 15, color: "black", marginLeft: 10, textAlign: "center" }]}>Setiap hari</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => modal2("Setiap minggu")} style={{ marginTop: 15 }}>
              <Text style={[style.nunitosansemi, { fontSize: 15, color: "black", marginLeft: 10, textAlign: "center" }]}>Setiap minggu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => modal2("Setiap bulan")} style={{ marginTop: 15 }}>
              <Text style={[style.nunitosansemi, { fontSize: 15, color: "black", marginLeft: 10, textAlign: "center" }]}>Setiap bulan</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => modal2("Setiap tahun")} style={{ marginTop: 15 }}>
              <Text style={[style.nunitosansemi, { fontSize: 15, color: "black", marginLeft: 10, textAlign: "center" }]}>Setiap tahun</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>

      <ImageBackground
        source={require("../assets/image/header.png")}
        style={{ height: 71, idth: "100%" }}
        resizeMode="stretch"
      >
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 30, marginRight: 30 }}>
          <Text style={[style.poppinsbold, { color: "white", fontSize: 20, textAlign: "center", flex: 1 }]}>Calendar</Text>
        </View>
      </ImageBackground>
      <View style={style.container}>
        <ScrollView>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Ionicons name={'close'} size={24} color="black" />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Button title="Simpan" onPress={addkalender} buttonStyle={[style.button, { height: 30, width: 100 }]} titleStyle={{ color: colors.black, fontFamily: "NunitoSans-SemiBold", fontSize: 14 }}></Button>
            </View>
          </View>

          <View style={{ marginTop: 15 }}>
            <TextInput value={name} placeholder={"Buat sebuah pengingat baru"} onChangeText={setname} style={[style.poppinsmedium, { flex: 1 }]}></TextInput>
            <View style={[style.line]}></View>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center",marginTop:15 }}>

              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={toggleModal4}>
                  <Text style={[style.nunitosansemi, { fontSize: 15, color: "black", marginLeft: 10 }]}>{category}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{ backgroundColor: background_color, height: 30, width: 30, marginRight: 10 }}>

              </TouchableOpacity>
            </View>
            <View style={[style.line]}></View>
            <TextInput value={description} placeholder={"Deskripsi"} onChangeText={setdescription} style={[style.nunitosans, { maxHeight: 100 }]} multiline={true}></TextInput>
          </View>
          <View style={style.line}></View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
            <Ionicons name={'time-outline'} size={22} color="black" />
            <Text style={[style.nunitosansemi, { fontSize: 15, color: "black", marginLeft: 5 }]}>Mulai</Text>

          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
            <TouchableOpacity style={{ marginLeft: 30 }} onPress={() => showDatepicker('date')}>
              <Text style={[style.nunitosansemi, { fontSize: 15, color: "black" }]}>{format(date, "iii', 'dd' 'MMM', 'yyyy'", { locale: id })}</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}></View>
            <TouchableOpacity style={{ marginLeft: 5, marginRight: 12, flex: 1, alignItems: "flex-end" }} onPress={() => showDatepicker('time')}>
              <Text style={[style.nunitosansemi, { fontSize: 15, color: "black", textAlign: "right", flex: 1 }]}>{format(date, "kk':'mm", { locale: id })}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
            <FontAwesomeIcon icon={faClock} size={18} color={"black"}></FontAwesomeIcon>
            <Text style={[style.nunitosansemi, { fontSize: 15, color: "black", marginLeft: 10 }]}>Sampai</Text>

          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>

            <View style={{ marginLeft: 30 }}>
              <Text style={[style.nunitosansemi, { fontSize: 15, color: "black" }]}>{format(date2, "iii', 'dd' 'MMM', 'yyyy'", { locale: id })}</Text>
            </View>

            <View style={{ flex: 1 }}></View>
            <TouchableOpacity style={{ marginLeft: 5, marginRight: 12, flex: 1, alignItems: "flex-end" }} onPress={() => showDatepicker2('time')}>
              <Text style={[style.nunitosansemi, { fontSize: 15, color: "black", textAlign: "right", flex: 1 }]}>{format(date2, "kk':'mm", { locale: id })}</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={style.line}></View>
          <TouchableOpacity style={{ marginTop: 15, marginLeft: 1 }} onPress={toggleModal}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesomeIcon icon={faUndo} size={16} color={"black"}></FontAwesomeIcon>
              <Text style={[style.nunitosansemi, { fontSize: 15, color: "black", marginLeft: 10 }]}>{ulangi}</Text>
            </View>
          </TouchableOpacity>
          <View style={style.line}></View>*/}
        </ScrollView>
      </View>


    </View>
  );
};
export default Tambahkalender


const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
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

