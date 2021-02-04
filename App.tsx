import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/Login.Screen';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import ScanCodeScreen from './screens/ScanCode.Screen';
import ProjectsScreen from './screens/Projects.Screen';
import SingleProjectScreen from './screens/SingleProject.Screen';
import { Provider } from 'use-http'
import { fetchOtions } from './utils/BootstrapFetch';
import { setGlobalError, useGlobalState } from './state';
import { Alert } from 'react-native';


const Stack = createStackNavigator();

function App() {
  const [error] = useGlobalState('error');

  console.log(error)

  if (error) {
    Alert.alert(
      "Error",
      error,
      [
        { text: "Close", onPress: () => setGlobalError(null) }
      ],
      { cancelable: false }
    );
  }
  return (
    <Provider url='http://18.130.151.94/api'  options={fetchOtions}>
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name="LoginScreen" component={LoginScreen} />
            <Stack.Screen options={{ headerShown: false }} name="ProjectsScreen" component={ProjectsScreen} />
            <Stack.Screen options={{ headerShown: false }} name="SingleProjectScreen" component={SingleProjectScreen} />
            <Stack.Screen options={{ headerShown: false }} name="CodeScanScreen" component={ScanCodeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </Provider>
  );
}

export default App;