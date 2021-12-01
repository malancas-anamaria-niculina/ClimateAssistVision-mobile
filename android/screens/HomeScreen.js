import React from 'react';
import { TouchableOpacity, Button, View, StyleSheet, Text, TextInput } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return(
        <View style={styles.container}>
            <Text style={styles.logInTextStyle}>
                Log in
                </Text>
            <View style={styles.credentialsStyle}>
              <Text style={styles.emailTextStyle}>
                  Email
                  </Text>
              <TextInput style={styles.emailInput}
                placeholder="Enter email"></TextInput>
            </View>

            <View style={styles.credentialsStyle}>
              <Text style={styles.emailTextStyle}>
                  Password
                  </Text>
              <TextInput style={styles.emailInput}
                placeholder="Enter password"></TextInput>
            </View>

            <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
                navigation.navigate('Weather')
            }
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      padding: 10,
      flexDirection: "column",
    },
    credentialsStyle: {
      width: "100%",
      padding: 30,
      paddingBottom: 10,
      paddingVertical: 5,
      alignSelf: "flex-start",
    },
    logInTextStyle: {
      fontSize: 30,
      color: '#161853',
      marginVertical: 16,
      padding: 30,
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
      paddingTop: 20,
      borderRadius: 20,
      
    },
    loginText: {
      textAlign:'center',
      color: 'white',
    }
});

export default HomeScreen;