import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TabView, Tab } from '@ui-kitten/components';
import useAxios from 'axios-hooks';
import React, { useState } from 'react';
import { Image, SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity, useWindowDimensions } from 'react-native';
import { parseISO, lightFormat } from 'date-fns'
import { Project, WithSubitem } from '../interfaces/Project.interface';
import useFetch from 'use-http';


const Item = (project: Project) => {
  const navigation = useNavigation();
  const di = useWindowDimensions()

  return (
    <TouchableOpacity
      //disabled={project.project_status != "Live"}
      onPress={() => {
        navigation.navigate("SingleProjectScreen", { project })
      }}
      style={{ marginVertical: 8, borderWidth: 1, borderColor: '#00000020', margin: 5, flexDirection: 'row', height: di.height * 0.25 }}>
      <View style={{ backgroundColor: '#00000010', height: '100%',width: '60%',marginTop: 'auto', padding: '3%', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ fontSize: 24, color: '#00000095' }}>{project.title}</Text>

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

        <Text style={{ fontSize: 12, color: '#00000095' }}>Created {lightFormat(parseISO(project.created_at), 'yyyy-MM-dd')}</Text>
      </View>
      <Image
        style={{ width: '40%' }}
        source={{ uri: 'https://as2.ftcdn.net/jpg/02/69/02/17/500_F_269021717_WqdoKLUupQC7WvdrgjYcDZ5m5g4DapEx.jpg' }} />
    </TouchableOpacity>
  );
};

const isFutureProject = (p: Project) => p.status == "1"
const isLiveProject = (p: Project) => p.status == "0"
const isArchivedProject = (p: Project) => p.status == "2"

const ProjectsScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data = [], loading, error, get: getProjects } = useFetch<Project[]>()

  useFocusEffect(
    React.useCallback(() => {
      getProjects('/projects')
    }, [])
  );

  const renderItem = ({ item }: { item: Project }) => (
    <Item {...item} />
  );

  const TabTitle = ({ label }: { label: string }) => (
    <Text style={{ fontSize: 18 }}>{label}</Text>
  );

  return (
    <SafeAreaView pointerEvents="auto">
      <TabView
        selectedIndex={selectedIndex}
        onSelect={index => setSelectedIndex(index)}>
        <Tab style={{ height: 50 }} title={() => <TabTitle label={"Live"} />}>
          <FlatList
            ListEmptyComponent={() => <Text style={{ textAlign: 'center', fontSize: 20, marginTop: '40%' }}>No projects to show</Text>}
            refreshing={loading}
            onRefresh={() => null}
            contentContainerStyle={{ padding: '5%', alignItems: 'stretch', paddingBottom: 250 }}
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
            contentContainerStyle={{ padding: '5%', alignItems: 'stretch', paddingBottom: 250 }}
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
            contentContainerStyle={{ padding: '5%', alignItems: 'stretch', paddingBottom: 250 }}
            data={data.filter(isArchivedProject)}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </Tab>
      </TabView>


    </SafeAreaView>
  );
}

export default ProjectsScreen;