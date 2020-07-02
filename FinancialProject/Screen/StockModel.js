import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LineChart, Grid } from 'react-native-svg-charts'
import moment from "moment";

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

// Wrap and export
export default function(props) {
  const route = useRoute();
  return <ModelScreen {...props} route={route} />;
}

class ModelScreen extends React.Component {

  /*
  constructor
  */
  constructor(props) {
    super(props);
    this.state = {
        isLoading_p: true,
        dataSource_p: [],
        prediction: "",
        stockIndex_p: [],
        isLoading_c: true,
        dataSource_c: [],
        stockIndex_c: []
    };
  }

  /*
  Show the layout of Data Screen.
  */
  render() {

    const { route } = this.props;
    
    this.setupData_c(route.params.symbol);

    this.setupData_p(route.params.symbol);

    return (
      console.disableYellowBox = true,
      <View style={{flex: 1}}>
        <ImageBackground source={require('FinancialProject/images/black.jpg')}  style={{width: screenWidth, height: screenHeight}}>
            {this.renderHeader(route.params.name, route.params.symbol)}
            {/* {this.renderNewChart(route.params.symbol)} */}
            {this.renderChart()}
            {this.renderRooter(route.params.price)}
        </ImageBackground>
      </View>
    );
  }

  setupData_p(stock_name) {
    fetch('http://127.0.0.1:5000/api/stock_prediction')
      .then((response) => response.json())
      .then((result) => {
        const date = result[stock_name].index.map(element => moment(element).format("M/D"));
        this.setState({
            isLoading_p: false,
            dataSource_p: result[stock_name],
            prediction: result[stock_name + '-pred'],
            stockIndex_p: date,
        });
        return result;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setupData_c(stock_name) {
    fetch('http://127.0.0.1:5000/api/stock_original')
      .then((response) => response.json())
      .then((result) => {
        const date = result[stock_name].index.map(element => moment(element).format("M/D"));
        this.setState({
            isLoading_c: false,
            dataSource_c: result[stock_name],
            stockIndex_c: date,
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
  renderHeader(stock_name, stock_symbol) {
    return (
      <View>
        <Text style = {styles.contentTitle}>{stock_name} ({stock_symbol})</Text>
        <Text style = {[styles.content, {color: '#ffffff'}]}>Prediction Model</Text>
        <Text style = {styles.content_line}>
          <Text style = {{color: '#6666ff'}}>Blue Line</Text>
          <Text style = {{color: '#ffffff'}}> represents Real Data</Text>
        </Text>
        <Text style = {styles.content_line}>
          <Text style = {{color: '#e65c00'}}>Orange Line</Text>
          <Text style = {{color: '#ffffff'}}> represents Prediction Data</Text>
        </Text>
      </View>
    );
  }

  renderNewChart() {
    const data_temp = this.state.dataSource.data;
    const labels = this.state.stockIndex;
    const config = {
      backgroundColor: "transparent",
      line: {
        visible: true,
        strokeWidth: 1,
        strokeColor: "#4747d1"
      },
      area: {
        visible: false
      },
      tooltip: {
        visible: true,
        labelFormatter: v => v.toFixed(2),
        labelFontSize: 10,
        lineColor: "#777",
        lineWidth: 1,
        circleColor: "#4747d1",
        circleBorderColor: "#4747d1",
        circleBorderWidth: 1,
        boxColor: "#4747d1",
        boxBorderWidth: 1,
        boxBorderColor: "#777",
        boxBorderRadius: 5,
        boxPaddingY: 0,
        boxPaddingX: 0,
        labelColor: "#fff",
        labelFontSize: 20
      },
      grid: {
        visible: false,
        stepSize: 1,
        backgroundColor: "transparent",
      },
      xAxis: {
        visible: false,
        labelFontSize: 5,
        labelColor: "#4747d1"
      },
      yAxis: {
        labelFormatter: v => "$ "+ String(v),
        labelColor: "#4747d1"
      },
      area: {
        visible: false
      },
      insetY: 10,
      insetX: 10
    };
    return (
      <LineChart style={{ flex: 1, alignItems: 'center', marginBottom: 180}} config={config} data={data_temp} xLabels={labels}/>
    );
  }

  renderChart() {
    if (this.state.isLoading_p || this.state.isLoading_c) {
      return(
        <View style={{flex: 1, padding: 200}}>
          <ActivityIndicator/>
        </View>
      )
    }

    prediction_data = this.state.dataSource_p.data;
    real_data = this.state.dataSource_c.data;

    const data = [
        {
            data: prediction_data,
            svg: { stroke: '#e65c00' },
        },
        {
            data: real_data,
            svg: { stroke: '#6666ff' },
        },
    ];

    return (
      //  console.log(typeof(prediction_data[0])),
        <View>
          <LineChart
            style={{ height: 500 }}
            data={ data }
            contentInset={{ top: 50, bottom: 50 }}
          >
            <Grid />
          </LineChart>
        </View>
        
    );
  }

  renderRooter(today_price) {
    price_color = "white"
    if (Number(today_price) < Number(this.state.prediction)) {
      price_color = "green"
    }
    if (Number(today_price) > Number(this.state.prediction)) {
      price_color = "red"
    }
    return (
      <View>
        <Text style = {styles.content}>
          <Text style = {{color: '#ffffff'}}>Based on the prediction model, tomorrow's stock price will be: </Text>
          <Text style = {{color: price_color}}>${this.state.prediction}</Text>
          <Text style = {{color: '#ffffff'}}>.</Text>
        </Text>
      </View>
    );
  }

}

/*
styles
*/
const styles = StyleSheet.create({
  contentTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: 20,
  },
  content_line: {
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: 15,
  }
});