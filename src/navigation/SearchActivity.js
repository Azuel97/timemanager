import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, Alert } from 'react-native'
// Importo lo schema, il model ed il controller
import Database from '../store/index'
import ProgettiService from '../store/controllers/ProgettiController'
import ProgettiModel from '../store/models/ProgettiModel'

let progetti = ''
let datiTro
let progettoPassato
let mioID
let arrayTask = []

class SearchActivity extends React.Component {

    // Modifica la navigationBar
    static navigationOptions = ({ navigation }) => ({
      title: 'TimeManager',
      headerTintColor: 'black',
      headerStyle: {
        backgroundColor: 'lightgrey'
      }
    });

    // Setto lo state che conterrà i dati da visualizzare nella lista
    constructor(props) {
      super(props);
      this.state = {
        data: [],
      };
    }

    componentDidMount() {
      arrayTask = []
    }

    // Azione sul ckick degli item della Flatlist, ritorno alla Home
    getListViewItem = (item) => {  
      // Controllo il valore passato per scegliere quale parametro ritornare all activity
      if(datiTro === 0){
        this.props.navigation.navigate('Details', {
          myProject: item,
        });
      }else{
        this.props.navigation.navigate('Details', {
          myTask: item,
        });
      }
    }

    // Funzione di filtraggio all'interno dell'array, su cui ci sono all'interno
    // tutti i dati recuperati dalla fetch
    SearchFilterFunction(text) {
      // Passo il text all'inputtext
      const newData = this.state.data.filter(function(item) {
        // Applico il filtro
        const itemData = item ? item.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        // Inserscio i dati filtrati al'interno del datasource
        // E dopo vengono ri-renderizzati
        dataSource: newData,
        text: text,
      });
    }

    findTask() {
      return fetch('http://localhost:3031/task?assignee_id='+mioID)
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log(responseJson.description)
            count = responseJson.length
            //console.log(count)
            for(let i=0; i<count; i++){
              //this.state.data.push(responseJson[i].description)
              arrayTask.push(responseJson[i].description +' -> '+ responseJson[i].due_date)
            }
            //console.log(this.state.data)
            //console.log(arrayTask)
        })
        .catch((error) => {
            console.error(error);
        });
    }
  
    render() {

      // Recupero il valore di controllo
      const { navigation } = this.props;
      datiTro = navigation.getParam('visualizza', '');
      // Recupero il progetto scelto
      progettoPassato = navigation.getParam('progetto','')
      mioID = navigation.getParam('id','')

      // Controllo il valore passato per determinare quali dati devo recuperare
      if(datiTro === 0){
        progetti = ProgettiService.findAllProgetti()
        this.state.data = progetti
        console.log(progetti)
      }else{
        // taskRicercati = ProgettiService.findTask(progettoPassato)
        // this.state.data = taskRicercati
        // console.log(taskRicercati)
        this.findTask()
        taskTrovati = arrayTask
        console.log(taskTrovati)
        this.state.data = taskTrovati
      }

      return (
        <View>
          <TextInput style = {styles.input}
                 underlineColorAndroid = "transparent"
                 placeholder = "Search"
                 placeholderTextColor = "#434A53"
                 autoCapitalize = "none"
                 //onChangeText = {this.handleEmail}
                 onChangeText={text => this.SearchFilterFunction(text)}
                 value={this.state.text}/>
          
          <Text style={{position:'absolute',top:80,fontFamily:'Arial', fontSize:16, marginLeft:20}}>Lista Task : </Text>
  
          {/* -- Uso della FlatList -- */}
          
          <FlatList
            style={{position:'absolute',top:110}}
            data={this.state.data}
            renderItem={({item}) => <Text style={styles.item} onPress={this.getListViewItem.bind(this, item)} > • {item}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
  
        </View>
      );
    }
  }

  export default SearchActivity;

 const styles = StyleSheet.create({
    input: {
       margin: 15,
       height: 40,
       borderColor: 'grey',
       borderWidth: 1,
       paddingLeft: 15
    },
    item: {
     padding: 10,
     fontSize: 16,
     height: 44,
   },
 })