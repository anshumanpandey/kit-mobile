import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  Image,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { RNCamera } from 'react-native-camera';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { codeIsSave, saveScannedCode, useGlobalState } from '../state';
import useStreamFetch from '../utils/useStreamFetch';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IoniconsIcon from "react-native-vector-icons/Ionicons"


const ScanCodeScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const [lastCode, setLastCode] = useState<any | undefined>();
  const [scanProcessStarted, setScanProcessStarted] = useState<boolean>(false);

  const { data = [], loading, error, doRequest: sendScannedItem } = useStreamFetch()

  const [lat] = useGlobalState("lat")
  const [long] = useGlobalState("long")

  useFocusEffect(
    React.useCallback(() => {
      setLastCode(undefined)
    }, [])
  );

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={{ height: "80%", overflow: 'hidden' }}>
            <RNCamera
              captureAudio={false}
              style={{ flexGrow: 1 }}
              onBarCodeRead={(d) => {
                //console.log({ onBarCodeRead: d })
              }}
              onGoogleVisionBarcodesDetected={async (d) => {
                console.log({ onGoogleVisionBarcodesDetected: d.barcodes })
                if (scanProcessStarted == true) return
                setScanProcessStarted(true)

                if (loading) return
                if (lastCode) return
                if (d.barcodes.length == 0) {
                  setScanProcessStarted(false)
                  return
                } 
                if (d.barcodes[0].format == "None") {
                  setScanProcessStarted(false)
                  return
                }

                const scannedCode = d.barcodes[0]

                const isSaved = await codeIsSave(scannedCode.data)
                console.log({ isSaved })
                if (isSaved) return

                setLastCode(d.barcodes[0])

                const data = new FormData()
                data.append("project_id", route.params?.project.id)
                data.append("barcode_number", scannedCode.data)
                data.append("latitude", lat)
                data.append("longitude", long)

                sendScannedItem('/checkout', { body: data, method: 'post' })
                  .then(async (r) => {
                    await saveScannedCode(scannedCode.data)
                    return r
                  })
                  .then((r) => {
                    setLastCode(undefined)
                    setScanProcessStarted(false)
                    navigation.goBack()
                    Alert.alert("Success", r?.message || "Code Scanned")
                  })
                  .catch(() => {
                    console.log({ scannedCode })
                    setScanProcessStarted(false)
                    setLastCode(undefined)
                  })
              }}
            />
          </View>
          <View style={{ height: '25%' }}>
            <View style={{ flexDirection: 'row', padding: '5%' }}>
              <View>
                <Image
                  style={{ width: 60, height: 60 }}
                  source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/UPC-A-036000291452.svg/1200px-UPC-A-036000291452.svg.png" }} />
              </View>
              <View style={{ paddingHorizontal: '5%' }}>
                <Text style={{ fontSize: 20 }}>Scanning...</Text>
                <Text style={{ fontSize: 16, color: '#00000050' }}>Ensure have a good source of light and focus the code correctly</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{ fontSize: 28, textAlign: 'center' }}>Exit</Text>
            </TouchableOpacity>
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
