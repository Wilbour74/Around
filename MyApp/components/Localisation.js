import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import RNPickerSelect from 'react-native-picker-select';
import {useNavigation} from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

const Localisation = () => {
    const [location, setLocation] = useState([]);
    const [locationPermissionStatus, setLocationPermissionStatus] = useState(null);
    const [places, setPlaces] = useState([]);
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');

    const [selectedValue, setSelectedValue] = useState(null);
    const navigation = useNavigation();

    

    const categories = [
        {value: "4bf58dd8d48988d1e4931735", label: "Bowling - Salle d'arcade 🎳🏓"},
        {value: "4bf58dd8d48988d1e2931735", label: "Galleries d'art 🖼️"},
        {value: "52e81612bcbc57f1066b79e6", label: "Laser Games 🔫"},
        {value: "4bf58dd8d48988d181941735", label: "Musée 🏛️"},
        {value: "4bf58dd8d48988d193941735", label: "Parc aquatique 🌊"},
        {value: "4bf58dd8d48988d17b941735", label: "Zoo 🦁"},
        {value: "52f2ab2ebcbc57f1066b8b37", label: "Studio de musique 🎶"},
        {value: "5f2c2834b6d05514c704451e", label: "Escape Game 🧩"},
        {value: "4bf58dd8d48988d17f941735", label: "Cinéma 🎬"},
        {value: "52f2ab2ebcbc57f1066b8b20", label: "Salon de piercings/tatouages 💉"},
        {value: "4bf58dd8d48988d16e941735", label: "Fast Food 🍔"},
        {value: "4d4b7105d754a06374d81259", label: "Restaurants 🍽️"},
        {value: "5109983191d435c0d71c2bb1", label: "Parc d'attractions 🎢"}
    ]

    useEffect(() => {
        const getLocationPermission = async () => {
            console.log("Demande de permissions pour la localisation...");
            const { status } = await Location.requestForegroundPermissionsAsync();
            console.log("Permission status pour la localisation:", status);
            setLocationPermissionStatus(status);

            if(status === 'granted') {
                console.log('Permission accordée pour la localisation');
                const currentLocation = await Location.getCurrentPositionAsync();
                console.log('Current location', currentLocation);
                setLocation(currentLocation);
                setLatitude(currentLocation.coords.latitude.toString());
                setLongitude(currentLocation.coords.longitude.toString());
            } else{
                console.log("Permission non accordée");
                Alert.alert('Permission non accordée', 'Vous devez accorder la permission d\'accéder à la localisation.');
            }
        };

    

        getLocationPermission();
    }, []);

    

    const fetchPlaces = async (selectedCategory) => {
        const options = {
            method: "GET",
            headers: {
                'Authorization' : 'fsq3ExcT7wirz5kEMcF5y3geQU6X7DqKhQCLOUqf/PCrcZs=',
                'accept': 'application/json'
            }
        }
        
        let url = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}`
        
        if(selectedCategory){
            url += `&categories=${selectedCategory}&sort=DISTANCE`;
        }   
        console.log(url);


        const response = await fetch(url , options);
        const result = await response.json();
        console.log(result.results.location);
        setPlaces(result.results);
     };

     const getClosedStatus = (status) => {
        switch (status) {
            case 'LikelyOpen':
              return 'Probablement ouvert';
            case 'VeryLikelyOpen':
              return 'Très probablement ouvert';
            case 'Unsure':
              return 'Incertain';
            default:
              return 'Statut inconnu';
          }
     }

     const getStatusStyle = (status) =>{
        switch (status) {
            case 'LikelyOpen':
              return { color: 'orange' };
            case 'VeryLikelyOpen':
              return { color: 'green' };
            case 'Unsure':
              return { color: 'red' };
            default:
              return { color: 'black' };
          }
     }

    
     return (
        
        <View style={{ flex: 1, padding: 20, backgroundColor: "#ffeed3" }}>
            {latitude ? (
                <View style={{ marginTop: 50}}>
                    <Text style={{textAlign: "center", fontSize: 22, fontWeight: "bold"}}>Retrouve ce qu'il y'a autour de toi</Text>
                    <View style={{borderWidth: 2, marginTop: 50,padding: 10, borderRadius: 10}}>
                    <RNPickerSelect
                        placeholder={{ label: "Choisis une catégorie  	                                    🔍", value: null }}
                        items={categories}
                        onValueChange={(value) => setSelectedValue(value)}
                        value={selectedValue}
                    />
                    </View>
                    <TouchableOpacity style={{alignSelf: 'flex-end', marginTop: 15, borderWidth: 2, padding: 8, borderRadius: 10, backgroundColor: "black"}}>
                        <Text onPress={() => fetchPlaces(selectedValue)} style={{color: "white"}}>Rechercher 🔍</Text>
                    </TouchableOpacity>
                </View>
                
            ):(
                <Text style={{ marginTop: 100 }}>Récupération de la position en cours...</Text>  
            )}
            {}
            <FlatList
                data={places}
                keyExtractor={(item) => item.fsq_id}
                renderItem={({ item }) => (
                    <View style={styles.div}>
                        <TouchableOpacity style={styles.content} onPress={() => navigation.navigate('Event', {eventId : item.fsq_id} )}>
                            <Text style={{fontWeight: "bold"}}>Nom: {item.name}</Text>
                            <Text style={{fontStyle: "italic"}}>Distance: {item.distance/ 1000} km</Text>
                            <Text style={getStatusStyle(item.closed_bucket)}>
                                Statut d'ouverture: {getClosedStatus(item.closed_bucket)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                style={{ marginTop: 20 }}
            />
            <Button title="Voir ton agenda" onPress={() => navigation.navigate('Agenda')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    categorySelectorContainer: {
        marginTop: 100,
    },
    heading: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    selectedValueText: {
        marginVertical: 10,
        fontSize: 16,
        color: '#555',
    },
    loadingText: {
        marginTop: 100,
        fontSize: 16,
        color: '#888',
    },
    flatList: {
        marginTop: 20,
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemContent: {
        borderWidth: 2,
        borderColor: 'black',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    itemText: {
        fontSize: 14,
        color: '#333',
    },
    navigationButtons: {
        marginTop: 20,
    },

    div:{ 
        padding: 20, 
        borderWidth: 1, 
        shadowColor: '#000',
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84, elevation: 5,
        borderColor: "#f3d9ae" 
    }
});

export default Localisation;
