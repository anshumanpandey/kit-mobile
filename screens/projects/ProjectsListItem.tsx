import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Project } from "../../interfaces/Project.interface";
import { BaseDateFormat } from "../../utils/DateFormat";
import { ScreensEnum } from "../../utils/ScreensEnum";
import AntDesignIcon from "react-native-vector-icons/AntDesign"

export const ProjectsListItem = ({ showArrowIcon = true, disabled = false,...project}: Project & { showArrowIcon?: boolean, disabled?: boolean }) => {
    const navigation = useNavigation();
    const di = useWindowDimensions()
  
    let tagColor = "#ffc107"
    if (project.project_status == "success") tagColor = "#28a745"
    if (project.project_status == "danger") tagColor = "#dc3545"
    if (project.project_status == "warning") tagColor = "#4f4f4f"
  
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          navigation.navigate(ScreensEnum.SingleProjectScreen, { project })
        }}
        style={{ borderLeftColor: 'black', borderLeftWidth: 5, backgroundColor: 'white', marginVertical: 8, borderBottomWidth: 1, borderBottomColor: '#00000020', marginBottom: 5, flexDirection: 'row', height: di.height * 0.14 }}>
        <View style={{ height: '100%', width: '60%', marginTop: 'auto', padding: '3%', justifyContent: 'space-between' }}>
          <View style={{ flexGrow: 1 }}>
            <View>
              <Text style={{ fontSize: 22, color: '#000000', fontWeight: 'bold' }}>{project.title}</Text>
            </View>
  
            <View style={{ paddingBottom: '2%' }}>
              <Text style={{ fontSize: 12, color: '#00000095' }}>
                {project.client_name}
              </Text>
            </View>
  
            <View style={{ paddingBottom: '2%' }}>
              <Text style={{ fontSize: 12, color: '#00000095' }}>
                {BaseDateFormat(project.pickup_date)} / {BaseDateFormat(project.expected_return_date)}
              </Text>
            </View>
          </View>
  
        </View>
        <View style={{ flexGrow: 1, flexDirection: 'row', padding: '5%' }}>
          <View style={{ marginLeft: 'auto', borderWidth: 0.5, height: '50%', width: '30%' }}>
            <Image
              resizeMode="contain"
              style={{ flex: 1, width: undefined, height: undefined }}
              source={{ uri: project.with_subitems[0]?.pictureurl || 'https://as2.ftcdn.net/jpg/02/69/02/17/500_F_269021717_WqdoKLUupQC7WvdrgjYcDZ5m5g4DapEx.jpg' }} />
          </View>
          {showArrowIcon == true && (
              <View>
                <AntDesignIcon name="right" style={{ fontSize: 30, color: 'black' }} />
                </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };