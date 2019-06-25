import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Button, Alert } from 'react-native'
// Import Icon
import Icon from 'react-native-vector-icons/Ionicons';
// Importo lo schema, il model ed il controller
import Database from '../store/index'
import GiornataService from '../store/controllers/GiornateController'
import GiornateModel from '../store/models/GiornateModel'
import ProgettiService from '../store/controllers/ProgettiController'
import ProgettiModel from '../store/models/ProgettiModel'

// Recupero la data attuale
var today = new Date();
date = today.getDate();

var mioTask
var taskSalvato
var mioProgetto

class DetailsScreen extends React.Component {

  // Modifica la navigationBar
  static navigationOptions = ({ navigation }) => ({
    title: 'TimeManager',
    headerTintColor: 'black',
    // Disabilito le gestures
    gesturesEnabled: false,
    headerStyle: {
      backgroundColor: 'lightgrey',
    },
    headerRight:(
      <Text style={{fontSize:18, marginRight:7}} onPress={navigation.getParam('logout')} ><Icon size={26} color="black" name="ios-log-out" />  </Text>
    ),
    headerLeft: null
  });

  // Eseguo il bind delle funzioni, referenziandole una volta sola
  constructor( props ) {
    super( props );
    this.onButtonStop = this.onButtonStop.bind(this);
    this.start = this.start.bind(this);
    this.startAttivita = this.startAttivita.bind(this);
    this.onButtonStopA = this.onButtonStopA.bind(this);
    this.goToCalendar = this.goToCalendar.bind(this);
    this.goToProgetti = this.goToProgetti.bind(this);
  }

  dataAttuale(){
    // Recupero la data attuale e la formatto
    var today = new Date();
    todayDay = today.getDate();
    todayMonth = today.getMonth() + 1;
    todayMo = todayMonth.toString();
    todayYear = today.getFullYear().toString()
    dataCompleta = (todayDay+'/'+todayMo+'/'+todayYear).toString()
    return dataCompleta
  }

  tempoTurno() {
    // Recupero i valori del timer del turno
    let sec = this.state.sec.toString()
    let min = this.state.minuts.toString()
    let hou = this.state.hours.toString()
    let tempo = (hou+min+sec)
    return tempo
  }

  tempoA() {
    // Recupero i valori del timer delle attività
    let secA = this.state.secA.toString()
    let minA = this.state.minutsA.toString()
    let houA = this.state.hoursA.toString()
    let tempo = (houA+minA+secA)
    return tempo
  }

  // Funzione di navigazione verso la home, come logout
  _logout = () => {

    if(this.state.attivita === 'Inizia Attività' && this.state.turno === 'Inizio Turno') {
        this.props.navigation.navigate('Home')
    } else if(this.state.attivita === 'Inizia Attività' && this.state.turno === 'Pausa Turno') {
        this.onButtonStop()
        let utenteScelto = nomeUtente.toString()

        // Recupero la data
        dataCompleta = this.dataAttuale()

        tempo = this.tempoA()
        // Richiamo il metodo per il salvataggio della attivitò all'interno del DB
        taskSalvato = GiornataService.saveTask(utenteScelto,dataCompleta,mioTask,tempo)

         // Aggiorno il DB sul tempo di lavoro
        tempo = this.tempoTurno()
        GiornataService.updateTempoLavoro(utenteScelto,tempo,dataCompleta)

        this.props.navigation.navigate('Home')
    } else if(this.state.attivita === 'Pausa Attività' && this.state.turno === 'Pausa Turno')
        // Quando effettuo il logout e i timer stanno ancora andando gli stoppo e aggiorno i valori
        // all'interno del database in modo da essere sempre aggiornato
        this.onButtonStop()
        this.onButtonStopA()

        let utenteScelto = nomeUtente.toString()

        // Recupero la data
        dataCompleta = this.dataAttuale()

        tempo = this.tempoA()
        // Richiamo il metodo per il salvataggio della attivitò all'interno del DB
        taskSalvato = GiornataService.saveTask(utenteScelto,dataCompleta,mioTask,tempo)

        // Aggiorno il DB sul tempo di lavoro
        tempo = this.tempoTurno()
        GiornataService.updateTempoLavoro(utenteScelto,tempo,dataCompleta)

        // Aggiorno il DB sul tempo della attività
        tempoA = this.tempoA()
        GiornataService.updateTempoAttivita(utenteScelto,tempoA,dataCompleta)

        this.props.navigation.navigate('Home')
  }

  // Quando viene montato passo il parametro, serve per il funzionamento del click sulla navigationbar
  // e sul recupero dei parametri passati dal activity di login
  componentDidMount () {
    this.props.navigation.setParams({ logout: this._logout });

    // Recupero il valore di controllo
    const { navigation } = this.props;
    const datiTro = navigation.getParam('datiNonTrovati', '');

    // Se il parametro è false, vuol dire che c'è gia un accesso del utente e quindi recupero i valori dei
    // timer salvati nel db e gli assegno agli state che vengono gestiti dai timer
    if(datiTro == false ) {

        // Recupero dei parametri passati dalla activity Login, per il Turno
        // e setto gli state dei timer con il loro valore passato
        const orePassate = navigation.getParam('oreLavoro', '');
        const minutiPassati = navigation.getParam('minutiLavoro', '');
        const secondiPassati = navigation.getParam('secondiLavoro', '');

        this.state.sec = secondiPassati;
        this.state.minuts = minutiPassati;
        this.state.hours = orePassate;

        // Recupero del parametro passato dalla activity Login, per le Attività
        // e setto il valore degli state dei timer con il valore recuperato
        const orePassateA = navigation.getParam('oreAttivita', '');
        const minutiPassatiA = navigation.getParam('minutiAttivita', '');
        const secondiPassatiA = navigation.getParam('secondiAttivita', '');

        this.state.secA = secondiPassatiA;
        this.state.minutsA = minutiPassatiA;
        this.state.hoursA = orePassateA;

    } else {

        // Altrimenti vuol dire che è il primo accesso giornaliero e di conseguenza vado a settare gli
        // stete dei timer tutti a zero
        this.state.sec = '00';
        this.state.minuts = '00';
        this.state.hours = '00';

        this.state.secA = '00';
        this.state.minutsA = '00';
        this.state.hoursA = '00';
    }
    
    let utenteScelto = nomeUtente.toString()

    // Recupero la data attuale e la formatto, per tutti i giorni della settimana
    var today = new Date();
    todayDay = today.getDate()
    todayDay1 = today.getDate() - 1;
    todayDay2 = today.getDate() - 2;
    todayDay3 = today.getDate() - 3;
    todayDay4 = today.getDate() - 4;
    todayDay5 = today.getDate() - 5;
    todayDay6 = today.getDate() - 6;
    todayMonth = today.getMonth() + 1;
    todayMo = todayMonth.toString();
    todayYear = today.getFullYear().toString()

    // Converto in stringa l'intera data ottenuta precedentemente per tutti i giorni della settimana
    dataCompleta = (todayDay+'/'+todayMo+'/'+todayYear).toString()
    dataCompleta1 = (todayDay1+'/'+todayMo+'/'+todayYear).toString()
    dataCompleta2 = (todayDay2+'/'+todayMo+'/'+todayYear).toString()
    dataCompleta3 = (todayDay3+'/'+todayMo+'/'+todayYear).toString()
    dataCompleta4 = (todayDay4+'/'+todayMo+'/'+todayYear).toString()
    dataCompleta5 = (todayDay5+'/'+todayMo+'/'+todayYear).toString()
    dataCompleta6 = (todayDay6+'/'+todayMo+'/'+todayYear).toString()

    // Vado a ricercare le giornate appena composte all'interno del DB, per poi manipolarle
    cercoGiornata = GiornataService.findGiornata(utenteScelto,dataCompleta)
    cercoGiornata1 = GiornataService.findGiornata(utenteScelto,dataCompleta1)
    cercoGiornata2 = GiornataService.findGiornata(utenteScelto,dataCompleta2)
    cercoGiornata3 = GiornataService.findGiornata(utenteScelto,dataCompleta3)
    cercoGiornata4 = GiornataService.findGiornata(utenteScelto,dataCompleta4)
    cercoGiornata5 = GiornataService.findGiornata(utenteScelto,dataCompleta5)
    cercoGiornata6 = GiornataService.findGiornata(utenteScelto,dataCompleta6)

    // Calcolo la differernza tra il tempo di lavoro ed il tempo della attività, per ogni singolo 
    // giormno della setimana precedentemente prelevato, in modo da effettuare dei controlli
    tempoLavoro = parseInt(GiornataService.findTempoLavoro(utenteScelto,dataCompleta))
    tempoAttivita = parseInt(GiornataService.findTempoAttivita(utenteScelto,dataCompleta))
    diffTempo = tempoLavoro -tempoAttivita

    tempoLavoro1 = parseInt(GiornataService.findTempoLavoro(utenteScelto,dataCompleta1))
    tempoAttivita1 = parseInt(GiornataService.findTempoAttivita(utenteScelto,dataCompleta1))
    diffTempo1 = tempoLavoro1 -tempoAttivita1

    tempoLavoro2 = parseInt(GiornataService.findTempoLavoro(utenteScelto,dataCompleta2))
    tempoAttivita2 = parseInt(GiornataService.findTempoAttivita(utenteScelto,dataCompleta2))
    diffTempo2 = tempoLavoro2 -tempoAttivita2

    tempoLavoro3 = parseInt(GiornataService.findTempoLavoro(utenteScelto,dataCompleta3))
    tempoAttivita3 = parseInt(GiornataService.findTempoAttivita(utenteScelto,dataCompleta3))
    diffTempo3 = tempoLavoro3 -tempoAttivita3

    tempoLavoro4 = parseInt(GiornataService.findTempoLavoro(utenteScelto,dataCompleta4))
    tempoAttivita4 = parseInt(GiornataService.findTempoAttivita(utenteScelto,dataCompleta4))
    diffTempo4 = tempoLavoro4 -tempoAttivita4

    tempoLavoro5 = parseInt(GiornataService.findTempoLavoro(utenteScelto,dataCompleta5))
    tempoAttivita5 = parseInt(GiornataService.findTempoAttivita(utenteScelto,dataCompleta5))
    diffTempo5 = tempoLavoro5 -tempoAttivita5

    tempoLavoro6 = parseInt(GiornataService.findTempoLavoro(utenteScelto,dataCompleta6))
    tempoAttivita6 = parseInt(GiornataService.findTempoAttivita(utenteScelto,dataCompleta6))
    diffTempo6 = tempoLavoro6 -tempoAttivita6

    // Controllo e determino per ogni giornata prelevata dal DB, la differenza tra i due timer per
    // decidere che colore assegnarli in base al risultato ottenuto, ovvero :
    // - rosso (diff > 1h)  - verde (diff < 1h)  - grigio (non esite la giornata all'interno del DB, no lavoro)
    if(cercoGiornata == true){
      if(tempoLavoro < 80000){
        this.state.coloreSettimana = 'rosso'
      }else if(diffTempo > 10000){
        this.state.coloreSettimana = 'rosso'
      }else if(diffTempo <= 10000){  
        this.state.coloreSettimana = 'verde'
      } 
    }else{
        this.state.coloreSettimana = 'grigio'  
    }

    if(cercoGiornata1 == true){
      if(tempoLavoro1 < 80000){
        this.state.coloreSettimana1 = 'rosso'
      }else if(diffTempo1 > 10000){
        this.state.coloreSettimana1 = 'rosso'
      }else if(diffTempo1 <= 10000){  
        this.state.coloreSettimana1 = 'verde'
      }  
    }else{
        this.state.coloreSettimana6 = 'grigio'  
    }

    if(cercoGiornata2 == true){
      if(tempoLavoro2 < 80000){
        this.state.coloreSettimana2 = 'rosso'
      }else if(diffTempo2 > 10000){
        this.state.coloreSettimana2 = 'rosso'
      }else if(diffTempo2 <= 10000){  
        this.state.coloreSettimana2 = 'verde'
      }  
    }else{
        this.state.coloreSettimana2 = 'grigio'  
    }

    if(cercoGiornata3 == true){
      if(tempoLavoro3 < 80000){
        this.state.coloreSettimana3 = 'rosso'
      }else if(diffTempo3 > 10000){
        this.state.coloreSettimana3 = 'rosso'
      }else if(diffTempo3 <= 10000){  
        this.state.coloreSettimana3 = 'verde'
      }  
    }else{
        this.state.coloreSettimana3 = 'grigio'  
    }

    if(cercoGiornata4 == true){
      if(tempoLavoro4 < 80000){
        this.state.coloreSettimana4 = 'rosso'
      }else if(diffTempo4 > 10000){
        this.state.coloreSettimana4 = 'rosso'
      }else if(diffTempo4 <= 10000){  
        this.state.coloreSettimana4 = 'verde'
      }  
    }else{
        this.state.coloreSettimana4 = 'grigio'  
    }

    if(cercoGiornata5 == true){
      if(tempoLavoro5 < 80000){
        this.state.coloreSettimana5 = 'rosso'
      }else if(diffTempo5 > 10000){
        this.state.coloreSettimana5 = 'rosso'
      }else if(diffTempo5 <= 10000){  
        this.state.coloreSettimana5 = 'verde'
      }  
    }else{
        this.state.coloreSettimana5 = 'grigio'  
    }

    if(cercoGiornata6 == true){
      if(tempoLavoro6 < 80000){
        this.state.coloreSettimana6 = 'rosso'
      }else if(diffTempo6 > 10000){
        this.state.coloreSettimana6 = 'rosso'
      }else if(diffTempo6 <= 10000){  
        this.state.coloreSettimana6 = 'verde'
      }  
    }else{
        this.state.coloreSettimana6 = 'grigio'  
    }

  }
  
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
    // Valori per la scelta del colore della preview dell'ultima settimana
    coloreSettimana: '',
    coloreSettimana1: '',
    coloreSettimana2: '',
    coloreSettimana3: '',
    coloreSettimana4: '',
    coloreSettimana5: '',
    coloreSettimana6: '',
    // Valori per la scelta del bottone selezionato/deselezionato
    abilitaStartTurno: false,
    abilitaStopTurno: true,
    abilitaStartAttivita: false,
    abilitaStopAttivita: true
  }

  // Scegliere start o stop del timer turno
  startTurno(){
      this.start();
      this.state.abilitaStartTurno = true
      this.state.abilitaStopTurno = false
  }

  stopTurno() {
    this.state.abilitaStartTurno = false
    this.state.abilitaStopTurno = true
    this.state.abilitaStartAttivita = false
    this.state.abilitaStopAttivita = true

    this.onButtonStop();
    this.onButtonStopA();
    this.state.attivita = 'Inizia Attività'
    this.state.turno = 'Inizio Turno';
    let utenteScelto = nomeUtente.toString()

    // Recupero la data
    dataCompleta = this.dataAttuale()

    tempo = this.tempoA()
    // Richiamo il metodo per il salvataggio della attivitò all'interno del DB
    taskSalvato = GiornataService.saveTask(utenteScelto,dataCompleta,mioTask,tempo)

    // Aggiorno il DB sul tempo di lavoro
    tempo = this.tempoTurno()
    GiornataService.updateTempoLavoro(utenteScelto,tempo,dataCompleta)

    /// Aggiorno il DB sul tempo della attività
    tempoA = this.tempoA()
    GiornataService.updateTempoAttivita(utenteScelto,tempoA,dataCompleta)
    console.log(dataCompleta)
  }

  // Scegliere start o stop del timer attività
  startAttivita(){

    if(this.state.abilitaStartAttivita === false && this.state.abilitaStartTurno === false){

        // Quando faccio partire il timer delle attività, recupero l'attività e vado a salvarla all'interno
        // del DB, in modo da poter vedere quante attività sono state svolte durante la gornata
        let utenteScelto = nomeUtente.toString()
        // Recupero la data
        dataCompleta = this.dataAttuale()
        tempo = this.tempoA()
        // Richiamo il metodo per il salvataggio della attivitò all'interno del DB
        taskSalvato = GiornataService.saveTask(utenteScelto,dataCompleta,mioTask,tempo)
        console.log(taskSalvato)

        if(taskSalvato === true){
          Alert.alert('Attenzione','Scelta task obbligatoria')
        }else{
          this.startAt();
          this.start()
          this.state.abilitaStartAttivita = true
          this.state.abilitaStopAttivita = false
          this.state.abilitaStartTurno = true
          this.state.abilitaStopTurno = false

          this.state.attivita = 'Pausa Attività';
          this.state.turno = 'Pausa Turno'
        }

      } else if(this.state.abilitaStartAttivita === false && this.state.abilitaStopTurno === false) {

            // // Quando faccio partire il timer delle attività, recupero l'attività e vado a salvarla all'interno
            // // del DB, in modo da poter vedere quante attività sono state svolte durante la gornata
            // let utenteScelto = nomeUtente.toString()
            // // Recupero la data
            // dataCompleta = this.dataAttuale()
            // tempo = this.tempoA()
            // // Richiamo il metodo per il salvataggio della attivitò all'interno del DB
            // taskSalvato = GiornataService.saveTask(utenteScelto,dataCompleta,mioTask,tempo)

            if(taskSalvato === true){
              Alert.alert('Attenzione','Scelta task obbligatoria')
            }else{
              this.startAt()
              this.state.abilitaStartAttivita = true
              this.state.abilitaStopAttivita = false
              this.state.attivita = 'Pausa Attività'
            }
      } 
  }

  stopAttivita() {
    this.state.abilitaStartAttivita = false
    this.state.abilitaStopAttivita = true

    this.onButtonStopA();
    this.state.attivita = 'Inizia Attività';
    let utenteScelto = nomeUtente.toString()

    // Recupero la data
    dataCompleta = this.dataAttuale()

    tempo = this.tempoA()
    // Richiamo il metodo per il salvataggio della attivitò all'interno del DB
    taskSalvato = GiornataService.saveTask(utenteScelto,dataCompleta,mioTask,tempo)



    //timerSalvato = ProgettiService.saveTimerProgetto(mioProgetto,tempo)



    // Aggiorno il DB sul tempo della attività
    tempo = this.tempoA()
    GiornataService.updateTempoAttivita(utenteScelto,tempo,dataCompleta)

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

    // Vai nella activity Task
    goToTask() {
        // Se non ho selezionato nessun progetto, faccio mostrare un alert
        if(mioProgetto === ""){
          Alert.alert('Attenzione','Selezionare un progetto')
        }else{
        let task = 1
        this.props.navigation.navigate('Search', {
          visualizza: task,
          progetto: mioProgetto
        });
      }
    }

    // Vai nella activity Progetti
    goToProgetti() {
      let task = 0
      this.props.navigation.navigate('Search', {
        visualizza: task
      });
    }


    // Gestione dello storico con passaggio al dettaglio della giornata, passando il giorno
    // N.B --> bug da risolvere quando il giorno è minore di 10
    goToHistory() {
      let data = date
      this.props.navigation.navigate('History', {
        dataGiorno: data
      });
    }

    goToHistory1() {
      let data = date-1
      this.props.navigation.navigate('History', {
        dataGiorno: data
      });
    }

    goToHistory2() {
      let data = date-2
      this.props.navigation.navigate('History', {
        dataGiorno: data
      });
    }

    goToHistory3() {
      let data = date-3
      this.props.navigation.navigate('History', {
        dataGiorno: data
      });
    }

    goToHistory4() {
      let data = date-4
      this.props.navigation.navigate('History', {
        dataGiorno: data
      });
    }

    goToHistory5() {
      let data = date-5
      this.props.navigation.navigate('History', {
        dataGiorno: data
      });
    }

    goToHistory6() {
      let data = date-6
      this.props.navigation.navigate('History', {
        dataGiorno: data
      });
    }

  render() {

    // Recupero del parametro passato dalla activity Search
    const { navigation } = this.props;
    mioTask = navigation.getParam('myTask', '');
    mioProgetto = navigation.getParam('myProject', '');

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

        <Text style={{position:'absolute',top:70,fontFamily:'Arial', fontSize:14}}>Resoconto giornaliero </Text>
        <Text style={{position:'absolute',top:100, left:55,fontFamily:'Arial', fontSize:16}}>{this.state.hoursA}:{this.state.minutsA}:{this.state.secA}</Text>
        <Text style={{position:'absolute',top:120, left:50,fontFamily:'Arial', fontSize:14}}>Ore Attività</Text>

        <Text style={{position:'absolute',top:100, left:170,fontFamily:'Arial', fontSize:16}}>{this.state.hours}:{this.state.minuts}:{this.state.sec}</Text>
        <Text style={{position:'absolute',top:120, left:165 ,fontFamily:'Arial', fontSize:14}}>Ore Lavoro</Text>

        <Text style={{position:'absolute',top:155,fontFamily:'Arial', fontSize:14}}>Ultima settimana</Text>
        
        <View style={[(this.state.coloreSettimana6 === 'verde') ? styles.CircleShapeView1OK : (this.state.coloreSettimana6 === 'rosso') ? styles.CircleShapeView1ERRORE : styles.CircleShapeView1VUOTO]}>
          <Text onPress = {() => this.goToHistory6()} >{date-6}</Text>
        </View>
        <View style={[(this.state.coloreSettimana5 === 'verde') ? styles.CircleShapeView2OK : (this.state.coloreSettimana5 === 'rosso') ? styles.CircleShapeView2ERRORE : styles.CircleShapeView2VUOTO]}>
          <Text onPress = {() => this.goToHistory5()} >{date-5}</Text>
        </View>
        <View style={[(this.state.coloreSettimana4 === 'verde') ? styles.CircleShapeView3OK : (this.state.coloreSettimana4 === 'rosso') ? styles.CircleShapeView3ERRORE : styles.CircleShapeView3VUOTO]}>
          <Text onPress = {() => this.goToHistory4()} >{date-4}</Text>
        </View>
        <View style={[(this.state.coloreSettimana3 === 'verde') ? styles.CircleShapeView4OK : (this.state.coloreSettimana3 === 'rosso') ? styles.CircleShapeView4ERRORE : styles.CircleShapeView4VUOTO]}>
          <Text onPress = {() => this.goToHistory3()} >{date-3}</Text>
        </View>
        <View style={[(this.state.coloreSettimana2 === 'verde') ? styles.CircleShapeView5OK : (this.state.coloreSettimana2 === 'rosso') ? styles.CircleShapeView5ERRORE : styles.CircleShapeView5VUOTO]}>
          <Text onPress = {() => this.goToHistory2()} >{date-2}</Text>
        </View>
        <View style={[(this.state.coloreSettimana1 === 'verde') ? styles.CircleShapeView6OK : (this.state.coloreSettimana1 === 'rosso') ? styles.CircleShapeView6ERRORE : styles.CircleShapeView6VUOTO]}>
          <Text onPress = {() => this.goToHistory1()} >{date-1}</Text>
        </View>
        <View style={[(this.state.coloreSettimana === 'verde') ? styles.CircleShapeView7OK : (this.state.coloreSettimana === 'rosso') ? styles.CircleShapeView7ERRORE : styles.CircleShapeView7VUOTO]}>
          <Text onPress = {() => this.goToHistory()} >{date}</Text>
        </View>

        {/* <Text style={{position:'absolute',top:230,fontFamily:'Arial', fontSize:14,color:'red'}}>Vedi calendario completo</Text>
        <Text style={{position:'absolute',top:228,left:170,fontFamily:'Arial', fontSize:16,color:'red'}} onPress={() => this.goToCalendar()}>Vai</Text> */}


        <Text style={{position:'absolute',top:240,fontFamily:'Arial', fontSize:18}}>Progetti - {mioProgetto}</Text>
        <TouchableOpacity style={styles.buttonProgetti} onPress={() => this.goToProgetti()}>
           <Text style = {styles.submitButtonText}> Visualizza Progetti </Text>
        </TouchableOpacity>

         {/* -------------------------------------------------------------------- */}

        <Text style={{position:'absolute',top:350,fontFamily:'Arial', fontSize:18}}>Task - {mioTask} </Text>
        <TouchableOpacity style={styles.buttonTask} onPress={() => this.goToTask()}>
           <Text style = {styles.submitButtonText}> Visualizza Task </Text>
        </TouchableOpacity>

         {/* -------------------------------------------------------------------- */}

        <Text style={{position:'absolute',top:460,fontFamily:'Arial', fontSize:18}}>Attività</Text>
        <TouchableOpacity disabled={this.state.abilitaStartAttivita} style={this.state.abilitaStartAttivita === false ? styles.nuovaAttivita : styles.nuovaAttivitaDisabilitata } onPress={() => this.startAttivita()}>
           <Text style = {styles.submitButtonText}> Inizia  </Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={this.state.abilitaStopAttivita} style={this.state.abilitaStopAttivita === false ? styles.pausaAttivita : styles.pausaAttivitaDisabilitata } onPress={() => this.stopAttivita()}>
           <Text style = {styles.submitButtonText}> Pausa  </Text>
        </TouchableOpacity>

        {/* -------------------------------------------------------------------- */}

        <Text style={{position:'absolute',top:570,fontFamily:'Arial', fontSize:18}}>Turno</Text>
        <TouchableOpacity disabled={this.state.abilitaStartTurno} style={this.state.abilitaStartTurno === false ? styles.nuovoTurno : styles.nuovoTurnoDisabilita } onPress={() => this.startTurno()}>
           <Text style = {styles.submitButtonText}> Inizia  </Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={this.state.abilitaStopTurno} style={this.state.abilitaStopTurno === false ? styles.pausaTurno : styles.pausaTurnoDisabilita } onPress={() => this.stopTurno()}>
           <Text style = {styles.submitButtonText}> Fine  </Text>
        </TouchableOpacity>
        
      </View>
    );
  }
}

export default DetailsScreen;

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
     padding: 5,
     paddingTop: 25,
     margin: 0,
     height: 70,
     width:130,
     alignItems: 'center',
     position:'absolute',
     top:490,
     borderRadius:8
    },
    nuovaAttivitaDisabilitata:{
      backgroundColor: 'lightgrey',
      padding: 5,
      paddingTop: 25,
      margin: 0,
      height: 70,
      width:130,
      alignItems: 'center',
      position:'absolute',
      top:490,
      borderRadius:8
     },
    pausaAttivita:{
      backgroundColor: 'grey',
      padding: 5,
      paddingTop: 25,
      margin: 0,
      height: 70,
      width:130,
      alignItems: 'center',
      position:'absolute',
      top:490,
      borderRadius:8,
      left: 170
     },
     pausaAttivitaDisabilitata:{
      backgroundColor: 'lightgrey',
      padding: 5,
      paddingTop: 25,
      margin: 0,
      height: 70,
      width:130,
      alignItems: 'center',
      position:'absolute',
      top:490,
      borderRadius:8,
      left: 170
     },
    nuovoTurno: {
     backgroundColor: 'grey',
     padding: 10,
     paddingTop: 25,
     margin: 0,
     height: 70,
     width:130,
     alignItems: 'center',
     position:'absolute',
     top:600,
     borderRadius:8
    },
    nuovoTurnoDisabilita: {
      backgroundColor: 'lightgrey',
      padding: 10,
      paddingTop: 25,
      margin: 0,
      height: 70,
      width:130,
      alignItems: 'center',
      position:'absolute',
      top:600,
      borderRadius:8
     },
    pausaTurno: {
      backgroundColor: 'grey',
      padding: 10,
      paddingTop: 25,
      margin: 0,
      height: 70,
      width:130,
      alignItems: 'center',
      position:'absolute',
      top:600,
      borderRadius:8,
      left: 170
     },
     pausaTurnoDisabilita: {
      backgroundColor: 'lightgrey',
      padding: 10,
      paddingTop: 25,
      margin: 0,
      height: 70,
      width:130,
      alignItems: 'center',
      position:'absolute',
      top:600,
      borderRadius:8,
      left: 170
     },
    buttonTask:{
      backgroundColor: 'grey',
      padding: 25,
      margin: 0,
      height: 70,
      width:300,
      alignItems: 'center',
      position:'absolute',
      top:380,
      borderRadius:8
    },
    buttonProgetti: {
      backgroundColor: 'grey',
      padding: 25,
      margin: 0,
      height: 70,
      width:300,
      alignItems: 'center',
      position:'absolute',
      top:270,
      borderRadius:8
    },
   CircleShapeView1OK: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: 'lightgreen',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:183,
   },
   CircleShapeView1ERRORE: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    backgroundColor: '#FF7F7F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top:183,
  },
  CircleShapeView1VUOTO: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top:183,
  },
   CircleShapeView2OK: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: 'lightgreen',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:183,
     marginLeft:40
   },
   CircleShapeView2ERRORE: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    backgroundColor: '#FF7F7F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top:183,
    marginLeft:40
  },
  CircleShapeView2VUOTO: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top:183,
    marginLeft:40
  },
   CircleShapeView3OK: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: 'lightgreen',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:183,
     marginLeft:80
   },
   CircleShapeView3ERROE: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    backgroundColor: '#FF7F7F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top:183,
    marginLeft:80
  },
  CircleShapeView3VUOTO: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top:183,
    marginLeft: 80
  },
   CircleShapeView4OK: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: 'lightgreen',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:183,
     marginLeft:120,
   },
   CircleShapeView4ERRORE: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    backgroundColor: '#FF7F7F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top:183,
    marginLeft:120,
  },
  CircleShapeView4VUOTO: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top:183,
    marginLeft: 120
  },
   CircleShapeView5OK: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: 'lightgreen',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:183,
     marginLeft:160,
     },
     CircleShapeView5ERRORE: {
      width: 30,
      height: 30,
      borderRadius: 30/2,
      backgroundColor: '#FF7F7F',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top:183,
      marginLeft:160,
      },
      CircleShapeView5VUOTO: {
        width: 30,
        height: 30,
        borderRadius: 30/2,
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top:183,
        marginLeft: 160
      },
     CircleShapeView6OK: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: 'lightgreen',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:183,
     marginLeft:200
     },
     CircleShapeView6ERRORE: {
      width: 30,
      height: 30,
      borderRadius: 30/2,
      backgroundColor: '#FF7F7F',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top:183,
      marginLeft:200
      },
      CircleShapeView6VUOTO: {
        width: 30,
        height: 30,
        borderRadius: 30/2,
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top:183,
        marginLeft: 200
      }, 
     CircleShapeView7OK: {
     width: 30,
     height: 30,
     borderRadius: 30/2,
     backgroundColor: 'lightgreen',
     justifyContent: 'center',
     alignItems: 'center',
     position: 'absolute',
     top:183,
     marginLeft:240,
     borderWidth:2,
     borderColor: 'black'
   },
   CircleShapeView7ERRORE: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    backgroundColor: '#FF7F7F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top:183,
    marginLeft:240,
    borderWidth:2,
    borderColor: 'black'
  },
  CircleShapeView7VUOTO: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top:183,
    marginLeft:240,
    borderWidth:2,
    borderColor: 'black'
  },
 })