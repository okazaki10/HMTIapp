import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native';
import { Text, Button } from 'react-native-elements';

import style from '../globalstyles';

import {  TouchableOpacity } from 'react-native-gesture-handler';
import { Agenda } from 'react-native-calendars';
import { format, isToday, isTomorrow, isYesterday} from 'date-fns';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { id } from 'date-fns/locale';

import Modal from 'react-native-modal';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
function Kalender(props) {

  const [items, setitems] = useState({})
  const [markeddates, setmarkeddates] = useState({

  })
const momendate = (date) =>{
  return moment(date, 'YYYY-M-DD HH:mm:ss')
}

const eventdelete = () => {
  setspinner(true)
  fetch(global.url + "/event/delete", {
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + global.key,
      },
      body: JSON.stringify({
          event_id: eventid2,
          kategori:"canceled"
      })
  })
      .then((response) => response.json())
      .then((json) => {
          console.log(json)
          setspinner(false)
          toggleModal2()
          getdates()
          var tanggal = new Date()
          getcalendar(tanggal.getMonth() + 1, tanggal.getFullYear())
      })
      .catch((error) => {
          console.error(error)
          setspinner(false)
      });
};
const waktu = (date) => {
  var hasil = format(new Date(date), "iiii", { locale: id })+" jam"
  if (isToday(new Date(date))) {
      hasil = "Hari ini jam"
  }
  else if (isTomorrow(new Date(date))) {
      hasil = "Besok jam"
  }
  else if (isYesterday(new Date(date))){
      hasil = "Kemarin jam"
  }
  return hasil
}
  const renderItem = (item) => {
    return (
      <TouchableOpacity
        testID={"item"}
        style={[styles.item, {  justifyContent: "center", backgroundColor: item.background_color }]}
        onLongPress={() => {
          if (status == 1) {
              setisipesan("Pilih tindakan mengubah event")
              setmodal(item.id,item.name,item.category,item.description,item.background_color,item.start_date,item.end_date)
          }
      }}
      > 
      {item.kategori == "update"?(<Text style={[style.nunitosansemi, { fontSize: 12, color: "white" }]}>Update!</Text>):(null)}
        <Text style={[style.poppinsmedium, { color: "white" }]}>{item.name} </Text>
        <Text style={[style.nunitosansemi, { fontSize: 15, color: "white" }]}>{item.description}</Text>
        <Text style={[style.nunitosansemi, { fontSize: 12, color: "white" }]}>{item.category}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name={'time-outline'} size={15} color="white" />
          <View style={{ marginLeft: 5 }}>
            <Text style={[style.nunitosansemi, { fontSize: 15, color: "white" }]}>
              {waktu(momendate(item.start_date))}
      
            </Text>
          </View>
          <View style={{ marginLeft: 5 }}>
            <Text style={[style.nunitosansemi, { fontSize: 15, color: "white" }]}>
              {format(new Date(momendate(item.start_date)), "kk':'mm", { locale: id })}
      
            </Text>
          </View>
          <Text style={{ marginLeft: 5, color: "white" }}>-</Text>
          <View style={{ marginLeft: 5, alignItems: "flex-end" }}>
            <Text style={[style.nunitosansemi, { fontSize: 15, color: "white", }]}>
              {format(new Date(momendate(item.end_date)), "kk':'mm", { locale: id })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const renderEmptyDate = () => {
    return (
      <View
        testID={"item"}
        style={{
          flex: 1,
          borderRadius: 5,
          padding: 10,
          marginRight: 10,
          marginTop: 17, height: 80, justifyContent: "center", backgroundColor: null
        }}
      >
        <Text style={[style.nunitosansemi]}>Tidak ada event untuk ditampilkan</Text>
      </View>
    );
  }

  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  }


  const getcalendar = (month, year) => {
    //setspinner(true)
    fetch(global.url + '/calendar/index?month=' + month + '&year=' + year, {
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
        setitems(json)
        setRefreshing(false)
        //setspinner(false)

      })
      .catch((error) => {
        console.error(error)
        //setspinner(false)
      });

  };
  const getdates = () => {
    fetch(global.url + "/event/markeddates", {
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
        setmarkeddates(json)
      })
      .catch((error) => console.error(error));
  };
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [isipesan, setisipesan] = useState("")
  const [eventid2,seteventid2] = useState("")
  const [name2,setname2] = useState("")
  const [category2,setcategory2] = useState("")
  const [description2,setdescription2] = useState("")
  const [background_color2,setbackground_color2] = useState("")
  const [start_date2,setstart_date2] = useState("")
  const [end_date2,setend_date2] = useState("")
  const [type,settype] = useState("")
  const setmodal = (itemid, itemname, itemcategory,itemdescription,itembackgroundcolor,itemstartdate,itemenddate) => {
    toggleModal2()
    seteventid2(itemid)
    settype("2")
    setname2(itemname)
    setcategory2(itemcategory)
    setbackground_color2(itembackgroundcolor)
    setstart_date2(itemstartdate)
    setend_date2(itemenddate)
    setdescription2(itemdescription)
};
const toggleModal2 = () => {
    setModalVisible2(!isModalVisible2);
};
const [currentmonth,setcurrentmonth] = useState(new Date())
  useState(() => {
    getdates()
    var tanggal = new Date()
    getcalendar(tanggal.getMonth() + 1, tanggal.getFullYear())
  })
  const [spinner, setspinner] = React.useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getdates()
    var tanggal = new Date()
    getcalendar(tanggal.getMonth() + 1, tanggal.getFullYear())
  }, []);
  return (
    <View style={[style.main]}>
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
                            <Button onPress={eventdelete} title="Hapus" titleStyle={[style.nunitosans, { textAlign: "center", color: "red" }]} buttonStyle={{ backgroundColor: "white" }}></Button>
                        </View>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Button onPress={() => {
                                props.navigation.navigate("Tambahkalender", { eventid2: eventid2, type: type,
                                  name2: name2, category2: category2,background_color2:background_color2,start_date2:start_date2,end_date2:end_date2,description2:description2 })
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
       
      <Text style={[style.poppinsbold, { textAlign: "center",fontSize:21 }]}>{format(currentmonth, "MMMM' 'yyy", { locale: id })}</Text>
        <Agenda
          testID={"agenda"}
          markedDates={markeddates}
          items={items}
          selected={format(new Date, "yyyy-MM-dd")}
          minDate={'2020-11-04'}
          maxDate={'2021-11-04'}                 
          renderItem={renderItem}
          renderEmptyDate={renderEmptyDate}
          rowHasChanged={rowHasChanged}

          onCalendarToggled={(calendarOpened) => { console.log(calendarOpened) }}
          markingType={'simple'}

          onDayChange={(day) => {
            // console.log(day.dateString)
            //var a = day.dateString
            //setmarkeddates({ ...markeddates , '2020-10-13': { selected: true, selectedColor: 'black'}})
            //console.log(day.dateString)
            //getcalendar(day.dateString)
          }}

          onDayPress={(day) => {
            // console.log(day.dateString)
            //var a = day.dateString
            //setmarkeddates({ ...markeddates , '2020-10-13': { selected: true, selectedColor: 'black'}})
            var tanggal = new Date(day.dateString)
            console.log(tanggal.getFullYear())
            getcalendar(tanggal.getMonth() + 1, tanggal.getFullYear())
            setcurrentmonth(tanggal)
          }}

          theme={{
            /*selectedDayBackgroundColor: "lightblue",
            selectedDayTextColor: 'lightblue',*/
            backgroundColor: "white"
          }}
onRefresh={onRefresh}
        />
      </View>

      {global.status == 1 ? (<View style={{ position: "absolute", bottom: 10, right: 0, paddingRight: 20 }}>
        <TouchableOpacity onPress={() => { props.navigation.navigate("Tambahkalender") }}>
          <Image
            source={require("../assets/image/tambah.png")}
            style={{ width: 75, height: 75, borderRadius: 200 }}
            resizeMode="contain"
          ></Image>
        </TouchableOpacity>
      </View>) : (null)}
    </View>
  );
};
export default Kalender;

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
  }
});

