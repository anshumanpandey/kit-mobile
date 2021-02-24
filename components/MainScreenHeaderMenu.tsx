import * as React from 'react';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { Button, Paragraph, Menu, Divider, Provider } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { logout } from '../state';
import { resetToLoginScreen } from '../utils/NavigationUtils';
import { useNavigation } from '@react-navigation/native';

export const MainScreenHeaderMenu = () => {
  const navigation = useNavigation()

  const [isVisible, setVisible] = React.useState(false)

  const _openMenu = () => setVisible(true);

  const _closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={isVisible}
      onDismiss={_closeMenu}
      anchor={
        <TouchableOpacity style={{ flexGrow: 1, justifyContent: "center" }} onPress={_openMenu}>
          <EntypoIcon style={{ paddingHorizontal: 10 }} name="dots-three-vertical" size={25} />
        </TouchableOpacity>
      }
    >
      <Menu.Item
        onPress={() => {
          logout()
          resetToLoginScreen(navigation)
        }}
        title="Logout" />
    </Menu>
  );
}