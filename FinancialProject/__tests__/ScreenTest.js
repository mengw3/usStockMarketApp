import 'react-native';
import React from 'react';
import HomePage from '../Screen/HomePage';
import StockInfo from '../Screen/StockInfo';
import StockData from '../Screen/StockData';
import StockModel from '../Screen/StockModel';
import NewsPage from '../Screen/NewsPage';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

test('renders HomePage correctly', async () => {
  const fetch = require('node-fetch');
  global.fetch = fetch
  global.Headers = fetch.Headers;
  const tree = renderer.create(
    <HomePage />
  ).toJSON();
  expect(tree).toMatchSnapshot();
  await new Promise((r) => setTimeout(r, 500));
})

test('renders StockInfo correctly', async () => {
    const fetch = require('node-fetch');
    global.fetch = fetch
    global.Headers = fetch.Headers;
    const tree = renderer.create(
      <StockInfo />
    ).toJSON();
    expect(tree).toMatchSnapshot();
    await new Promise((r) => setTimeout(r, 500));
})

test('renders StockData correctly', async () => {
  const fetch = require('node-fetch');
  global.fetch = fetch
  global.Headers = fetch.Headers;
  const tree = renderer.create(
    <StockData />
  ).toJSON();
  expect(tree).toMatchSnapshot();
  await new Promise((r) => setTimeout(r, 500));
})

test('renders NewsPage correctly', () => {
  const tree = renderer.create(
    <StockModel />
  ).toJSON();
  expect(tree).toMatchSnapshot();
})

test('renders NewsPage correctly', () => {
  const tree = renderer.create(
    <NewsPage />
  ).toJSON();
  expect(tree).toMatchSnapshot();
})


// // keys are date and order-of-test based, so just removed them
// const filterKeys = (state) => {
//   if (state.routes) {
//     return {
//       ...state,
//       routes: state.routes.map((route) => {
//         const { key, ...others } = route
//         return filterKeys(others);
//       }),
//     }
//   }
//   return state;
// };
