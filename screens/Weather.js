import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';

import { PermissionsAndroid } from 'react-native';

import DeviceInfo from 'react-native-device-info';
import Geolocation from '@react-native-community/geolocation';

import {
  HOST_LOCATION,
  KEY_LOCATION,
  HOST_WEATHER,
  KEY_WEATHER,
} from "@env";

const Weather = ({ navigation }) => {

  const [coords, setCoords] = useState({
    deviceId: 0,
    currentLongitude: 0,
    currentLongitude: 0,
    locationStatus: ""
  });
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
    deviceLocation: ""
  });

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
    setCoords({
      ...coords,
      locationStatus: 'Getting Location ...',
    });
    Geolocation.getCurrentPosition(
      //Will give you the current location
      async (position) => {
        setCoords({
          ...coords,
          locationStatus: 'Device details',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

        const data = await getLocationName(position.coords.latitude, position.coords.longitude);
        const weather = await getLocationWeather(position.coords.latitude, position.coords.longitude);
        const loc = weather.data[0].city_name + ", " + data.Zones[0].CountryName;

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
          cityName: weather.data[0].city_name,
          weatherImg: `https://www.weatherbit.io/static/img/icons/${weather.data[0].weather.icon}.png`,
          deviceLocation: loc
        });
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
        setCoords({
          ...coords,
          locationStatus: 'Device details',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });

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
    setCoords({
      ...coords,
      deviceId: uniqueId
    });
  };

  return (
    <View style={styles.appStyle}>
      {!!!coords.locationStatus && <Image style={styles.gifImage}
        source={require('../images/loading.jpg')}
        style={{ width: 100, height: 100 }}
      />
      }
      {!!weatherDetails.weatherStatus && <View style={styles.appStyle}>
        <View style={styles.topLocView}>
          <Image
            style={styles.locationImg}
            source={require('../images/location-cursor.png')}
          />
          <Text style={styles.locTextUp}>Your Location Now</Text>
        </View>
        <Text style={styles.text}>{weatherDetails.deviceLocation}</Text>
        <Image
          style={styles.imgWeather}
          source={{ uri: weatherDetails.weatherImg }}
        ></Image>

        <View style={styles.weathStat}>
          <Text style={styles.weathStatText}>{weatherDetails.weatherStatus}</Text>
        </View>

        <Text style={styles.tempText}>{weatherDetails.temp} °C</Text>
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
        <View style={styles.extraBottomView}>
          <View style={styles.bottomStatsView}>
            <Text style={styles.bottomTextL}>UV Index</Text>
            <Text style={styles.bottomTextR}>{weatherDetails.uvIndex}</Text>
          </View>
          <View style={styles.bottomStatsView}>
            <Text style={styles.bottomTextL}>Sunrise</Text>
            <Text style={styles.bottomTextR}>{weatherDetails.sunrise}</Text>
          </View>
          <View style={styles.bottomStatsView}>
            <Text style={styles.bottomTextL}>Sunset</Text>
            <Text style={styles.bottomTextR}>{weatherDetails.sunset}</Text>
          </View>
          <View style={styles.bottomView}>
            <TouchableOpacity
              style={styles.searchLocButton}
              onPress={() =>
                navigation.navigate('LocationWeather')
              }
            >
              <Text style={styles.searchLocText}>Search Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.searchLocButton}
              onPress={() =>
                navigation.navigate('Favorites')
              }
            >
              <Text style={styles.searchLocText}>Favorite Locations</Text>
            </TouchableOpacity>
          </View>
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
  },
  gifImage: {
    width: '90%'
  },
  topLocView: {
    flex: 0.1,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    paddingBottom: 5,
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
  },
  searchLocButton: {
    backgroundColor: '#161853',
    borderRadius: 20,
  },
  searchLocText: {
    color: "white",
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
  },
  bottomView: {
    paddingTop: 40,
    alignContent: 'space-between',
    justifyContent: 'space-between',
    flexDirection: 'row',
  }
});

export default Weather;