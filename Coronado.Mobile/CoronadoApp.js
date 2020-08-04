import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { AsyncStorage } from 'react-native';
import { CORONADO_API } from 'react-native-dotenv';

export default function CoronadoApp() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const dispatch = useDispatch();

  const loginAction = (email, password) => {
    return async (dispatch) => {
      console.log("logging in");
      loginApi(email, password)
        .then(async (json) => {
          await AsyncStorage.setItem(
            "CoronadoAuthKey",
            json.token
          );
          console.log(json);
        }
        );
    };
  }

  const loginApi = async (email, password) => {
    const url = CORONADO_API + "/Auth/login";
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ Email: email, Password: password }),
    })
      .then(res => res.json())
      .catch(err => console.error(err));
  }
  const doLogin = () => {
    dispatch(loginAction(email, password));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Coronado</Text>
      <View style={styles.inputView} >
        <TextInput
          style={styles.inputText}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email..."
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          onChangeText={text => setEmail(text)} />
      </View>
      <View style={styles.inputView} >
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Password..."
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          onChangeText={text => setPassword(text)} />
      </View>
      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText} onPress={doLogin}>LOGIN</Text>
      </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4682b4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fff",
    marginBottom: 40
  },
  inputView: {
    width: "80%",
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "white"
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  loginText: {
    color: "white"
  },
  inputIcon: {
    position: 'absolute',
    top: 10,
    left: 37,

  }
});
