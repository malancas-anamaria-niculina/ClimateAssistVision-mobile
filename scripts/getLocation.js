import React, {useState, useEffect} from 'react';
import DeviceInfo from 'react-native-device-info';

import Geolocation from '@react-native-community/geolocation';

import { PermissionsAndroid } from 'react-native';

import { HOST_LOCATION, KEY_LOCATION } from "@env";

const getLocation = {
  getLocationName: async (lat, lon) => {
    fetch("https://timezone-by-location.p.rapidapi.com/timezone?lat=" + lat + "&lon=" + lon +"&c=1&s=0", {
    "method": "GET",
    "headers": {
		"x-rapidapi-host": HOST_LOCATION,
		"x-rapidapi-key": KEY_LOCATION
	  }})
    .then(response => {
      console.log(response);
      return response;
    })
    .catch(err => {
      console.error(err);
    });
  }
}

export default getLocation;
