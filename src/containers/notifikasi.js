import React, { useCallback, useState } from 'react';
import { View, Dimensions, ScrollView,ImageBackground, RefreshControl } from 'react-native';
import {  Text} from 'react-native-elements';

import style from '../globalstyles';

import { format,  isToday, isTomorrow, isYesterday } from 'date-fns';
import { id } from 'date-fns/locale';


function Notifikasi(props) {

    const [list, setlist] = useState([{ contains: [{}] }])
    const globallimit = 50;
    const feed = (limit, offset) => {
        fetch(global.url + "/event/index?limit=" + limit + "&offset=" + offset, {
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
                if (list.length >= json.length) {
                    setscrollable(false)
                } else {
                    setscrollable(true)
                }
                setlist(json)
                setRefreshing(false)
            })
            .catch((error) => console.error(error));
    };
    const waktu = (date) => {
        var hasil = format(new Date(date), "iii', 'dd' 'MMM', 'yyyy'", { locale: id })
        if (isToday(new Date(date))) {
            hasil = "Hari ini"
        }
        else if (isTomorrow(new Date(date))) {
            hasil = "Besok"
        }
        else if (isYesterday(new Date(date))) {
            hasil = "Kemarin"
        }
        return hasil
    }
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        feed(globallimit, 0)
    }, []);
    const [limit, setlimit] = useState(globallimit)
    const [scrollable, setscrollable] = useState(true)
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {

        const paddingToBottom = 3;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    useState(() => {
        setlimit(globallimit)
        feed(globallimit, 0)
    })
    return (
        <View style={style.main}>

            <ImageBackground
                source={require("../assets/image/header.png")}
                style={{ height: 71, width: "100%" }}
                resizeMode="stretch"
            >
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginLeft: 30, marginRight: 30 }}>
                    <Text style={[style.poppinsbold, { color: "white", fontSize: 20, textAlign: "center", flex: 1 }]}>Activities</Text>
                </View>
            </ImageBackground>
            <ScrollView
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent) && scrollable) {
                        console.log("asdasd")
                        setlimit(limit + globallimit)
                        console.log(limit)
                        feed(limit + globallimit, 0)
                    }
                }
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                {list.map(item => item.updated_at ? (
                    <View>
                        <View style={{ backgroundColor: "#ce9cbe", padding: 3, marginTop: 15 }}>
                            <Text style={[style.nunitosans, { fontSize: 12, color: "white", marginLeft: 20 }]}>{waktu(item.updated_at)}</Text>
                        </View>
                        {item.contains.map(isi => isi.name ? (
                            <View style={{ padding: 10, marginLeft: 15 }}>
                                {isi.kategori == "running_new" ?(<Text style={[style.nunitosans, { fontSize: 12 }]}>Event dibuat</Text>):(null)}
                                {isi.kategori == "update" ?(<Text style={[style.nunitosans, { fontSize: 12,color:"gold" }]}>Event diupdate</Text>):(null)}
                                {isi.kategori == "canceled" ?(<Text style={[style.nunitosans, { fontSize: 12,color:"red" }]}>Event dibatalkan</Text>):(null)}
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <View style={{ backgroundColor: isi.background_color, height: 20, width: 20, borderRadius: 5 }}>
                                    </View>
                                    <Text style={[style.nunitosans, { color: "gray", marginLeft: 7 }]}>{isi.category}</Text>
                                </View>
                                <Text style={[style.poppinsbold, { fontSize: 16, marginTop: 5 }]}>{isi.name}</Text>
                                <Text style={[style.nunitosans, { fontSize: 12 }]}>{isi.description}</Text>
                            </View>) : (null))}

                    </View>) : (null))}


            </ScrollView>

        </View>
    );
};

export default Notifikasi;
