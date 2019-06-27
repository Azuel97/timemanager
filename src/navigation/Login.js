import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert, Button } from 'react-native'
// Use base-64
import {decode, encode} from 'base-64'

let utenteScelto;
let trovato;
let emailT = '';
let pwdT = '';

class Login extends React.Component {

    // State is data that is going to change, in general, you should initialize
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

    // Con una GET -> controllo se l'utente esiste
    verificoUtente(emailC,passwordC) {
        pwdCriptata = encode(passwordC)
        return fetch('http://localhost:3031/user?email='+emailC+'&password='+pwdCriptata, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson.length === 0){
                // Controllo l'inserimento delle credenziali degli utenti
                if((emailC === "") && (passwordC === ""))
                    Alert.alert('Attenzione','Inserire email e password')
                else if(emailC === "")
                    Alert.alert('Atenzione','Inserire email')
                else if(passwordC === "")
                    Alert.alert('Attenzione','Inserire la password')
                else
                    Alert.alert('Attenzione','Email o password sbagliate')    
            }else{
                // Recupero il nome dell'utente
                nomeUtente = (responseJson[0].name).split(" ",1)
                this.props.navigation.navigate('Details', {
                    id: responseJson[0].id,
                    datiNonTrovati: true
                })
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    // Vado a gestire e controllore l'inserimento delle credenziali dell'utenteßß
    login = (email, password) => {
        this.verificoUtente(email,password)
    }
 
    // Modifica la navigationBar
    static navigationOptions = () => ({
     title: 'TimeManager',
     headerTintColor: 'black',
     //headerBackTitle:'Logout',
     headerStyle: {
       backgroundColor: 'lightgrey'
     }
    });
 
    render() {

        // Log di verifa di quanti elementi ci sono all'interno del DB
        const info = this.state.realm
            ? 'Number of users in this Realm: ' + this.state.realm.objects('Ute').length
            : 'Loading...';

       return (
          <View style = {styles.container}>
             <Image
                 style={{width: 150, height: 150, marginLeft:105, marginBottom:20}}
                 source = {{uri:'https://cdn2.iconfinder.com/data/icons/time-management-2/92/iconN142-01-512.png'}}
             />
             <TextInput style = {styles.input}
                underlineColorAndroid = "transparent"
                placeholder = "Nome"
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

             <TouchableOpacity
                style = {styles.submitButton}
                onPress = {() => {this.props.navigation.navigate('AddUser')}}>
                <Text style = {styles.submitButtonText}> Register </Text>
             </TouchableOpacity>

          </View>
       )
    }
 }

 export default Login;

 const styles = StyleSheet.create({
    container: {
       paddingTop: 150,
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