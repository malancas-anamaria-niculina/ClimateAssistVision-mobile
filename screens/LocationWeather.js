import React, { useEffect, useState } from 'react';
import { TextInput, StyleSheet, View, Text, Image } from 'react-native';

import { 
  HOST_LOC, 
  KEY_LOC,
  HOST_WEATHER,
  KEY_WEATHER,
} from "@env";

const LocationWeather = () => {

  const [location, setLocation] = React.useState('');
  const [longitude,setlongitude] = useState('...');
  const [latitude,setlatitude] = useState('...');
  const [weatherStatus,setWeatherStatus] = useState('...');
  const [temp,setTemp] = useState('...');
  const [windSpeed,setWindSpeed] = useState('...');
  const [precipitation,setPrecipitaion] = useState('...');
  const [clouds,setClouds] = useState('...');
  const [sunrise,setSunrise] = useState('...');
  const [sunset,setSunset] = useState('...');
  const [uvIndex,setUVIndex] = useState('...');
  const [weatherImg,setWeatherImg] = useState('...');
  const [cityName,setCityName] = useState('...');
  

  const getLocationWeather = async () => {
    const URL = `https://aerisweather1.p.rapidapi.com/forecasts/${location}`;

    const response = await Promise.resolve(fetch(URL, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": HOST_LOC,
        "x-rapidapi-key": KEY_LOC
      }
    })
      .then(async (response) =>  response.json())
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

  const saveLocation = async () => {
    const data = await getLocationWeather();
    setTemp(data.response[0].periods[0].tempC);
    setWeatherStatus(data.response[0].periods[0].weather)
    setlongitude(data.response[0].loc.long);
    setlatitude(data.response[0].loc.lat);

    console.log(latitude);
    console.log(longitude);

    const weather = await getSearchedLocWeather(data.response[0].loc.lat, data.response[0].loc.long);
    console.log(weather);
    setWeatherStatus(weather.data[0].weather.description);
    setTemp(weather.data[0].temp);
    setWindSpeed(weather.data[0].wind_spd);
    setClouds(weather.data[0].clouds);
    setPrecipitaion(weather.data[0].precip);
    setSunrise(weather.data[0].sunrise);
    setSunset(weather.data[0].sunset);
    setUVIndex(weather.data[0].uv);
    setCityName(weather.data[0].city_name);
    setWeatherImg(`https://www.weatherbit.io/static/img/icons/${weather.data[0].weather.icon}.png`)
  };

  useEffect(() => {
    //setLocation(location);
  }, []);

  return (
    <View style={styles.appStyle}>
      
      <View style={styles.inputView}>
        <TextInput
          style={styles.txtInStyle}
          onChangeText={text => setLocation(text)}
          onSubmitEditing={() => saveLocation()}
          value={location}
          placeholder="City,Country"
        />
      </View>

      <View style={styles.topLocView}>
        
        <View style={styles.weatherView}>
          <Text style={styles.cityNameText}>{ cityName }</Text>
          <Text style={styles.tempText}>{ temp }°C</Text>
          <View style={styles.weathStat}>
            <Text style={styles.weathStatText}>{ weatherStatus }</Text>
          </View>
        </View>

        <Image
          style={styles.imgWeather}
          source={{ uri: weatherImg }}
        ></Image>
      </View>
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
  inputView: {
    paddingTop: 10,
  },
  txtInStyle: {
    borderColor: 'gray', 
    borderWidth: 1,
    borderRadius: 20,
    placeholderTextColor: 'gray',
    paddingLeft: 80,
    paddingRight: 80,
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
    alignContent:'center',
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
    paddingBottom: 10,
    color: '#161853',
    fontSize: 80,
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
  },
  bottomView: {
    justifyContent: 'center',
    flexDirection: 'row',
  }
});

export default LocationWeather;