import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Alert, Image } from 'react-native';
import { Project, WithSubitem } from '../interfaces/Project.interface';
import { default as theme } from '../utils/custom-theme.json';
import { ScannedCode } from '../interfaces/ScanedCode';
import useFetch from 'use-http';

enum CHECK_STATE {
  "CHECK_OUT",
  "CHECK_IN"
}

const Item = ({ item, isScanned, onProductScanned, disabled = false, checkingState }: { checkingState: CHECK_STATE,disabled: boolean,item: WithSubitem, isScanned: boolean, onProductScanned: (e: ScannedCode) => void }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{ marginVertical: 8, flex: 0.5, margin: 5 }}>
      <View style={{ borderLeftColor: isScanned ? theme['color-success-600'] : theme['color-warning-600'], borderLeftWidth: 6, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexGrow: 1, borderBottomColor: '#00000035', borderBottomWidth: 1, marginTop: 'auto', padding: '3%' }}>
          <Text style={{ fontSize: 24 }}>{item.serialnumber}</Text>
          <Text style={{ fontSize: 16 }}>Purchase date {item.date_of_purchase}</Text>
          <Text style={{ fontSize: 16 }}>Warranty date {item.warranty_expiry_period}</Text>
        </View>
        <Image
          resizeMode="contain"
          style={{ width: 60 }}
          source={{ uri: item.pictureurl || "https://static.thenounproject.com/png/145280-200.png"}}
        />
      </View>
      <Button
        disabled={disabled}
        onPress={() => {
          navigation.navigate("CodeScanScreen", {
            itemToScan: item,
            onProductAdded: (scannedCode: ScannedCode) => {
              onProductScanned(scannedCode)
            }
          })
        }}>{getCheckStateName(checkingState)}</Button>
    </View>
  );
}

const generateItemsFromProject = (project: Project) => {
  return project.with_subitems.reduce<WithSubitem[]>((itemsArr, next) => {
    if (next.pivot.quantity != "1") {
      itemsArr.push(next)
    } else {
      const items = new Array<WithSubitem>(parseInt(next.pivot.quantity)).fill(next)
      itemsArr.push(...items)
    }
    return itemsArr
  }, [])
}

const projectIsCheckout = (project: Project) => project.project_barcodes.length > 0

const getCheckStateName = (checkState: CHECK_STATE) => checkState == CHECK_STATE.CHECK_OUT ? "Check Out" : "Check In"

const UseScannedItemsState = () => {
  const [scannedItems, setScannedItems] = useState<(WithSubitem & { forCheckState: CHECK_STATE })[]>([])

  const addItem = (item: WithSubitem, forCheckState: CHECK_STATE) => {
    setScannedItems(prev => {
      return prev.concat([{ ...item, forCheckState }])
    })
  }

  const isScanned = (item: WithSubitem, forCheckState: CHECK_STATE) => {
    return scannedItems.find(i => i.id == item.id && i.forCheckState == forCheckState) != undefined
  }

  const areAllItemsScanned = (forState: CHECK_STATE, items: WithSubitem[]) => {
    const checkInItems = scannedItems.filter(i => i.forCheckState == forState)
    return checkInItems.length == items.length
  }

  return {
    addItem,
    isScanned,
    areAllItemsScanned
  }
}

const SingleProjectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute()

  const { addItem, isScanned, areAllItemsScanned } = UseScannedItemsState()
  const [checkState, setCheckState] = useState<CHECK_STATE>(CHECK_STATE.CHECK_OUT)

  const { data = [], loading, error, post: sendScannedItem } = useFetch()

  useEffect(() => {
    setCheckState(projectIsCheckout(route.params?.project) ? CHECK_STATE.CHECK_OUT : CHECK_STATE.CHECK_IN)
  }, [route.params?.project])

  const renderItem = ({ item }: { item: WithSubitem }) => {
    return (
      <Item
        checkingState={checkState}
        disabled={loading}
        item={item}
        isScanned={isScanned(item, checkState)}
        onProductScanned={(scannedcode) => {
            const data = new FormData()
            data.append("project_id", route.params?.project.id)
            data.append("barcode_number", scannedcode.data)
            data.append("checkout_status_id", checkState)
            sendScannedItem('/checkout', data)
            .then((r) => {
              if (r) {
                addItem(item, checkState)
              }
            })
        }}
      />
    )
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={() => {
          return (
            <View>
              <Text style={{ fontSize: 26, textAlign: 'center' }}>{getCheckStateName(checkState)} Project</Text>
            </View>
          )
        }}
        ListFooterComponent={() => {
          return (
            <View>
              <Button disabled={loading} status={'success'} size="giant" onPress={() => {
                if (areAllItemsScanned(checkState, generateItemsFromProject(route.params?.project))) {
                  navigation.navigate('ProjectsScreen')
                } else {
                  Alert.alert(
                    "Warning",
                    "All items are not checked in yet. Do you want to proceed with the missing items?",
                    [
                      { text: 'Proceed', onPress: () => navigation.navigate('ProjectsScreen') },
                      { text: 'Cancel', style: 'cancel' }
                    ]
                  )
                }
              }}>Done</Button>
            </View>
          )
        }}
        ListEmptyComponent={() => {
          return (
            <Text style={{ fontSize: 22, textAlign: 'center', marginTop: '20%' }}>No Items Added</Text>
          )
        }}
        ListFooterComponentStyle={{ marginTop: 'auto' }}
        contentContainerStyle={{ padding: '5%', alignItems: 'stretch', flexGrow: 1 }}
        data={generateItemsFromProject(route.params?.project)}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  title: {
    fontSize: 32,
  },
});

export default SingleProjectScreen;