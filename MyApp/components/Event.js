import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Platform, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native"
import PagerView from 'react-native-pager-view';
import { ScrollView } from 'react-native';
const Event = ({route, navigation}) => {
    const { eventId } = route.params;
    const [place, setPlace] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [tips, setTips] = useState([]);
    const [adress, setAdresse] = useState("");
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [meteoC, setMeteoC] = useState("");
    
    useEffect(() => {
        const fetchEventData = async () => {
            try{
                const options = {
                    method: "GET",
                    headers: {
                        'Authorization' : 'fsq3ExcT7wirz5kEMcF5y3geQU6X7DqKhQCLOUqf/PCrcZs=',
                        'accept' : 'application/json'
                    }
                }


                let url = `https://api.foursquare.com/v3/places/${eventId}`;

                const response = await fetch(url, options);
                const result = await response.json();
                console.log(result)
                console.log("location", result.geocodes.main)
                setLatitude(result.geocodes.main.latitude);
                setLongitude(result.geocodes.main.longitude);
                setAdresse(result.location.formatted_address)
                setName(result.name)
                console.log(url)
                setPlace(result);

                

               

            }
            
            catch(error){
                console.error("Erreur lors de la récupération des données",error);
            }
        }
        const fetchEventPhoto = async () => {
            try{
                const options = {
                    method: "GET",
                    headers: {
                        'Authorization' : 'fsq3ExcT7wirz5kEMcF5y3geQU6X7DqKhQCLOUqf/PCrcZs=',
                        'accept' : 'application/json'
                    }
                }


                let url = `https://api.foursquare.com/v3/places/${eventId}/photos`;
                const response = await fetch(url, options);
                const result = await response.json();
                setPhotos(result);
            }
            catch(error){
                console.error("Erreur lors de la récupération des données",error);
            }
        }

        const fetchEventTips = async () => {
            try{
                const options = {
                    method: "GET",
                    headers: {
                        'Authorization' : 'fsq3ExcT7wirz5kEMcF5y3geQU6X7DqKhQCLOUqf/PCrcZs=',
                        'accept' : 'application/json'
                    }
                }
                let url = `https://api.foursquare.com/v3/places/${eventId}/tips?sort=NEWEST`;
                const response = await fetch(url, options);
                const result = await response.json();
                setTips(result);
                console.log(result);
                
            }
            catch(error){
                console.error("Erreur lors de la récupération des données",error);
            }

        }

        const fetchMeteo = async () => {

            const apiKey = "45a14e61a5a1449ab5c154250243007"


            let meteoUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;
            console.log("METEO", meteoUrl)
            const responseMeteo = await fetch(meteoUrl);
            const resultMeteo = await responseMeteo.json();
            console.log(resultMeteo)
            setMeteoC(resultMeteo.current.temp_c);
        }

        fetchEventPhoto();
        fetchEventData();
        
        fetchEventTips();
        fetchMeteo();
    }, [])

    return (
        <View style={styles.container}>
            
            <View style={styles.innerContainer}>
                
                
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Localisation")}>
                    <Text style={styles.text}>◀ Retour</Text>
                </TouchableOpacity>
                <Text style={styles.titre}>{place.name}</Text>
         
                <Text style={{fontSize: 20, marginTop: 10}}>Il y fait actuellement <Text style={{fontWeight: "bold"}}>{meteoC}°C</Text></Text>
            
                <Text style={{marginTop: 10, fontStyle: "italic", fontSize: 20}}>{adress}</Text>
    
                    {photos.length > 0 ? (
                    <PagerView initialPage={0} style={styles.pagerView}>
                        {photos.map((photo, index) => {
                            const photoUrl = `${photo.prefix}${photo.width}x${photo.height}${photo.suffix}`;
                            console.log(photoUrl)
                            return (
                                <View key={index} style={styles.page}>
                                    <Image source={{ uri: photoUrl }} style={styles.photo} />
                                </View>
                            );
                        })}
                    </PagerView>) :(
                        <View style={styles.aucuneContainer}>
                        <Text style={styles.aucune}>Aucune image trouvée 😥</Text>
                        </View>
                    )}
                    <TouchableOpacity style={{alignItems: "center", borderWidth: 2, padding: 10, marginVertical: 20, borderRadius: 10, backgroundColor: "#5779f1"}} onPress={() => navigation.navigate("Contact", {eventId, adress, name, latitude, longitude})}>
                        <Text style={{color: "white", fontWeight: "bold"}}>Créer une sortie</Text>
                    </TouchableOpacity>
                
                    
                    <View style={styles.avisContainer}>
                    <Text style={{fontSize: 25, color: "white", fontWeight:"bold", marginBottom: 15, marginTop: 15}}>Voici les derniers avis</Text>
                    {tips.map((tip, index) => {
                        return (
                            <View key={index} style={styles.tipContainer}>
                                <Text style={styles.tipText}>{tip.text}</Text>
                            </View>
                        );
                    })}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: "#ffeae9"
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        marginTop: 40
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    text:{
        fontSize: 20,
    },

    pagerView: {
        marginTop: 60,
        height: 200,
        width: '100%',
        borderColor: "black",
        borderWidth: 5,
    },

    page: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    tipContainer: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        width: '90%',
        justifyContent: "center",
        shadowColor: "#000", 
        shadowOffset: {
            width: 0,
            height: 2,
            },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    tipText: {
        fontSize: 16,
        color: '#333',
    },

    titre:{
        marginTop: 100,
        fontWeight: 900,
        fontSize: 30,
        fontWeight: "bold"
    },

    aucune:{
        textAlign: "center",
        marginTop: 40,
        fontSize: 40,
    },

    aucuneContainer:{
        height: 200,
        width: '100%',
        borderColor: "black",
        borderWidth: 5,
        marginTop: 60,
    },

    avisContainer:{
        alignItems: "center", 
        backgroundColor: "#f9d9d7", 
        padding: 10,
        borderWidth: 1,
        borderColor: "#f9d9d7",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
            },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    

});
export default Event;