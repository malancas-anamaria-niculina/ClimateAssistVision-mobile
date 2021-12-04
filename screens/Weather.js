import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import { PermissionsAndroid } from 'react-native';

import DeviceInfo from 'react-native-device-info';
import Geolocation from '@react-native-community/geolocation';

import { 
  HOST_LOCATION, 
  KEY_LOCATION,
  HOST_WEATHER,
  KEY_WEATHER,
} from "@env";

const Weather = () => {

  const [deviceId, setDeviceId] =
    useState('...');
  const [
    currentLongitude,
    setCurrentLongitude
  ] = useState('...');
  const [
    currentLatitude,
    setCurrentLatitude
  ] = useState('...');
  const [
    locationStatus,
    setLocationStatus
  ] = useState('...');
  const [
    deviceLocation,
    setDeviceLocation
  ] = useState('...');
  const [
    weatherStatus,
    setWeatherStatus
  ] = useState('...');
  const [
    temp,
    setTemp
  ] = useState('...');
  const [
    windSpeed,
    setWindSpeed
  ] = useState('...');
  const [
    precipitation,
    setPrecipitaion
  ] = useState('...');
  const [
    clouds,
    setClouds
  ] = useState('...');
  const [
    sunrise,
    setSunrise
  ] = useState('...');
  const [
    sunset,
    setSunset
  ] = useState('...');
  const [
    uvIndex,
    setUVIndex
  ] = useState('...');

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getdeviceId();
        getOneTimeLocation();
        subscribeLocationLocation();
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
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getLocationName = async (lat, lon) => {
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

  const getLocationWeather = async (lat, lon) => {
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

  const getOneTimeLocation = async () => {
    getdeviceId();
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      async (position) => {
        setLocationStatus('Device details');

        //getting the Longitude from the location json
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude =
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);

        const data = await getLocationName(position.coords.latitude, position.coords.longitude);
        const weather = await getLocationWeather(position.coords.latitude, position.coords.longitude);
        const loc = weather.data[0].city_name + ", " + data.Zones[0].CountryName;
        setDeviceLocation(loc);
        setWeatherStatus(weather.data[0].weather.description);
        setTemp(weather.data[0].temp);
        setWindSpeed(weather.data[0].wind_spd);
        setClouds(weather.data[0].clouds);
        setPrecipitaion(weather.data[0].precip);
        setSunrise(weather.data[0].sunrise);
        setSunset(weather.data[0].sunset);
        setUVIndex(weather.data[0].uv);
        //setWeatherImg(weather.data[0].weather.icon);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  const subscribeLocationLocation = () => {
    getdeviceId();
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change

        setLocationStatus('Device details');
        // console.log(position);

        //getting the Longitude from the location json        1
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude =
          JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);

      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  };

  const getdeviceId = () => {
    var uniqueId = DeviceInfo.getUniqueId();
    setDeviceId(uniqueId);
  };

  return (
    <View style={styles.appStyle}>
      <View style={styles.topLocView}>
        <Image
          style={styles.locationImg}
          source={require('../images/location-cursor.png')}
        />
        <Text style={styles.locTextUp}>Your Location Now</Text>
      </View>
      <Text style={styles.text}>{ deviceLocation }</Text>
        <Image
          style={styles.imgWeather}
          source={require('../images/t01d.png')}
        ></Image>
      
      <View style={styles.weathStat}>
        <Text style={styles.weathStatText}>{ weatherStatus }</Text>
      </View>
      
      <Text style={styles.tempText}>{ temp } °C</Text>
      <View style={styles.statsView}>
        <Image
          style={styles.statsImg}
          source={require("../images/wind_speed.png")}
        />
        <Text style={styles.statsText}>{ windSpeed } km/h</Text>
        <Image
        style={styles.statsImg}
          source={require("../images/clouds.png")}
        />
        <Text style={styles.statsText}>{ clouds }%</Text>
        <Image
        style={styles.statsImg}
          source={require("../images/precipitation.png")}
        />
        <Text style={styles.statsText}>{ precipitation }%</Text>
      </View>
      <View style={styles.extraBottomView}>
      <View style={styles.bottomStatsView}>
          <Text style={styles.bottomTextL}>UV Index</Text>
          <Text style={styles.bottomTextR}>{ uvIndex }</Text>
        </View>
        <View style={styles.bottomStatsView}>
          <Text style={styles.bottomTextL}>Sunrise</Text>
          <Text style={styles.bottomTextR}>{ sunrise }</Text>
        </View>
        <View style={styles.bottomStatsView}>
          <Text style={styles.bottomTextL}>Sunset</Text>
          <Text style={styles.bottomTextR}>{ sunset }</Text>
        </View>
      </View>
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
  },
  topLocView: {
    flex: 0.06,
    flexDirection: 'row',
    width: '100%',
    height: '50%',
    paddingTop: 20,
    justifyContent: 'center',
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
    color: '#161853',
    paddingTop: 8,
    paddingBottom: 25,
    fontSize: 16,
  },
  imgWeather: {
    paddingTop: 130,
    flex: 0.1,
    width: '50%',
    height: '50%',
  },
  weatherText: {
    color: '#161853',
    fontSize: 30,
  },
  weathStat:{
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
    paddingBottom: 20,
    color: '#161853',
    fontSize: 60,
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
  statsText: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  bottomStatsView: {
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row",
    alignContent: 'space-between',
    justifyContent: 'space-between'
  },
  bottomTextL: {
    paddingLeft: 10,
    paddingRight: 100,
    color: '#161853',
    fontSize: 15,
  },
  bottomTextR: {
    paddingLeft: 100,
    paddingRight: 10,
    fontSize: 15,
  },
  extraBottomView: {
    paddingTop: 20,
    paddingBottom: 20,
  }
});

export default Weather;