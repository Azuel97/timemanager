import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, Alert } from 'react-native'

class SearchActivity extends React.Component {

    // Modifica la navigationBar
    static navigationOptions = ({ navigation }) => ({
      title: 'TimeManager',
      headerTintColor: 'black',
      headerStyle: {
        backgroundColor: 'lightgrey'
      }
    });

    // Azione sul ckick degli item della Flatlist
    getListViewItem = (item) => {  
      // Passo alla activity details, passando anche come parametro aggiuntivo
      // il titolo del task selezionato
      this.props.navigation.navigate('Details', {
        myTask: item.title,
      });
    }  

    constructor(props) {
      super(props);
      // Settaggio di default
      this.state = { isLoading: true, text: '' };
      // Array su cui salvo i dati che preleverò dal json
      this.arrayholder = [];
    }
   
    // Eseguo il fetch dei dati quando viene montato la screen
    componentDidMount() {
      return fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(responseJson => {
          this.setState(
            {
              isLoading: false,
              dataSource: responseJson
            },
            function() {
              this.arrayholder = responseJson;
            }
          );
        })
        .catch(error => {
          console.error(error);
        });
    }

    // Funzione di filtraggio all'interno dell'array, su cui ci sono all'interno
    // tutti i dati recuperati dalla fetch
    SearchFilterFunction(text) {
      // Passo il text all'inputtext
      const newData = this.arrayholder.filter(function(item) {
        // Applico il filtro
        const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
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
  
    render() {
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
            style={{position:'absolute',top:110,marginLeft:10}}
            data={this.state.dataSource}
            renderItem={({item}) => <Text style={styles.item} onPress={this.getListViewItem.bind(this, item)} > ☆ {item.title}</Text>}
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