import React from 'react';

import { View, StyleSheet, Text, Image, SafeAreaView, FlatList, ScrollView, Pressable } from 'react-native';

const data2 = [{id: 1, title: "title1"},
        {id:2, title: "title2"},
        {id:3, title: "title2"},
        {id:4, title: "title2"},
        {id:5, title: "title2"},
        {id:6, title: "title2"}];

const Favorites = () => {
    const [data, setData] = React.useState(2);
    
    

    renderItemComponent = (item) => 
            <ScrollView style={styles.weatherBox}>
                <View style={styles.alignStyle}>
                <View style={styles.upView}>
                    <View style={styles.textStyle}>
                        <Text style={styles.degreeText}>20°C</Text>
                        <Text style={styles.text}>Austin{item.title}</Text>
                        <Text style={styles.text}>{item.title}</Text>
                    </View>
                    <Image
                        style={styles.imgStyle}
                        source={require("../images/wind_speed.png")}
                    />
                </View>
                <View style={styles.statsView}>
                    <Image
                        style={styles.statsImg}
                        source={require("../images/wind_speed.png")}
                    />
                    <Text style={styles.statsText}> km/h</Text>
                    <Image
                        style={styles.statsImg}
                        source={require("../images/clouds.png")}
                    />
                    <Text style={styles.statsText}> %</Text>
                    <Image
                        style={styles.statsImg}
                        source={require("../images/precipitation.png")}
                    />
                    <Text style={styles.statsText}> %</Text>
                </View>
                </View>
                
            </ScrollView>

    return (
        <View style={styles.appView}>
            <FlatList style={styles.compView}
                data={data2}

                contentContainerStyle={{ flexGrow: 1 }}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => renderItemComponent(item)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    appView: {
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
    },
    alignStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        alignContent: 'center'
    },
    compView: {
        paddingTop: 10,
        paddingBottom: 10,
        width: '90%'
    },
    weatherBox: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 10,
        paddingLeft: 10,
        borderColor: 'gray', 
        borderRadius: 20,
        width: '100%',
        borderBottomWidth:1,
        borderTopWidth:1,
    },
    upView: {
        flexDirection: 'row',
        width: '100%',
        paddingBottom: 10
    },
    textStyle: {
        paddingRight: 60,
        paddingLeft: 40,
        color: '#161853',

    },
    text: {
        color: '#161853',
    },
    degreeText: {
        fontSize: 35
    },
    imgStyle: {
        padding: 5,
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop:100,
        width: '30%',
        height: '30%',
    },
    statsView: {
        flexDirection: 'row',
    },
    statsImg: {
        padding: 5,
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 15,
        width: '1%',
        height: '1%',
    },
});

export default Favorites;