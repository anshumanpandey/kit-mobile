import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
} from 'react-native';
import { Button, Input } from '@ui-kitten/components';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import { setSessionToken, useGlobalState } from '../state';
import useFetch from 'use-http';
import useStreamFetch from '../utils/useStreamFetch';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [sessionToken] = useGlobalState("sessionToken")

  const { loading, error, doRequest } = useStreamFetch()
  

  useFocusEffect(
    React.useCallback(() => {
      if (sessionToken){
        navigation.navigate('ProjectsScreen')
      }
    }, [sessionToken])
  );

  const formik = useFormik({
    initialValues: {
      username: 'richard@streamgo.co.uk',
      password: 'kit@123%',
    },
    validate: (values) => {
      const errors: any = {}
      if (!values.username) {
        errors.username = "Required"
      }
      if (!values.password) {
        errors.password = "Required"
      }

      return errors
    },
    onSubmit: values => {
      const data = new FormData()

      data.append("email", values.username)
      data.append("password", values.password)
      
      doRequest("/login", { body: data, method: "post" })
      .then((r) => {
        console.log({ login: r })
        if (r.access_token) {
          setSessionToken(r.access_token)
          navigation.navigate('ProjectsScreen')
        }
      })
    },
  });

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={{ height: '35%', justifyContent: 'center' }}>
          <Image
            resizeMode="contain"
            style={{ width: 400, height: '50%',marginLeft: 'auto', marginRight: 'auto' }}
            source={require('../images/streamGo.png')}
          />
          </View>
          <View style={{ padding: '5%'}}>
            <Input
              placeholder='Username'
              value={formik.values.username}
              status={formik.errors.username && 'danger'}
              caption={formik.errors.username}
              onChangeText={formik.handleChange("username")}
            />
            <Input
              placeholder='Password'
              secureTextEntry={true}
              value={formik.values.password}
              status={formik.errors.password && 'danger'}
              caption={formik.errors.password}
              onChangeText={formik.handleChange("password")}
            />
            <Button disabled={loading} onPress={() => formik.submitForm()}>
              Login
            </Button>
          </View>
          <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 'auto' }}>Powered by</Text>
          <Image resizeMode="contain" style={{ width: 200, height: '15%',marginLeft: 'auto', marginRight: 'auto' }} source={require('../images/streamGo.png')} />
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

export default LoginScreen;
