import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Button } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
// Importo lo schema, il model ed il controller
import Database from '../store/index'
import GiornataService from '../store/controllers/GiornateController'
import GiornateModel from '../store/models/GiornateModel'

// Recupero la data attuale
var today = new Date();
date = today.getDate();

class DetailsHistory extends React.Component {

  // Modifica la navigationBar
  static navigationOptions = ({ navigation }) => ({
    title: 'TimeManager',
    headerTintColor: 'black',
    headerStyle: {
      backgroundColor: 'lightgrey'
    }
  });

  // Funzione di navigazione verso la home, come logout
  _logout = () => {
    this.props.navigation.navigate('Home')
  }

  // Quando viene montato passo il parametro, serve per il funzionamento del click sulla navigationbar
//   componentDidMount () {
//     this.props.navigation.setParams({ logout: this._logout });
//   }
  

  // Setto i valori di default, che mi serviranno per la gestione dei timer
  state = {
    // Valori per il timer del turno
    timer: null,
    sec: '00',
    miliseconds: '00',
    minuts: '00',
    hours: '00',
    turno: 'Inizio Turno',
    startDisabled: true,
    stopDisabled: false,
    // Valori di default per il timer delle attavità
    timerA: null,
    secA: '00',
    milisecondsA: '00',
    minutsA: '00',
    hoursA: '00',
    attivita: 'Inizia Attività',
    startDisabledA: true,
    stopDisabledA: false,
}

// Eseguo il bind delle funzioni, referenziandole una volta sola
constructor( props ) {
  super( props );
  this.onButtonStop = this.onButtonStop.bind(this);
  this.start = this.start.bind(this);
  this.startAttivita = this.startAttivita.bind(this);
  this.onButtonStopA = this.onButtonStopA.bind(this);
  this.goToCalendar = this.goToCalendar.bind(this);
}

// Al login effettuato perte il timer del turno di lavoro
  componentDidMount() {

    this.props.navigation.setParams({ logout: this._logout });
}


  // Scegliere start o stop del timer turno
  startTurno(){
      if(this.state.turno === 'Inizio Turno'){
        this.start();
        this.state.turno = 'Pausa Turno';

      } else {
        this.onButtonStop();
        this.onButtonStopA();
        this.state.attivita = 'Inizia Attività'
        this.state.turno = 'Inizio Turno';
        let utenteScelto = nomeUtente.toString()

        // Aggiorno il DB sul tempo di lavoro
        let sec = this.state.sec.toString()
        let min = this.state.minuts.toString()
        let hou = this.state.hours.toString()
        let tempo = parseInt(hou+min+sec)
        GiornataService.updateTempoLavoro(utenteScelto,tempo)

        // Aggiorno il DB sul tempo della attività
        let secA = this.state.secA.toString()
        let minA = this.state.minutsA.toString()
        let houA = this.state.hoursA.toString()
        let tempoA = parseInt(houA+minA+secA)
        GiornataService.updateTempoAttivita(utenteScelto,tempoA)
      }
  }

  // Scegliere start o stop del timer attività
  startAttivita(){
    if(this.state.attivita === 'Inizia Attività'){
        this.startAt();
        this.state.attivita = 'Pausa Attività';
      } else {
        this.onButtonStopA();
        this.state.attivita = 'Inizia Attività';
        let utenteScelto = nomeUtente.toString()

        // Aggiorno il DB sul tempo della attività
        let sec = this.state.secA.toString()
        let min = this.state.minutsA.toString()
        let hou = this.state.hoursA.toString()
        let tempo = parseInt(hou+min+sec)
        GiornataService.updateTempoAttivita(utenteScelto,tempo)
      }
  }

    // Mettere in pausa il timer del turno
    onButtonStop() {
        clearInterval(this.state.timer);
        this.setState({startDisabled: false, stopDisabled: true});
    }

    // Mettere in pausa il timer dell'attività
    onButtonStopA() {
        clearInterval(this.state.timerA);
        this.setState({startDisabledA: false, stopDisabledA: true});
    }

    // Gestione del timer del turno
    start() {
        var self = this;
        let timer = setInterval(() => {

            var num = (Number(this.state.miliseconds) + 1).toString(),
                count = this.state.sec,
                minut = this.state.minuts;
                hour = this.state.hours;
            
            // Secondi
            if( Number(this.state.miliseconds) == 59 ) {
                count = (Number(this.state.sec) + 1).toString();
                num = '00';
            }
            // Minuti
            if(Number(this.state.sec)==59){
            minut = (Number(this.state.minuts)+1).toString();
            count = '00';
            }
            // Ore
            if(Number(this.state.minuts)==59){
            hour = (Number(this.state.hours)+1).toString();
            minut = '00';
            }
            
            self.setState({
                sec: count.length == 1 ? '0'+count : count,
                miliseconds: num.length == 1 ? '0'+num : num,
                minuts : minut.length == 1 ? '0'+minut: minut,
                hours : hour.length == 1 ? '0'+hour: hour,
            });
        }, 0);
        this.setState({timer});
    }

    // Gestione del timer dell'attivtà
    startAt(){
        var self = this;
        let timerA = setInterval(() => {

            var num = (Number(this.state.milisecondsA) + 1).toString(),
                count = this.state.secA,
                minut = this.state.minutsA;
                hour = this.state.hoursA;
            
            // Secondi
            if( Number(this.state.milisecondsA) == 59 ) {
                count = (Number(this.state.secA) + 1).toString();
                num = '00';
            }
            // Minuti
            if(Number(this.state.secA)==59){
            minut = (Number(this.state.minutsA)+1).toString();
            count = '00';
            }
            // Ore
            if(Number(this.state.minutsA)==59){
            hour = (Number(this.state.hoursA)+1).toString();
            minut = '00';
            }
            
            self.setState({
                secA: count.length == 1 ? '0'+count : count,
                milisecondsA: num.length == 1 ? '0'+num : num,
                minutsA: minut.length == 1 ? '0'+minut: minut,
                hoursA : hour.length == 1 ? '0'+hour: hour,
            });
        }, 0);
        this.setState({timerA});
    }

    // Vai al calendario
    goToCalendar() {
        this.props.navigation.navigate('Calendar');
    }

    // Vai ai Task
    goToTask() {
        this.props.navigation.navigate('Search');
    }

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

    // Recupero il tempo di lavoro dal DB della giornate passata dalla activity principale details
    tempoTrovato = GiornataService.findTempoLavoro(utenteScelto,dataCompleta)
    let tempoStringa = tempoTrovato.toString()
    let ore = tempoStringa.substring(0,1)
    let minuti = tempoStringa.substring(1,3)
    let secondi = tempoStringa.substring(3,5)
    console.log(ore+':'+minuti+':'+secondi)
    console.log(tempoTrovato)

    // Recupero il tempo di lavoro dal DB della giornate passata dalla activity principale details
    tempoTrovatoAttivita = GiornataService.findTempoAttivita(utenteScelto,dataCompleta)
    let tempoStringaAttivita = tempoTrovatoAttivita.toString()
    let oreA = tempoStringaAttivita.substring(0,1)
    let minutiA = tempoStringaAttivita.substring(1,3)
    let secondiA = tempoStringaAttivita.substring(3,5)
    console.log(oreA+':'+minutiA+':'+secondiA)
    console.log(tempoTrovatoAttivita)
    

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

        {/* Benvenuto */}
        <Text style={{fontFamily:'Arial', fontSize:25, marginLeft:15}}>Benvenuto,</Text>
        <Text style={{fontFamily:'Arial', fontSize:25, marginLeft:5}}>{nomeUtente}</Text>

        <Text style={{position:'absolute',top:70,fontFamily:'Arial', fontSize:14}}>Resoconto del giorno - {dataCompleta} </Text>
        <Text style={{position:'absolute',top:100, left:55,fontFamily:'Arial', fontSize:16}}>{oreA+':'+minutiA+':'+secondiA}</Text>
        <Text style={{position:'absolute',top:120, left:50,fontFamily:'Arial', fontSize:14}}>Ore Attività</Text>

        <Text style={{position:'absolute',top:100, left:170,fontFamily:'Arial', fontSize:16}}> {ore+':'+minuti+':'+secondi} </Text>
        <Text style={{position:'absolute',top:120, left:165 ,fontFamily:'Arial', fontSize:14}}>Ore Lavoro</Text>

        {/* <Text style={{position:'absolute',top:150,fontFamily:'Arial', fontSize:14}}>Ultima settimana</Text> */}
        
        {/* <View style={styles.CircleShapeView1}>
          <Text>{date-6}</Text>
        </View>
        <View style={styles.CircleShapeView2}>
          <Text>{date-5}</Text>
        </View>
        <View style={styles.CircleShapeView3}>
          <Text>{date-4}</Text>
        </View>
        <View style={styles.CircleShapeView4}>
          <Text>{date-3}</Text>
        </View>
        <View style={styles.CircleShapeView5}>
          <Text>{date-2}</Text>
        </View>
        <View style={styles.CircleShapeView6}>
          <Text>{date-1}</Text>
        </View>
        <View style={styles.CircleShapeView7}>
          <Text>{date}</Text>
        </View> */}

        {/* <Text style={{position:'absolute',top:230,fontFamily:'Arial', fontSize:14,color:'red'}}>Vedi calendario completo</Text>
        <Text style={{position:'absolute',top:228,left:170,fontFamily:'Arial', fontSize:16,color:'red'}} onPress={() => this.goToCalendar()}>Vai</Text> */}


        {/* <Text style={{position:'absolute',top:285,fontFamily:'Arial', fontSize:18}}>Task - {mioTask} </Text>
        <TouchableOpacity style={styles.buttonTask} onPress={() => this.goToTask()}>
           <Text style = {styles.submitButtonText}> Visualizza Task </Text>
        </TouchableOpacity>

        <Text style={{position:'absolute',top:400,fontFamily:'Arial', fontSize:18}}>Attività</Text>
        <TouchableOpacity style={styles.nuovaAttivita} onPress={() => this.startAttivita()}>
           <Text style = {styles.submitButtonText}> {this.state.attivita} </Text>
        </TouchableOpacity>

        <Text style={{position:'absolute',top:520,fontFamily:'Arial', fontSize:18}}>Turno</Text>
        <TouchableOpacity style={styles.nuovoTurno} onPress={() => this.startTurno()}>
           <Text style = {styles.submitButtonText}> {this.state.turno} </Text>
        </TouchableOpacity> */}
        
      </View>
    );
  }
}

export default DetailsHistory;

 const styles = StyleSheet.create({
    submitButton: {
       backgroundColor: 'grey',
       padding: 10,
       margin: 15,
       height: 40,
       alignItems: 'center'
    },
    submitButtonText:{
       color: 'white',
       fontSize:16
    },
    nuovaAttivita:{
     backgroundColor: 'grey',
     padding: 25,
     margin: 0,
     height: 70,
     width:300,
     alignItems: 'center',
     position:'absolute',
     top:430,
     borderRadius:8
    },
    nuovoTurno: {
     backgroundColor: 'grey',
     padding: 25,
     margin: 0,
     height: 70,
     width:300,
     alignItems: 'center',
     position:'absolute',
     top:550,
     borderRadius:8
    },
    buttonTask:{
      backgroundColor: 'grey',
      padding: 25,
      margin: 0,
      height: 70,
      width:300,
      alignItems: 'center',
      position:'absolute',
      top:315,
      borderRadius:8
    },
   CircleShapeView1: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: '#FF6666',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:175,
   },
   CircleShapeView2: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: 'lightgrey',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:175,
     marginLeft:40
   },
   CircleShapeView3: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: 'lightgrey',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:175,
     marginLeft:80
   },
   CircleShapeView4: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: 'lightgreen',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:175,
     marginLeft:120,
   },
   CircleShapeView5: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: 'lightgreen',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:175,
     marginLeft:160,
     },
     CircleShapeView6: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: 'lightgreen',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:175,
     marginLeft:200
     },
     CircleShapeView7: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: 'lightgreen',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:175,
     marginLeft:240,
     borderWidth:2,
     borderColor: 'black'
   },
 })