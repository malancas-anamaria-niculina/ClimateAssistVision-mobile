import React from 'react';
import { TouchableOpacity, Button, View, StyleSheet, Text, TextInput } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logInTextStyle}>
        Climate Assist Vision
      </Text>

      <View style={styles.buttonStyle}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() =>
            navigation.navigate('Weather')
          }
        >
          <Text style={styles.loginText}>Weather from phone location</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonStyle}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() =>
            navigation.navigate('LocationWeather')
          }
        >
          <Text style={styles.loginText}>Weather from searched location</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonStyle}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() =>
            navigation.navigate('Favorites')
          }
        >
          <Text style={styles.loginText}>Favorites locations</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 10,
    flexDirection: "column",
  },
  credentialsStyle: {
    width: "100%",
    padding: 30,
    paddingBottom: 20,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  logInTextStyle: {
    fontSize: 30,
    color: '#161853',
    marginVertical: 16,
    padding: 30,
    paddingBottom: 150,
    alignSelf: "flex-start",
  },
  emailTextStyle: {
    fontSize: 20,
    color: 'black',
    padding: 5,
    alignSelf: "flex-start",
  },
  emailInput: {
    borderWidth: 0.5,
    borderColor: "#161853",
    borderRadius: 20,
    width: "100%"
  },
  loginButton: {
    backgroundColor: '#161853',
    padding: 10,
    paddingTop: 10,
    borderRadius: 20,

  },
  loginText: {
    textAlign: 'center',
    color: 'white',
  },
  loginView: {
    width: "100%",
    height: "100%",
    paddingTop: 50,
    alignSelf: "center",
  },
  buttonStyle: {
    paddingTop: 10,
    paddingBottom: 10
  }
});

export default HomeScreen;