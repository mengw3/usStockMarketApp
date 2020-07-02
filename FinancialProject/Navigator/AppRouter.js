import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import StockList from '../Screen/HomePage';
import StockInfo from '../Screen/StockInfo';
import StockData from '../Screen/StockData';
import StockModel from '../Screen/StockModel';
import NewsPage from '../Screen/NewsPage';

import Icon from 'react-native-vector-icons/FontAwesome';

// import { BlurView } from 'expo-blur';

const Tab = createBottomTabNavigator();

const StockListStack = createStackNavigator();

const StockListStackScreen = () => (
  <StockListStack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#6600ff',
          },
          headerTitleAllowFontScaling: true,
          headerTintColor: '#fff',
          headerTitleStyle :{
            fontWeight: 'bold',
          },
        }}
      >
      <StockListStack.Screen 
       name="StockList" 
       component={StockList} 
       options={{ 
          // headerTransparent: true,
          // headerBackground: () => (
          //   <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} />
          // ),
         title: 'STOCK LIST' 
        }}
      />
      <StockListStack.Screen 
        name="StockInfo" 
        component={StockInfo} 
        options={{ title: 'STOCK INFORMATION' }}
      />
      <StockListStack.Screen 
       name="StockData" 
       component={StockData} 
       options={{ title: 'STOCK HISTORICAL DATA' }}
      />
      <StockListStack.Screen 
       name="StockModel" 
       component={StockModel} 
       options={{ title: 'FINANCIAL MODEL ANALYSIS' }}
      />
    </StockListStack.Navigator>
)

export default () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen 
        options={{tabBarIcon: () => <Icon name="line-chart" size = {30} color="#ccccff" />}}
        name="Stock List" 
        component={StockListStackScreen} 
      />
      <Tab.Screen 
        options={{tabBarIcon: () => <Icon name="newspaper-o" size = {30} color="#ccccff" />}}
        name="News & Reports" 
        component={NewsPage} />
    </Tab.Navigator>
  </NavigationContainer>
)