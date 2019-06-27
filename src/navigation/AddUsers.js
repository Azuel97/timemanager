import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert, Button, FlatList } from 'react-native'
// Importo lo schema, il model ed il controller
import Database from '../store/index'
import PeopleService from '../store/controllers/UserController'
import PeopleModel from '../store/models/UserModel'

import {decode, encode} from 'base-64'

let utenti = '';
let count = 0

class AddUser extends React.Component {

    // State is data that is going to change, in general, you should initialize,
    // state in the constructor, and then call setState when you want to change it.
    state = {
        email: '',
        password: '',
        nome: ''
     }
 
    // Modifica la navigationBar
    static navigationOptions = () => ({
     title: 'TimeManager',
     headerTintColor: 'black',
     headerStyle: {
       backgroundColor: 'lightgrey'
     }
   });

   // Recupero dall'inserimento della email
   handleEmail = (text) => {
    this.setState({ email: text })
   } 

   // Recupero dall'inserimento la password
   handlePassword = (text) => {
    this.setState({ password: text })
   }

   // Recupero dall'inserimento del nome
   handleNome = (text) => {
    this.setState({ nome: text })
   }

   componentDidMount() {
        // Eseguo la GET per recuperrare la lunghezza dell'oggetto e dunque definire successivamente 
        // il valore che avrà l'id del prossimo utente inserito
        return fetch('http://localhost:3031/user')
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log(responseJson[0].name);
            console.log(responseJson.length);
            count = responseJson.length
        })
        .catch((error) => {
            console.error(error);
        });
   }

   // Mi collego al Db ed aggiungo un utente al DB e torno nella pagina di Login
   toLogin(email,password,nome){
    
       if(email === "")
            Alert.alert('Errore','Nome obbligatorio')
       else if(password === "")
            Alert.alert('Errore','Password obbligatoria')
       else{
            // Cripto la password
            var pwdCriptata = encode(password);

            // Richiamo la funzione per aggiungere un utente
            // var inserimento = PeopleService.saveUser(new PeopleModel(email,pwdCriptata))

            // POST -> vado a salvare il nuovo utente
            fetch('http://localhost:3031/user', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    id: count.toString(),
                    name: nome,
                    email: email,
                    password: pwdCriptata
                }),
            })
            .then((response) => console.log('fetchResponse', response))
            .catch((error) => {
                console.error('fetchError', error);
            });

            // if(inserimento == true)
                // Torna alla activity home
                this.props.navigation.navigate('Home')
            // else
            //     Alert.alert('Errore','Nome utente già esistente')
       }
   }
 
    render() {

       return (
          <View style = {styles.container}>
            <Text style = {{left:150,fontSize:18}}>Add User</Text>
            <TextInput style = {styles.input}
                underlineColorAndroid = "transparent"
                placeholder = "Name"
                placeholderTextColor = "#434A53"
                autoCapitalize = "none"
                onChangeText = {this.handleNome}/>

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
                onPress = {() => this.toLogin(this.state.email, this.state.password, this.state.nome)}>
                <Text style = {styles.submitButtonText}> Register </Text>
             </TouchableOpacity>

          </View>
       )
    }
 }

 export default AddUser;

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