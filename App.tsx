import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/Login.Screen';
import { ApplicationProvider, Button } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import ScanCodeScreen from './screens/ScanCode.Screen';
import ProjectsScreen from './screens/Projects.Screen';
import SingleProjectScreen from './screens/SingleProject.Screen';
import { Provider } from 'use-http'
import { fetchOtions } from './utils/BootstrapFetch';
import { setGlobalError, useGlobalState } from './state';
import { Alert } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { MainScreenHeaderMenu } from './components/MainScreenHeaderMenu';
import { Provider as PaperProvider } from 'react-native-paper';
import { ScreensEnum } from './utils/ScreensEnum';
import SingleInputScreen from './screens/SingleInputScreen';

const Stack = createStackNavigator();

function App() {
  const [error] = useGlobalState('error');

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
    <PaperProvider>
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name={ScreensEnum.LoginScreen} component={LoginScreen} />
            <Stack.Screen
              options={{
                headerTitle: 'Projects',
                headerLeft: () => <></>,
                headerRight: () => (
                  <MainScreenHeaderMenu />
                ),
              }}
              name={ScreensEnum.ProjectsScreen}
              component={ProjectsScreen}
            />
            <Stack.Screen options={{ headerShown: false }} name={ScreensEnum.SingleProjectScreen} component={SingleProjectScreen} />
            <Stack.Screen options={{ headerShown: false }} name={ScreensEnum.CodeScanScreen} component={ScanCodeScreen} />
            <Stack.Screen
              options={{
                headerTitleAlign: 'center',
                headerLeftContainerStyle: { width: "20%" },
                headerRightContainerStyle: { width: "20%" }
              }}
              name={ScreensEnum.SingleInputScreen}
              component={SingleInputScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </PaperProvider>
  );
}

export default App;