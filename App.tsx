import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/Login.Screen';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import EvaMapping from '@eva-design/eva/mapping';
import ScanCodeScreen from './screens/ScanCode.Screen';
import ProjectsScreen from './screens/projects/Projects.Screen';
import SingleProjectScreen from './screens/SingleProject.Screen';
import { setGlobalError, useGlobalState } from './state';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"
import { MainScreenHeaderMenu } from './components/MainScreenHeaderMenu';
import { Provider as PaperProvider } from 'react-native-paper';
import { ScreensEnum } from './utils/ScreensEnum';
import SingleInputScreen from './screens/SingleInputScreen';
import { isReadyRef, navigationRef } from './utils/NavigationUtils';
import SplashScreen from 'react-native-splash-screen'
import { BRAND_BASE_COLOR } from './utils/Constants';

const Stack = createStackNavigator();

function App() {
  const [error] = useGlobalState('error');

  React.useEffect(() => {
    SplashScreen.hide();
    return () => {
      isReadyRef.current = false
    };
  }, []);

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
  const mapping = { ...EvaMapping }
  mapping.components.Button.appearances.filled.variantGroups.status.primary.backgroundColor = BRAND_BASE_COLOR
  mapping.components.Button.appearances.filled.variantGroups.status.primary.borderColor = BRAND_BASE_COLOR
  mapping.components.Button.appearances.filled.variantGroups.status.primary.state.active.backgroundColor = BRAND_BASE_COLOR
  mapping.components.Button.appearances.filled.variantGroups.status.primary.state.active.borderColor = BRAND_BASE_COLOR
  return (
    <PaperProvider>
      <ApplicationProvider {...eva} mapping={mapping} theme={eva.light}>
        <NavigationContainer ref={r => navigationRef.current = r}>
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
            <Stack.Screen
              options={{
                headerLeft: ({ onPress }) => {
                  return (<TouchableOpacity onPress={onPress}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons style={{ color: BRAND_BASE_COLOR }} name="md-chevron-back" size={30} />
                      <Text style={{ fontSize: 14, color: BRAND_BASE_COLOR, fontWeight: 'bold' }}>Projects</Text>
                    </View>
                  </TouchableOpacity>);
                },
                headerTitle: '',
              }}
              name={ScreensEnum.SingleProjectScreen}
              component={SingleProjectScreen}
            />
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