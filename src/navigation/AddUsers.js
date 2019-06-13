import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert, Button, FlatList } from 'react-native'
// Importo lo schema, il model ed il controller
import Database from '../store/index'
import PeopleService from '../store/controllers/UserController'
import PeopleModel from '../store/models/UserModel'

let utenti = '';

class AddUser extends React.Component {

    // State is data that is going to change, in general, you should initialize,
    // state in the constructor, and then call setState when you want to change it.
    state = {
        email: '',
        password: ''
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

   // Recupero dall'inserimento la password
   handlePassword = (text) => {
    this.setState({ password: text })
 }

   // Mi collego al Db ed aggiungo un utente al DB e torno nella pagina di Login
   toLogin(email,password){
    
       if(email === "")
            Alert.alert('Errore','Nome obbligatorio')
       else if(password === "")
            Alert.alert('Errore','Password obbligatoria')
       else{
            // Cripto la password
            var pwdCriptata = btoa(password);
            // Richiamo la funzione per aggiungere un utente
            var inserimento = PeopleService.saveUser(new PeopleModel(email,pwdCriptata))

            if(inserimento == true)
                // Torna alla activity home
                this.props.navigation.navigate('Home')
            else
                Alert.alert('Errore','Nome utente già esistente')
       }
   }

   componentDidMount() {
     // Richiamo la funzione find() per recuperare tutti gli utenti all'interno della lista
     utenti = PeopleService.findAllUser();
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

<           TextInput style = {styles.input}
                underlineColorAndroid = "transparent"
                placeholder = "Password"
                placeholderTextColor = "#434A53"
                autoCapitalize = "none"
                secureTextEntry={true}
                onChangeText = {this.handlePassword}/> 

            <TouchableOpacity
                style = {styles.submitButton}
                onPress = {() => this.toLogin(this.state.email, this.state.password)}>
                <Text style = {styles.submitButtonText}> Register </Text>
             </TouchableOpacity>

             {/* <FlatList
                style={{position:'absolute',top:310,left:150}}
                data={utenti}
                renderItem={({item}) => <Text style={styles.item}> • {item.name}</Text>}
                keyExtractor={(item, index) => index.toString()}
             /> */}

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