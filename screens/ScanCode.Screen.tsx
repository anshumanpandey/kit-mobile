import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
} from 'react-native';
import { Button, Input } from '@ui-kitten/components';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { RNCamera } from 'react-native-camera';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

const ScanCodeScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const [lastCode, setLastCode] = useState<any | undefined>();
  
  useFocusEffect(
    React.useCallback(() => {
      setLastCode(undefined)
    }, [])
  );

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={{ height: '25%', justifyContent: 'center' }}>
            <Text style={{ fontSize: 35, textAlign: 'center' }}>Scan {route.params?.itemToScan.serialnumber}</Text>
          </View>
          <View style={{ height: "50%", overflow: 'hidden'}}>
            <RNCamera
              captureAudio={false}
              style={{ flexGrow: 1 }}
              onBarCodeRead={(d) => console.log(d)}
              onGoogleVisionBarcodesDetected={(d) => {
                if (!lastCode && d.barcodes.length != 0 && d.barcodes[0].format != "None") {
                  setLastCode(d.barcodes[0])
                  route.params?.onProductAdded(d.barcodes[0])
                  navigation.goBack()
                }
              }}
            />
          </View>
          <View style={{ height: '25%'}}>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>Place the code in front of the image</Text>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>Ensure have a good source of light and focus the code correctly</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default ScanCodeScreen;
