import { CommonActions } from '@react-navigation/native';
import { ScreensEnum } from './ScreensEnum';

export const resetToLoginScreen = (navigation: any) => {

    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: ScreensEnum.LoginScreen }],
        })
    );
}