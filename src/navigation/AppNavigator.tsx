import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import Home from "../screens/Home";

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(){
    return(
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
            <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}