import React, { useEffect, useState } from 'react';
import { TouchableHighlight, Button, TextInput, StyleSheet, View, Text, Image, FlatList } from 'react-native';

import { PermissionsAndroid } from 'react-native';

import DeviceInfo from 'react-native-device-info';

import {
  HOST_LOC,
  KEY_LOC,
  HOST_LOCATION,
  KEY_LOCATION,
  HOST_WEATHER,
  KEY_WEATHER,
  IP,
  LOCAL_PORT
} from "@env";

const LocationWeather = () => {

  const [location, setLocation] = React.useState('');

  const [coords, setCoords] = useState({
    deviceId: 0,
  });

  const [forecast, setForecast] = useState([]);

  const [weatherDetails, setWeatherDetails] = useState({
    weatherStatus: "",
    temp: 0,
    windSpeed: 0,
    precipitation: 0,
    clouds: 0,
    sunrise: "",
    sunset: "",
    uvIndex: 0,
    weatherImg: "",
    cityName: ""
  });


  const getLocationWeather = async () => {
    const URL = `https://aerisweather1.p.rapidapi.com/forecasts/${location}`;

    const response = await Promise.resolve(fetch(URL, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": HOST_LOC,
        "x-rapidapi-key": KEY_LOC
      }
    })
      .then(async (response) => response.json())
      .catch(err => {
        console.error(err);
      }));

    return response;
  };

  const getSearchedLocWeather = async (lat, lon) => {
    const URL = `https://weatherbit-v1-mashape.p.rapidapi.com/current?lon=${lon}&lat=${lat}`;

    const response = await Promise.resolve(fetch(URL, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": HOST_WEATHER,
        "x-rapidapi-key": KEY_WEATHER
      }
    })
      .then((response) => response.json())
      .catch(err => {
        console.error(err);
      }));

    return response;
  };

  const getCountry = async (lat, lon) => {
    const URL = `https://timezone-by-location.p.rapidapi.com/timezone?lat=${lat}&lon=${lon}&c=1&s=0`;

    const response = await Promise.resolve(fetch(URL, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": HOST_LOCATION,
        "x-rapidapi-key": KEY_LOCATION
      }
    })
      .then((response) => response.json())
      .catch(err => {
        console.error(err);
      }));

    return response;
  };

  const getdeviceId = () => {
    var uniqueId = DeviceInfo.getUniqueId();
    setCoords({
      ...coords,
      deviceId: uniqueId
    });
  };

  const requestDeviceCoords = async () => {
    if (Platform.OS === 'ios') {
      getdeviceId();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        const idGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          {
            title: 'State Access Required',
            message: 'This App needs to Access your state',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED && idGranted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          getdeviceId();
        } else {
          setCoords({
            ...coords,
            locationStatus: 'Permission Denied',
          });
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    requestDeviceCoords();
  }, []);

  const saveLocation = async () => {
    const data = await getLocationWeather();

    setForecast(data.response[0].periods);

    const location = await getCountry(data.response[0].loc.lat, data.response[0].loc.long);

    console.log(data.response[0].loc.lat);
    console.log(data.response[0].loc.long);

    const weather = await getSearchedLocWeather(data.response[0].loc.lat, data.response[0].loc.long);

    setWeatherDetails({
      ...weatherDetails,
      weatherStatus: weather.data[0].weather.description,
      temp: weather.data[0].temp,
      windSpeed: weather.data[0].wind_spd,
      clouds: weather.data[0].clouds,
      precipitation: weather.data[0].precip,
      sunrise: weather.data[0].sunrise,
      sunset: weather.data[0].sunset,
      uvIndex: weather.data[0].uv,
      cityName: weather.data[0].city_name + ", " + location.Zones[0].CountryName,
      weatherImg: `https://www.weatherbit.io/static/img/icons/${weather.data[0].weather.icon}.png`
    });
  };

  const addToFavorites = async () => {
    if (!!weatherDetails.weatherStatus) {
      requestDeviceCoords();

      const details = JSON.stringify(weatherDetails);

      fetch(`http://${IP}:${LOCAL_PORT}/favorites/`, {
        method: 'POST',
        body: JSON.stringify({
          terminalId: coords.deviceId,
          temperature: weatherDetails.temp,
          city: weatherDetails.cityName,
          windSpeed: weatherDetails.windSpeed,
          precipitation: weatherDetails.precipitation,
          clouds: weatherDetails.clouds,
          imageUrl: weatherDetails.weatherImg
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
          'token': 'token'
        })
      }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
    }
  };

  const getDay = (validTime) => {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let date = new Date(validTime);
    return days[date.getDay()];
  };

  let renderItemComponent = (item) =>
    <View style={styles.bottomStatsView}>
      <Text style={styles.bottomTextL}>{getDay(item.validTime)}</Text>
      <View style={styles.forecastImg}>
        <Image
          style={styles.statsImg}
          source={{ uri: `https://www.aerisweather.com/img/wxicons/${item.icon}` }}
        />
      </View>
      <Text style={styles.bottomTextR}>{item.maxTempC}°   </Text>
      <Text style={styles.degreeTextL}>{item.minTempC}°</Text>
    </View>

  return (
    <View style={styles.appStyle}>

      <View style={styles.firstView}>

        <View style={styles.inputView}>
          <TextInput
            style={styles.txtInStyle}
            onChangeText={text => setLocation(text)}
            onSubmitEditing={() => saveLocation()}
            value={location}
            placeholder="City,Country"
          />
        </View>

        <View style={styles.buttonView}>
          <TouchableHighlight
            style={styles.submit}
            onPress={() => addToFavorites()}
            underlayColor='#fff'>
            <Text style={styles.favIn}>Favorites</Text>
          </TouchableHighlight>
        </View>

      </View>

      {!!weatherDetails.weatherStatus && <View style={styles.parentView}>
        <View style={styles.topLocView}>

          <View style={styles.weatherView}>
            <Text style={styles.cityNameText}>{weatherDetails.cityName}</Text>
            <Text style={styles.tempText}>{weatherDetails.temp}°C</Text>
            <View style={styles.weathStat}>
              <Text style={styles.weathStatText}>{weatherDetails.weatherStatus}</Text>
            </View>
          </View>

          <Image
            style={styles.imgWeather}
            source={{ uri: weatherDetails.weatherImg }}
          ></Image>
        </View>
        <View style={styles.statsView}>
          <Image
            style={styles.statsImg}
            source={require("../images/wind_speed.png")}
          />
          <Text style={styles.statsText}>{weatherDetails.windSpeed} km/h</Text>
          <Image
            style={styles.statsImg}
            source={require("../images/clouds.png")}
          />
          <Text style={styles.statsText}>{weatherDetails.clouds}%</Text>
          <Image
            style={styles.statsImg}
            source={require("../images/precipitation.png")}
          />
          <Text style={styles.statsText}>{weatherDetails.precipitation}%</Text>
        </View>

        <View>
          {!!forecast.length && <FlatList
            data={forecast}
            contentContainerStyle={{ flexGrow: 1 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderItemComponent(item)}
          />}
        </View>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  appStyle: {
    backgroundColor: '#F8F8F8',
    flexDirection: "column",
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: 20
  },
  parentView: {
    alignItems: 'center',
  },
  firstView: {
    flexDirection: 'row',
    width: '100%'
  },
  submit: {
    backgroundColor: '#ffe3a6',
    textAlign: 'center',
    borderRadius: 50,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center'
  },
  favIn: {
    backgroundColor: '#ffe3a6',
    textAlign: 'center',
    borderRadius: 50,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 7,
    paddingBottom: 7,
    justifyContent: 'center',
    color: '#161853',
  },
  buttonView: {
    paddingTop: 20,
    paddingLeft: 10
  },
  inputView: {
    paddingTop: 10,
    paddingLeft: 10,
    alignItems: 'center'
  },
  txtInStyle: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    placeholderTextColor: 'gray',
    paddingLeft: 60,
    paddingRight: 60,
  },
  cityNameText: {
    color: '#161853',
    fontSize: 20,
  },
  topLocView: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  weatherView: {
    alignContent: 'center',
    paddingLeft: 40,
  },
  locationImg: {
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 15,
    width: '1%',
    height: '1%',
  },
  locTextUp: {
    paddingRight: 10,
    paddingStart: 11,
    fontSize: 12,
  },
  text: {
    alignContent: 'center',
    color: '#161853',
    paddingTop: 8,
    paddingBottom: 25,
    fontSize: 16,
  },
  imgWeather: {
    paddingTop: 150,
    paddingRight: 190,
    flex: 0.2,
    width: '50%',
  },
  weatherText: {
    color: '#161853',
    fontSize: 30,
  },
  weathStat: {
    backgroundColor: '#EAEAEA',
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  weathStatText: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  tempText: {
    paddingTop: 10,
    paddingBottom: 10,
    color: '#161853',
    fontSize: 80,
  },
  statsView: {
    flexDirection: 'row',
    paddingBottom: 30,
  },
  statsImg: {
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 15,
    width: '1%',
    height: '1%',
  },
  statsText: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  bottomStatsView: {
    paddingTop: 5,
    paddingBottom: 10,
    flexDirection: "row",
    alignContent: 'space-between',
    justifyContent: 'space-between'
  },
  bottomTextL: {
    paddingRight: 10,
    color: '#161853',
    fontSize: 15,
  },
  degreeTextL: {
    paddingRight: 10,
    fontSize: 15,
  },
  bottomTextR: {
    color: '#161853',
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 15,
  },
  extraBottomView: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  searchLocButton: {
    backgroundColor: '#161853',
  },
  bottomView: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  forecastImg: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 40,
    paddingRight: 40,
  }
});

export default LocationWeather;