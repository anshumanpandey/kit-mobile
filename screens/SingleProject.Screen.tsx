import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Alert, Image } from 'react-native';
import { Project, WithSubitem } from '../interfaces/Project.interface';
import { ScannedCode } from '../interfaces/ScanedCode';
import { BaseDateFormat } from '../utils/DateFormat';
import { ScreensEnum } from '../utils/ScreensEnum';
import useStreamFetch from '../utils/useStreamFetch';

enum CHECK_STATE {
  "CHECK_OUT",
  "CHECK_IN"
}

const Item = ({ item, isScanned, onProductScanned, disabled = false, checkingState }: { checkingState: CHECK_STATE,disabled: boolean,item: WithSubitem, isScanned: boolean, onProductScanned: (e: ScannedCode) => void }) => {
  const navigation = useNavigation();

  let tagColor = "#ffc107"
  if (item.status == "success") tagColor = "#28a745"
  if (item.status == "danger") tagColor = "#dc3545"
  if (item.status == "warning") tagColor = "#4f4f4f"

  console.log(item.barcode_url)

  return (
    <View
      style={{ flex: 0.5, backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Image
          resizeMode="contain"
          style={{ width: 60, marginLeft: '5%' }}
          source={{ uri: item.pictureurl || "https://static.thenounproject.com/png/145280-200.png"}}
        />
        <View style={{ flexGrow: 1, borderBottomColor: '#00000035', borderBottomWidth: 1, marginTop: 'auto', padding: '3%' }}>
          <Text style={{ fontSize: 24 }}>{item.make} - {item.model}</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ alignSelf: "baseline",marginLeft: '2%', backgroundColor: item.status_color, padding: '2%', borderRadius: 5 }}>
              <Text style={{ color: 'white'}}>{item.status_text}</Text>
            </View>
            <View>
              <Image
                resizeMode="contain"
                style={{ width: 60, height: 60,marginLeft: '5%' }}
                source={{ uri: item.barcode_url }}
              />
              <Text>{item.barcode_no}</Text>
            </View>
          </View>
        </View>
      </View>
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
  const [project, setProject] = useState<Project>()

  const { loading, error, doRequest } = useStreamFetch()

  const updateCurrentProject = () => {
    doRequest("/projects", { method: 'get' })
    .then((projects) => {
      const found = projects.find(p => p.id == route.params?.project.id)
      if (found) {
        setProject({ ...found })
      }
    })
  }

  useFocusEffect(
    React.useCallback(() => {
      if (!project && route.params?.project) {
        setProject(route.params?.project)
      }
      if (route.params?.project) {
        updateCurrentProject()
      }
    }, [])
  );
  
  const { addItem, isScanned, areAllItemsScanned } = UseScannedItemsState()
  const [checkState, setCheckState] = useState<CHECK_STATE>(CHECK_STATE.CHECK_OUT)

  const renderItem = ({ item }: { item: WithSubitem }) => {
    return (
      <Item
        checkingState={checkState}
        disabled={false}
        item={item}
        isScanned={isScanned(item, checkState)}
        onProductScanned={(scannedcode) => {
            
        }}
      />
    )
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={(props) => {
          return (
            <>
              <View style={{ padding: '3%', backgroundColor: 'white' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{getCheckStateName(checkState)} Project</Text>
              </View>
              <View>
                <Text style={{ padding: '3%',fontSize: 16, opacity: 0.8 }}>INFO</Text>
                  <View style={{ padding: '2%',backgroundColor: 'white',paddingBottom: '2%', borderBottomWidth: 1, borderBottomColor: '#00000040', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, color: '#000000' }}>Start Date</Text>
                    <Text style={{ fontSize: 16, color: '#00000095' }}>{BaseDateFormat(project?.start_date)}</Text>
                  </View>

                  <View style={{ padding: '2%',backgroundColor: 'white',paddingBottom: '2%', borderBottomWidth: 1, borderBottomColor: '#00000040', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, color: '#000000' }}>End Date</Text>
                    <Text style={{ fontSize: 16, color: '#00000095' }}>{BaseDateFormat(project?.end_date)}</Text>
                  </View>

                  <View style={{ padding: '2%',backgroundColor: 'white',paddingBottom: '2%', borderBottomWidth: 1, borderBottomColor: '#00000040', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, color: '#000000' }}>Shipping Date</Text>
                    <Text style={{ fontSize: 16, color: '#00000095' }}>{BaseDateFormat(project?.shipping_date)}</Text>
                  </View>

                  <View style={{ padding: '2%',backgroundColor: 'white',paddingBottom: '2%', borderBottomWidth: 1, borderBottomColor: '#00000040', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, color: '#000000' }}>Expected Return Date</Text>
                    <Text style={{ fontSize: 16, color: '#00000095' }}>{BaseDateFormat(project?.expected_return_date)}</Text>
                  </View>


                  <TouchableOpacity
                    onPress={() => {
                      const params = { project: project, headerTitle: "Edit Project Code", apiEndpoint: "tracking_number", inputVal: project?.tracking_number }
                      navigation.navigate(ScreensEnum.SingleInputScreen, params)
                    }}
                    style={{ padding: '2%',backgroundColor: 'white',paddingBottom: '2%', borderBottomWidth: 1, borderBottomColor: '#00000040', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, color: '#000000' }}>Project Code</Text>
                    <Text style={{ fontSize: 16, color: '#00000095' }}>{project?.tracking_number}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      const params = { project: project, headerTitle: "Edit Outgoing Tracking #", apiEndpoint: "outgoing_shipping_crate", inputVal: project?.outgoing_shipping_crate }
                      navigation.navigate(ScreensEnum.SingleInputScreen, params)
                    }}
                    style={{ padding: '2%',backgroundColor: 'white',paddingBottom: '2%', borderBottomWidth: 1, borderBottomColor: '#00000040', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, color: '#000000' }}>Outgoing Tracking #</Text>
                    <Text style={{ fontSize: 16, color: '#00000095' }}>{project?.outgoing_shipping_crate}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      const params = { project: project, headerTitle: "Edit Incoming Tracking #", apiEndpoint: "incoming_shipping_crate", inputVal: project?.incoming_shipping_crate }
                      navigation.navigate(ScreensEnum.SingleInputScreen, params)
                    }}
                    style={{ padding: '2%',backgroundColor: 'white',paddingBottom: '2%', borderBottomWidth: 1, borderBottomColor: '#00000040', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, color: '#000000' }}>Incoming Tracking #</Text>
                    <Text style={{ fontSize: 16, color: '#00000095' }}>{project?.incoming_shipping_crate}</Text>
                  </TouchableOpacity>
              </View>
              <Text style={{ padding: '3%',fontSize: 18, marginTop: '3%', opacity: 0.8 }}>{generateItemsFromProject(route.params?.project).length} items to checkout</Text>
              <TouchableOpacity
                style={{ padding: '3%',backgroundColor: 'white',paddingBottom: '2%', borderBottomWidth: 1, borderBottomColor: '#00000040', flexDirection: 'row', justifyContent: 'space-between' }}
                onPress={() => {
                  navigation.navigate(ScreensEnum.CodeScanScreen, { project: project })
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Open scanner to select item...</Text>
              </TouchableOpacity>
            </>
          )
        }}
        ListEmptyComponent={() => {
          return (
            <Text style={{ fontSize: 22, textAlign: 'center', marginTop: '20%' }}>No Items Added</Text>
          )
        }}
        ListFooterComponentStyle={{ marginTop: 'auto' }}
        contentContainerStyle={{ alignItems: 'stretch', flexGrow: 1 }}
        data={generateItemsFromProject(project || route.params?.project)}
        renderItem={renderItem}
        keyExtractor={(item, idx) => `${item.id.toString()}-${idx.toString()}`}
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