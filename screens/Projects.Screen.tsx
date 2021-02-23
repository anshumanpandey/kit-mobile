import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TabView, Tab } from '@ui-kitten/components';
import AntDesignIcon from "react-native-vector-icons/AntDesign"
import React, { useState } from 'react';
import { Image, SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity, useWindowDimensions } from 'react-native';
import { parseISO, lightFormat } from 'date-fns'
import SnackBar from 'react-native-snackbar-component'
import { Project } from '../interfaces/Project.interface';
import { requestLocationPermission, setGpsIsDisabled, showDisableLocationMessage, updateUserLocation, useGlobalState } from '../state';
import useStreamFetch from '../utils/useStreamFetch';


const Item = (project: Project) => {
  const navigation = useNavigation();
  const di = useWindowDimensions()

  return (
    <TouchableOpacity
      //disabled={project.project_status != "Live"}
      onPress={() => {
        navigation.navigate("SingleProjectScreen", { project })
      }}
      style={{ borderLeftColor: 'black', borderLeftWidth: 5, backgroundColor: 'white',marginVertical: 8, borderBottomWidth: 1, borderBottomColor: '#00000020', marginBottom: 5, flexDirection: 'row', height: di.height * 0.20 }}>
      <View style={{ height: '100%',width: '60%',marginTop: 'auto', padding: '3%', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: 12, color: '#00000095' }}>Created {lightFormat(parseISO(project.created_at), 'yyyy-MM-dd')}</Text>
          <Text style={{ fontSize: 22, color: '#000000', fontWeight: 'bold' }}>{project.title}</Text>

          <View style={{ paddingBottom: '2%', borderBottomWidth: 1, borderBottomColor: '#00000040' }}>
            <Text style={{ fontSize: 12, color: '#00000095' }}>Start Date {lightFormat(parseISO(project.start_date), 'yyyy-MM-dd')}</Text>
            <Text style={{ fontSize: 12, color: '#00000095' }}>End Date {lightFormat(parseISO(project.end_date), 'yyyy-MM-dd')}</Text>
          </View>

          <View style={{ paddingBottom: '2%', borderBottomWidth: 1, borderBottomColor: '#00000040' }}>
            <Text style={{ fontSize: 12, color: '#00000095' }}>Shipping Date {lightFormat(parseISO(project.shipping_date), 'yyyy-MM-dd')}</Text>
            <Text style={{ fontSize: 12, color: '#00000095' }}>Expected Return Date {lightFormat(parseISO(project.expected_return_date), 'yyyy-MM-dd')}</Text>
          </View>

          <Text style={{ fontSize: 12, color: '#00000095' }}>Pickup Date {lightFormat(parseISO(project.pickup_date), 'yyyy-MM-dd')}</Text>
        </View>

      </View>
      <View style={{ flexGrow: 1, flexDirection: 'row', padding: '5%' }}>
        <View style={{ marginLeft: 'auto', borderWidth: 0.5, height: '50%', width: '30%' }}>
          <Image
            resizeMode="contain"
            style={{ flex:1 , width: undefined, height: undefined }}
            source={{ uri: 'https://as2.ftcdn.net/jpg/02/69/02/17/500_F_269021717_WqdoKLUupQC7WvdrgjYcDZ5m5g4DapEx.jpg' }} />
        </View>
        <View>
          <AntDesignIcon name="right" style={{ fontSize: 30, color: 'black'}} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const isFutureProject = (p: Project) => p.status == "1"
const isLiveProject = (p: Project) => p.status == "0"
const isArchivedProject = (p: Project) => p.status == "2"


const ProjectsScreen = () => {
  const [gpsDisabled] = useGlobalState('gpsDisabled');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data = [], loading, error, doRequest: getProjects } = useStreamFetch<Project[]>()

  useFocusEffect(
    React.useCallback(() => {
      getProjects('/projects')
      requestLocationPermission()
      updateUserLocation()
    }, [])
  );

  const renderItem = ({ item }: { item: Project }) => (
    <Item {...item} />
  );

  const TabTitle = ({ label }: { label: string }) => (
    <Text style={{ fontSize: 18 }}>{label}</Text>
  );

  return (
    <SafeAreaView pointerEvents="auto" style={{ flexGrow: 1 }}>
      <TabView
        selectedIndex={selectedIndex}
        onSelect={index => setSelectedIndex(index)}>
        <Tab style={{ height: 50 }} title={() => <TabTitle label={"Live"} />}>
          <FlatList
            ListEmptyComponent={() => <Text style={{ textAlign: 'center', fontSize: 20, marginTop: '40%' }}>No projects to show</Text>}
            refreshing={loading}
            onRefresh={() => null}
            pointerEvents={"auto"}
            contentContainerStyle={{ alignItems: 'stretch', paddingBottom: 250 }}
            data={data.filter(isLiveProject)}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </Tab>
        <Tab style={{ height: 50 }} title={() => <TabTitle label={'Future'} />}>
          <FlatList
            ListEmptyComponent={() => <Text style={{ textAlign: 'center', fontSize: 20, marginTop: '40%' }}>No projects to show</Text>}
            refreshing={loading}
            onRefresh={() => null}
            pointerEvents={"auto"}
            contentContainerStyle={{ alignItems: 'stretch', paddingBottom: 250 }}
            data={data.filter(isFutureProject)}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </Tab>
        <Tab style={{ height: 50 }} title={() => <TabTitle label={'Archived'} />}>
          <FlatList
            ListEmptyComponent={() => <Text style={{ textAlign: 'center', fontSize: 20, marginTop: '40%' }}>No projects to show</Text>}
            refreshing={loading}
            onRefresh={() => null}
            pointerEvents={"auto"}
            contentContainerStyle={{ alignItems: 'stretch', paddingBottom: 250 }}
            data={data.filter(isArchivedProject)}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </Tab>
      </TabView>
      <SnackBar
        visible={gpsDisabled == true}
        textMessage="Your GPS is disabled"
        actionHandler={()=> setGpsIsDisabled(null)}
        actionText="Dimiss"/>
    </SafeAreaView>
  );
}

export default ProjectsScreen;