import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert, Button } from 'react-native'
// Utilizzo di Realm, per la persistenza dei dati
import Ute from '../store/models/User'

// Richiedo l'utilizzo di realm
const Realm = require('realm');

let utenteScelto;

class Login extends React.Component {

    // State is data that is going to change, in general, you should initialize
    // state in the constructor, and then call setState when you want to change it.
    state = {
       email: '',
       password: ''
    }

    // Collegamento con il DB di realm, prima ancora che avvenga il render
    componentWillMount() {
        Realm.open([Ute]).then(realm => {
            this.setState({ realm });
            // Query sulla ricerca del nome dell'utente
            utenteScelto = "";
        });
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
        
       // Riapro il DB e controllo se l'utente è registrato all'interno del mio databsae
       Realm.open([Ute]).then(realm => {
        // Query sulla ricerca del nome dell'utente, tramite passaggio di una variabile
        utenteScelto = realm.objects('Ute').filtered('name == $0', email);
       });

       // Ciclo all'interno della risposta della query
       for (let p of utenteScelto) {
             //alert(`${p.name}`);
            if((email === p.name) && (pass === '1234567')){
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

            {/* <Text>{info}</Text> */}

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