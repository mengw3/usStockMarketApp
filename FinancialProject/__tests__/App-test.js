/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});

// test('renders App correctly', async () => {
//   const tree = renderer.create(
//     <App />
//   ).toJSON();
//   expect(tree).toMatchSnapshot();
// })

// test("renders correctly", () => {

//   const tree = renderer.create(<App />);
//   const instance = tree.getInstance();
//   const state = filterKeys(instance.state.nav);

//   expect(state).toMatchSnapshot();
// });

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