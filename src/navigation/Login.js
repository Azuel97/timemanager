import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert, Button } from 'react-native'
// Import lo schema del database
import Database from '../store/index'
import PeopleService from '../store/controllers/UserController'
import PeopleModel from '../store/models/UserModel'
import GiornataService from '../store/controllers/GiornateController'
import GiornateModel from '../store/models/GiornateModel'
// Use base-64
import {decode, encode} from 'base-64'

let utenteScelto;

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

    // Vado a gestire e controllore l'inserimento delle credenziali dell'utenteßß
    login = (email, password) => {

        
        //  // Prova FETCH di dati
        //  return fetch('http://localhost:3031/user?email='+email)
        //  .then((response) => response.json())
        //  .then((responseJson) => {
        //     console.log(responseJson[0].name);
        //  })
        //  .catch((error) => {
        //     console.error(error);
        //  });


        // Controllo l'inserimento delle credenziali degli utenti
        if((email === "") && (password === ""))
            Alert.alert('Attenzione','Inserire nome e password')
        else if(email === "")
            Alert.alert('Atenzione','Inserire il nome')
        else if(password === "")
            Alert.alert('Attenzione','Inserire la password')

       nomeUtente = email;
       // Cripto la password
       var pwdCriptata = encode(password);
       // Richiamo la funzione di ricerca su l'utente che richiede l'accesso
       utenteScelto = PeopleService.findSpecificUser(email,pwdCriptata)

       // Ciclo all'interno della risposta della query
       for (let p of utenteScelto) {
             //alert(`${p.name}`);
            if((email === p.name) && (pwdCriptata === p.pwd)){
                // Recupero la data attuale
                var today = new Date();
                todayDate = today.getDate().toString();
                todayMonth = today.getMonth() + 1;
                todayMo = todayMonth.toString();
                todayYear = today.getFullYear().toString()
                dataCompleta = (todayDate+'/'+todayMo+'/'+todayYear).toString()
                console.log(dataCompleta)
                
                // N.B --> Aggiungere controllo se esiste già un accesso di quella giornata, in questo
                // modo invece di creacre la giornata e di settare i timer a 0, riprende i timer dal 
                // database, ovvero riprende da dove aveva finito prima del logout.

                // Controllo se esite già un accesso dell'utente nella giornata corrente
                cercaGiormnata = GiornataService.findGiornata(email,dataCompleta)

                // Se esite, ovveri è true, allora recupero i valori dei timer dal DB e li passo come paramtro
                if(cercaGiormnata == true){

                    // Recupero il nome dell'utente 
                    let utenteScelto = nomeUtente.toString()

                    // Recupero la data attuale e la formatto
                    var today = new Date();
                    todayDate = today.getDate()
                    todayMonth = today.getMonth() + 1;
                    todayMo = todayMonth.toString();
                    todayYear = today.getFullYear().toString()
                    dataCompleta = (todayDate+'/'+todayMo+'/'+todayYear).toString()

                    // Recupero dal DB il tempo di lavoro della giornata passata dalla activity principale details
                    tempoTrovato = GiornataService.findTempoLavoro(utenteScelto,dataCompleta)
                    let tempoStringa = tempoTrovato.toString()  
                    let ore = tempoStringa.substring(0,2)
                    let minuti = tempoStringa.substring(2,4)
                    let secondi = tempoStringa.substring(4,6)
                    console.log(ore+':'+minuti+':'+secondi)

                    // Recupero dal DB il tempo di attività della giornata passata dalla activity principale details
                    tempoTrovatoAttivita = GiornataService.findTempoAttivita(utenteScelto,dataCompleta)
                    let tempoStringaAttivita = tempoTrovatoAttivita.toString()
                    let oreA = tempoStringaAttivita.substring(0,2)
                    let minutiA = tempoStringaAttivita.substring(2,4)
                    let secondiA = tempoStringaAttivita.substring(4,6)
                    console.log(ore+':'+minuti+':'+secondi)

                    taskTrovato = GiornataService.findLastTask(utenteScelto,dataCompleta)
                    console.log(taskTrovato)

                    // Passo alla activity principale 'Details' i valori dei timer che sono stati salvati
                    // sul db, in modo da recuperre dove erano rimasti prima di effettuare il logout
                    this.props.navigation.navigate('Details', {
                        task: taskTrovato,
                        oreLavoro: ore,
                        minutiLavoro: minuti,
                        secondiLavoro: secondi,
                        oreAttivita: oreA,
                        minutiAttivita: minutiA,
                        secondiAttivita: secondiA,
                        datiNonTrovati: false
                    })
                } else {
                    // Altrimenti su non c'è nessun accesso precedente dell'utente, allora vado a creare 
                    // l'accesso sul db impostando i timer per default a 0 e passo un parametro di controllo
                    GiornataService.saveGiornata(new GiornateModel(email,dataCompleta,'000000','000000'));
                    this.props.navigation.navigate('Details',{
                        datiNonTrovati: true
                    })
                }
            }
        } 
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

            {/* <Text>{info}</Text> */}

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