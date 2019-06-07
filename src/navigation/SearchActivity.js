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

    // Alert su click nei Task
    getListViewItem = (item) => {  
      Alert.alert(item.name);  
    }  

    constructor(props) {
      super(props);
      //setting default state
      this.state = { isLoading: true, text: '' };
      this.arrayholder = [];
    }
   
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
    SearchFilterFunction(text) {
      //Passo il text all'inputtext
      const newData = this.arrayholder.filter(function(item) {
        //Applico il filtro
        const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        //setting the filtered newData on datasource
        //After setting the data it will automatically re-render the view
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
            style={{position:'absolute',top:110,marginLeft:20}}
            data={this.state.dataSource}
          renderItem={({item}) => <Text style={styles.item} onPress={this.getListViewItem.bind(this, item)} > *  {item.title}</Text>}
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