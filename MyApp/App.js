import React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Localisation from './components/Localisation';
import Contact from './components/Contact';
import Agenda from './components/Agenda';
import Accueil from './components/Accueil';
import Event from './components/Event';

const Stack = createNativeStackNavigator();

export default function App(){
  
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
        name = "Accueil"
        component={Accueil}
        options={{ headerShown: false}}
        />

        <Stack.Screen
        name = "Localisation"
        component={Localisation}
        options={{ headerShown: false}}
        />

        <Stack.Screen
        name = "Contact"
        component={Contact}
        options={{ headerShown: false}}
        />

        <Stack.Screen
        name = "Agenda"
        component={Agenda}
        options={{ headerShown: false}}
        />

        <Stack.Screen
        name = "Event"
        component={Event}
        options={{ headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}