import store from './src/store';
import {Provider} from 'react-redux';
import {persistor} from './src/store';
import {StatusBar} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import MainStackNavigation from './src/navigation/MainStackNavigation';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <StatusBar barStyle={'default'} />
          <MainStackNavigation />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
