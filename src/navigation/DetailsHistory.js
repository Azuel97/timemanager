import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Button } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
// Importo lo schema, il model ed il controller
import Database from '../store/index'
import GiornataService from '../store/controllers/GiornateController'
import GiornateModel from '../store/models/GiornateModel'

class DetailsHistory extends React.Component {

  // Modifica la navigationBar
  static navigationOptions = ({ navigation }) => ({
    title: 'TimeManager',
    headerTintColor: 'black',
    headerStyle: {
      backgroundColor: 'lightgrey'
    }
  });

  render() {

    // Recupero del parametro passato dalla activity Search
    const { navigation } = this.props;
    const miaData = navigation.getParam('dataGiorno', '');

    // Recupero il nome dell'utente 
    let utenteScelto = nomeUtente.toString()

    // Recupero la data attuale e la formatto
    var today = new Date();
    todayMonth = today.getMonth() + 1;
    todayMo = todayMonth.toString();
    todayYear = today.getFullYear().toString()
    dataCompleta = (miaData+'/'+todayMo+'/'+todayYear).toString()

    // Recupero dal DB il tempo di lavoro della giornata passata dalla activity principale details
    tempoTrovato = GiornataService.findTempoLavoro(utenteScelto,dataCompleta)
    let tempoStringa = tempoTrovato.toString()  
    let ore = tempoStringa.substring(0,2)
    let minuti = tempoStringa.substring(2,4)
    let secondi = tempoStringa.substring(4,6)
    //console.log(ore+':'+minuti+':'+secondi)

    // Recupero dal DB il tempo di attività della giornata passata dalla activity principale details
    tempoTrovatoAttivita = GiornataService.findTempoAttivita(utenteScelto,dataCompleta)
    let tempoStringaAttivita = tempoTrovatoAttivita.toString()
    let oreA = tempoStringaAttivita.substring(0,2)
    let minutiA = tempoStringaAttivita.substring(2,4)
    let secondiA = tempoStringaAttivita.substring(4,6)
    //console.log(ore+':'+minuti+':'+secondi)

    return (
      <View style={{
            alignItems: "center",
            marginTop:15,
            flexDirection:'row',
            marginLeft:40 }}>
        <Image 
          source={{uri:'https://dummyimage.com/100x100/242124/fff.jpg'}}
          style={{width: 50, height: 50, borderRadius: 50/ 2}} 
        />

        <Text style={{fontFamily:'Arial', fontSize:25, marginLeft:15}}>Benvenuto,</Text>
        <Text style={{fontFamily:'Arial', fontSize:25, marginLeft:5}}>{nomeUtente}</Text>

        <Text style={{position:'absolute',top:70,fontFamily:'Arial', fontSize:14}}>Resoconto del giorno - {dataCompleta} </Text>
        <Text style={{position:'absolute',top:100, left:55,fontFamily:'Arial', fontSize:16}}>{oreA+':'+minutiA+':'+secondiA}</Text>
        <Text style={{position:'absolute',top:120, left:50,fontFamily:'Arial', fontSize:14}}>Ore Attività</Text>

        <Text style={{position:'absolute',top:100, left:170,fontFamily:'Arial', fontSize:16}}> {ore+':'+minuti+':'+secondi} </Text>
        <Text style={{position:'absolute',top:120, left:165 ,fontFamily:'Arial', fontSize:14}}>Ore Lavoro</Text>

      </View>
    );
  }
}

export default DetailsHistory;