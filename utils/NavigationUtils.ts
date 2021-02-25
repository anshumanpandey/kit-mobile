import { CommonActions, NavigationContainerRef } from '@react-navigation/native';
import { ScreensEnum } from './ScreensEnum';
import * as React from 'react';

export const isReadyRef: React.MutableRefObject<boolean | null> = React.createRef<boolean>();

export const navigationRef: React.MutableRefObject<NavigationContainerRef | null> = React.createRef();

let _navigation: any = null

export const setNavigation = (n: any) => {
    _navigation = n
}

export const resetToLoginScreen = () => {
    console.log({ _navigation })
    navigationRef.current?.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: ScreensEnum.LoginScreen }],
        })
    );
}