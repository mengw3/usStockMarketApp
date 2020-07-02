import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ImageBackground,
  FlatList,
} from 'react-native';

import { Card, CardTitle, CardContent, CardAction, CardButton } from 'react-native-material-cards'

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default class HomeScreen extends React.Component {

  /*
  constructor
  */
  constructor(props){
    super(props);
    this.state ={
        isLoading: true,
        dataSource: []
    }
  }

  /*
  Show the layout of Home Screen.
  */
  render() {

    // data = this.setupData();

    return (
        // console.log(this.state.closePrice),
        console.disableYellowBox = true,
        <View style={{flex: 1}}>
        <ImageBackground source={require('../images/background.jpg')}  style={{width: screenWidth, height: screenHeight}}>
            {/* {this.renderHeader()} */}
            {this.renderList()}
        </ImageBackground>
        </View>
    );
  }

  setupData() {
    fetch('http://127.0.0.1:5000/api/stock_list')
      .then((response) => response.json())
      .then((result) => {
        this.setState({
            isLoading: false,
            dataSource: result,
        });
        return result;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /*
  Show the layout of Header part.
  */
  renderHeader() {
    return (
      <View style={styles.header}>
          <Text style={styles.headerTitle}>Stock List</Text>
      </View>
    );
  }

  renderList() {
    this.setupData()
    // console.log(this.state.dataSource)
    return (
        <View style={{marginBottom: 180, paddingTop:10}}>
            <FlatList
            data={this.state.dataSource}
            keyExtractor={item => item.stock_symbol}
            renderItem={({item}) => 
                <Card style={{backgroundColor: `rgba(0, 0, 77, 0.2)`}}>
                    <CardTitle
                        title={item.stock_name}
                        subtitle={item.stock_symbol}
                    />
                    <CardContent 
                        textStyle={[styles.contentPrice, {color: item.color}]}
                        text={item.close_price}
                    />
                    <CardAction 
                        separator={true} 
                        inColumn={false}>
                        <CardButton
                        onPress={() => {this.props.navigation.navigate('StockInfo', {
                          symbol: item.stock_symbol,
                          name: item.stock_name,
                          });
                        }}
                        title="Info"
                        color="#62698d"
                        />
                        <CardButton
                        onPress={() => {this.props.navigation.navigate('StockData', {
                          symbol: item.stock_symbol,
                          name: item.stock_name,
                          color: item.color,
                          price: item.close_price,
                          difference: item.difference,
                          });
                        }}
                        title="Chart"
                        color="#62698d"
                        />
                        <CardButton
                        onPress={() => {this.props.navigation.navigate('StockModel', {
                          symbol: item.stock_symbol,
                          name: item.stock_name,
                          price: item.close_price,
                          });
                        }}
                        title="Model"
                        color="#62698d"
                        />
                    </CardAction>
                </Card>
                }
            />
        </View>
    );
  }
}

/*
styles
*/
const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    flexDirection: 'row',
    marginTop: 50,
    marginBottom: 10,
    color: '#3d3d5c',
    fontSize: 30,
    fontWeight: 'bold',
  },
  contentPrice: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    marginBottom: 10,
    color: '#8585ad',
    fontSize: 20,
  },
});