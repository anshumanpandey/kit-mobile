import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, FlatList, Text } from 'react-native';
import SnackBar from 'react-native-snackbar-component'
import { Project } from '../../interfaces/Project.interface';
import { requestLocationPermission, setGpsIsDisabled, showDisableLocationMessage, updateUserLocation, useGlobalState } from '../../state';
import useStreamFetch from '../../utils/useStreamFetch';
import { ProjectsListItem } from './ProjectsListItem';

const ProjectsScreen = () => {
  const [gpsDisabled] = useGlobalState('gpsDisabled');
  const { data = [], loading, error, doRequest: getProjects } = useStreamFetch<Project[]>()

  useFocusEffect(
    React.useCallback(() => {
      getProjects('/projects')
      requestLocationPermission()
      updateUserLocation()
    }, [])
  );

  const renderItem = ({ item }: { item: Project }) => (
    <ProjectsListItem {...item} />
  );

  return (
    <SafeAreaView pointerEvents="auto" style={{ flexGrow: 1 }}>
      <FlatList
        ListEmptyComponent={() => <Text style={{ textAlign: 'center', fontSize: 20, marginTop: '40%' }}>No projects to show</Text>}
        refreshing={loading}
        onRefresh={() => null}
        pointerEvents={"auto"}
        contentContainerStyle={{ alignItems: 'stretch', paddingBottom: 250 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <SnackBar
        visible={gpsDisabled == true}
        textMessage="Your GPS is disabled"
        actionHandler={() => setGpsIsDisabled(null)}
        actionText="Dimiss" />
    </SafeAreaView>
  );
}

export default ProjectsScreen;