import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Homepage from './screens/Homepage';
import Chatscreen from './screens/Chatscreen';
import Messagescreen from './screens/Messagescreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GlobalState from './context';
const Stack = createNativeStackNavigator()

export default function App() {

  return (
    <GlobalState>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Homepage'
            component={Homepage}
            options={{ headerShown: false }} />
          <Stack.Screen
            name='Chatscreen'
            component={Chatscreen} />
          <Stack.Screen
            name='Messagescreen'
            component={Messagescreen} />
        </Stack.Navigator>

      </NavigationContainer>
      <StatusBar hidden />
    </GlobalState>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
