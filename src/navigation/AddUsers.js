import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert, Button } from 'react-native'
// Importo lo schema del DB
import Ute from '../store/models/User'
// Importo il metodo di aggiunta degli utenti
import {addUtenti} from '../store/controllers/UserController'


class AddUser extends React.Component {

    // State is data that is going to change, in general, you should initialize,
    // state in the constructor, and then call setState when you want to change it.
    state = {
        email: '',
     }
 
    // Modifica la navigationBar
    static navigationOptions = () => ({
     title: 'TimeManager',
     headerTintColor: 'black',
     headerStyle: {
       backgroundColor: 'lightgrey'
     }
   });

   // Recupero dall'inserimento il nome/email
   handleEmail = (text) => {
    this.setState({ email: text })
   } 

   // Mi collego al Db ed aggiungo un utente al DB e torno nella pagina di Login
   toLogin(email){

      // Richiamo il metodo per aggiungere un utente
      addUtenti(email);

      this.props.navigation.navigate('Home')
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
                onChangeText = {this.handleEmail}/>

            <TouchableOpacity
                style = {styles.submitButton}
                onPress = {() => this.toLogin(this.state.email)}>
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