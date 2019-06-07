import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert, Button } from 'react-native'

// Utilizzo di Realm, per la persistenza dei dati
import {getUser} from '../store/models/User'
import realm from '../store/models/User'

// Array che contiene i nomi degli utenti
var utenti = ["Azuel", "Renato", "Gianluca"];

class Login extends React.Component {

    // State is data that is going to change, in general, you should initialize,
    // state in the constructor, and then call setState when you want to change it.
    state = {
       email: '',
       password: ''
    }

    // Recupero dall'inserimento il nome/email
    handleEmail = (text) => {
       this.setState({ email: text })
    }

    // Recupero dall'inserimento la password
    handlePassword = (text) => {
       this.setState({ password: text })
    }

    // Vado a gestire e controllore l'inserimento delle credenziali dell'utenteßß
    login = (email, pass) => {
       nomeUtente = email;
       // Controllo sull'inserimento delle credenziali
       let i;
       for(i=0; i<utenti.length; i++){
            if((email === utenti[i]) && (pass === '1234567')){
                this.props.navigation.navigate('Details')
            }
        }
    }
 
    // Modifica la navigationBar
    static navigationOptions = () => ({
     title: 'TimeManager',
     headerTintColor: 'black',
     headerBackTitle:'Logout',
     headerStyle: {
       backgroundColor: 'lightgrey'
     }
   });
 
    render() {
       return (
          <View style = {styles.container}>
             <Image
                 style={{width: 150, height: 150, marginLeft:105, marginBottom:20}}
                 source = {{uri:'https://cdn2.iconfinder.com/data/icons/time-management-2/92/iconN142-01-512.png'}}
             />
             <TextInput style = {styles.input}
                underlineColorAndroid = "transparent"
                placeholder = "Email"
                placeholderTextColor = "#434A53"
                autoCapitalize = "none"
                onChangeText = {this.handleEmail}/>
             
             <TextInput style = {styles.input}
                underlineColorAndroid = "transparent"
                placeholder = "Password"
                placeholderTextColor = "#434A53"
                autoCapitalize = "none"
                secureTextEntry={true}
                onChangeText = {this.handlePassword}/>
             
             <TouchableOpacity
                style = {styles.submitButton}
                onPress = {() => this.login(this.state.email, this.state.password)}>
                <Text style = {styles.submitButtonText}> Login </Text>
             </TouchableOpacity>
          </View>
       )
    }
 }

 export default Login;

 const styles = StyleSheet.create({
    container: {
       paddingTop: 150
    },
    input: {
       margin: 15,
       height: 40,
       borderColor: 'grey',
       borderWidth: 1,
       paddingLeft: 15
    },
    submitButton: {
       backgroundColor: 'grey',
       padding: 10,
       margin: 15,
       height: 40,
       alignItems: 'center'
    },
    submitButtonText:{
       color: 'white'
    },
 })