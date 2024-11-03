import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, Platform, FlatList, TouchableOpacity } from 'react-native';
import * as Calendar from "expo-calendar";
import { useNavigation } from "@react-navigation/native"

const Agenda = () => {
  const [calendar, setCalendar] = useState([]);
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);

  const navigation = useNavigation();

  const FetchEvent = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      console.log('Here are all your calendars:');
      console.log({ calendars });
      console.log('YES')

      const text = "MyApp"
      const filter = calendars.filter(calendar =>  calendar.title.includes(text))
      if(filter){
        setCalendar(filter)
        const calendarId = filter[0].id;
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-12-31');

        const events = await Calendar.getEventsAsync([calendarId], startDate, endDate);

        if (events.length > 0) {
          console.log('Voici tous les évènements:', events);
          setEvents(events)
          setShowEvents(true);
        } else {
          console.log("Il n'y a pas d'événement dans cette période.");
          setShowEvents(false)
        }
      }
    }
  };

  useEffect(() => {
      FetchEvent();
      }, []);

    const deleteEvent = async (itemId) => {
        try{
          const suppression = await Calendar.deleteEventAsync(itemId)
          console.log("Suppression faite")
          FetchEvent()
        }
        catch(e){
          console.log(e);
        }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR'); // Change 'fr-FR' to your desired locale
    };
    
return (
    <View style={styles.container}>
    <View>
      <Text style={{fontSize: 25, marginLeft: 30, fontWeight:"bold", marginTop: 100}}>Voici tes sorties prévues</Text>
      {showEvents ? (
        <View style={styles.eventsContainer}>
          
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title ? item.title : 'Nom non disponible'}</Text>
                  <Text style={styles.date}>Date: {formatDate(item.startDate)}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => deleteEvent(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <TouchableOpacity 
            onPress={() => navigation.navigate('Localisation')} 
            style={styles.viewEventsButton}
          >
            <Text style={styles.buttonText}>Voir les autres Evènements</Text>
          </TouchableOpacity>
        </View>
      ): (
          <View style={{alignItems: "center", justifyContent: "center", marginTop: 180}}>
            <Text style={styles.text}>Tu n'as aucun évènements de prévu organise-en un</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Localisation')} style={styles.button}>
              <Text style={styles.buttonText}>Evènements</Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
    </View>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: "#d7f9f9"
  },
  text:{
    textAlign: "center",
    marginTop: 50,
    fontSize: 20,
    color: 'red',
  },
  button: {
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginTop: 15,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  
  buttonText: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
    fontWeight: 'bold',

  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
    marginTop: 40
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  viewEventsButton: {
    borderWidth: 2,
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 10,
    borderColor: '#4CAF50',
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    marginTop: 60
  },
  
})

export default Agenda;