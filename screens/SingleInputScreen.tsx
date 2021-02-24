import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import useStreamFetch from '../utils/useStreamFetch';
import { Project } from '../interfaces/Project.interface';
import { useFormik } from 'formik';

const handlers = {
  "tracking_number": ({ project, value }: { project: Project, value: string }) => {
    const data = new FormData()
    data.append("project_id", project.id)
    data.append("tracking_number", value)

    return {
      url: "/projects/tracking_number",
      req: {
        body: data,
        method: 'post'
      }
    }
  },
  "outgoing_shipping_crate": ({ project, value }: { project: Project, value: string }) => {
    const data = new FormData()
    data.append("project_id", project.id)
    data.append("outgoing_shipping_crate", value)

    return {
      url: "/projects/outgoing_shipping_crate",
      req: {
        body: data,
        method: 'post'
      }
    }
  },
  "incoming_shipping_crate": ({ project, value }: { project: Project, value: string }) => {
    const data = new FormData()
    data.append("project_id", project.id)
    data.append("incoming_shipping_crate", value)

    return {
      url: "/projects/incoming_shipping_crate",
      req: {
        body: data,
        method: 'post'
      }
    }
  },
}

const SingleInputScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()

  const { loading, error, doRequest } = useStreamFetch()

  const formik = useFormik({
    initialValues: {
      inputVal: '',
    },
    validate: (values) => {
      const errors: any = {}
      if (!values.inputVal) {
        errors.inputVal = "Required"
      }
      return errors
    },
    onSubmit: values => {
      const req = handlers[route.params?.apiEndpoint]({ project: route.params?.project, value: values.inputVal })

      doRequest(req.url, req.req)
      .then((r) => {
        console.log({ r })
        navigation.goBack()
      })
    },
  });

  const LeftBtn = () => {
    return (
      <TouchableOpacity
        disabled={loading}
        onPress={() => navigation.goBack()}
        style={{ flexGrow: 1, width: '100%',paddingHorizontal: '2%', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, textAlign: 'center', opacity: loading ? 0.5: 1 }}>Cancel</Text>
      </TouchableOpacity>
    )
  }

  const RightBtn = () => {
    return (
      <TouchableOpacity
        disabled={loading}
        onPress={() => formik.submitForm()}
        style={{ flexGrow: 1, width: '100%',paddingHorizontal: '2%', justifyContent: 'center'}}>
        <Text style={{ fontSize: 18, textAlign: 'center', opacity: loading ? 0.5: 1 }}>Save</Text>
      </TouchableOpacity>
    )
  }
    
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.inputVal) {
        formik.setFieldValue("inputVal", route.params?.inputVal)
      } else {
        formik.setFieldValue("inputVal", "")
      }      
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {    
      navigation.setOptions({
        headerTitle: route.params?.headerTitle || "",
        headerLeft: () => <LeftBtn />,
        headerRight: () => <RightBtn />,
      })
      
    }, [loading])
  );

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <TextInput
          multiline={true}
          numberOfLines={3}
          style={{ marginLeft: '2%' }}
          value={formik.values.inputVal}
          placeholder='Place your value here'
          onChangeText={formik.handleChange("inputVal")}
        />
        {formik.errors.inputVal && <Text style={{ color: '#fc030350', marginLeft: '2%' }}>{formik.errors.inputVal}</Text>}
      </SafeAreaView>
    </>
  );
};

export default SingleInputScreen;
