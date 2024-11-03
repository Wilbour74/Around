import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, Platform, TextInput, Modal, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';
import * as Calendar from "expo-calendar";
import CalendarPicker from 'react-native-calendar-picker';
import PagerView from 'react-native-pager-view';
import { useNavigation } from "@react-navigation/native"


const Contact = ({route}) => {
    const [contacts, setContacts] = useState([]);
    const [permissionStatus, setPermissionStatus] = useState(null);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const { eventId, adress, name, latitude, longitude } = route.params;
    const [formattedAddress, setFormattedAddress] = useState(null);
    const [modalVisible, setModalVisible] = useState(true);
    const [showForm, setShowForm] = useState(true);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [calendarId, setCalendarId] = useState('');
    const [meteo, setMeteo] = useState([]);
    const [formateDate, setFormateDate] = useState("");
    const navigation = useNavigation();
    const [recherche, setRecherche] = useState(false);
    const [boutonRec, setBoutonRec] = useState(true);


    const checkSMS  = async () => {
        const isDateAvailable = await SMS.isAvailableAsync();
        
        if(isAvailable){
            alert('SMS est disponible')
        }
        else{
            alert('SMS n est pas disponible')
        }
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        hideDatePicker();
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [day, month, year].join('/');
    }

    const startDate = selectedStartDate ? formatDate(selectedStartDate) : '';

    useEffect(() => {
        const getPermissions = async () => {
            console.log('Demande de permissions pour les contacts...');
            const {status} = await Contacts.requestPermissionsAsync();
            console.log("Permission status pour les contacts:", status);
            setPermissionStatus(status);

            if(status === 'granted'){
                fetchContacts();
            }
        }

        const formatAddress = (address) => {
            return address.replace(/\//g, '-').replace(/ /g, '+');
        }

        if (adress) {
            const formatted = formatAddress(adress);
            let formattedUrl = "https://www.google.com/maps/search/" + formatted;
            console.log(formattedUrl)
            setFormattedAddress(formattedUrl);
        }

        const getCalendarPermission = async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
          
            if (status === 'granted') {
                const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);  
          
                console.log('Here are all your calendars:', calendars);
                const text = "MyApp"
                const filter = calendars.filter(calendar =>  calendar.title.includes(text))
                setCalendarId(filter[0].id)
            }
          };

          const fetchMeteo = async () => {
            const apiKey = "45a14e61a5a1449ab5c154250243007";
            const meteoUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=20`;
            
            console.log("Meteo", meteoUrl);
            
            try {
                const response = await fetch(meteoUrl);
                const result = await response.json();
                console.log(result.forecast.forecastday);
        
                const conditionTranslations = {
                    "Clear": "Dégagé",
                    "Partly cloudy": "Partiellement nuageux",
                    "Overcast": "Couvert",
                    "Rain": "Pluie",
                    "Showers": "Averses",
                    "Snow": "Neige",
                    "Thunderstorm": "Orage",
                    "Mist": "Brume",
                    "Fog": "Brouillard",
                    "Hail": "Grêle",
                    "Heavy rain": "Pluie forte",
                    "Patchy rain nearby": "Pluie éparse à proximité",
                    "Sunny": "Ensoleillé",
                    "Cloudy": "Nuageux",
                    "Partly Cloudy": "Partiellement nuageux",
                    "Thundery outbreaks in nearby": "Des orages à proximité",
                };
        
                const translateCondition = (condition) => {
                    const cleanedCondition = condition.trim();
                    return conditionTranslations[cleanedCondition] || cleanedCondition;
                };

                const weatherData = result.forecast.forecastday.map(day => ({
                    Date: day.date,
                    MaxTemperatureC: day.day.maxtemp_c,
                    MinTemperatureC: day.day.mintemp_c,
                    MoyTemperatureC: day.day.avgtemp_c,
                    Condition: translateCondition(day.day.condition.text),
                    Image: day.day.condition.icon.replace("//", "http://")
                }));
        
                console.log(weatherData);
        
                setMeteo(weatherData);
            } catch (error) {
                console.error("Erreur lors de la récupération des données météorologiques:", error);
            }
        };
        

        


        getPermissions();
        getCalendarPermission();
        fetchMeteo();
    }, [adress]);

    const fetchContacts = async () => {
        console.log("Fetch contacts called");
        if(permissionStatus === "granted"){
            console.log('Permission granted pour les contacts');
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
            });

            if(data.length > 0){
                setContacts(data);
                setFilteredContacts(data);
                setBoutonRec(false)
                setRecherche(true)
            } else{
                console.log('Permission not granted pour les contacts');
                Alert.alert('Permission non accordée', 'Vous devez accorder la permission d\'accéder aux contacts');é
            }
        }
    }
    
   
    const sendSMS = async (phoneNumber, bodyText, date) => {
        const { result } = await SMS.sendSMSAsync(phoneNumber, bodyText);
        if(result === "sent"){
            alert('Message sent successfully');
            navigation.navigate("Agenda")
        }
    }

    const FetchFiltered = (text) => {
        setSearchText(text);
        if(text){
            const filtered = contacts.filter(contact => contact.name?.toLowerCase().includes(text.toLowerCase())
        
        )
            setFilteredContacts(filtered);
        }
        else{
            setFilteredContacts(contacts);
        }
    }

    const addNewEvent = async () => {

        try{
            const calendar = calendarId

            console.log(calendar)

            const res = await Calendar.createEventAsync(calendar, {
                endDate: selectedStartDate,
                startDate: selectedStartDate,
                title: `Sortie à/au ${name}`,
                timeZone: 'GMT',
                location: adress,
            });
            Alert.alert('Event l\'évènement à été ajouté');
            setShowForm(false);
        }
        catch(e){
            console.log(e);
        }
    }
    
    const Navigate = async () =>{
        setModalVisible(false), 
        navigation.navigate("Agenda")
    }
    

    return(
        <View style={{flex: 1, padding: 20}}>
            <Modal 
                animationType=':slide'
                transparent={true}
                visible={modalVisible}
                >
                <View style={styles.modalView}>
                    {!showForm ? (
                        <View style={styles.container}>
                        <Text style={styles.modalText}>Veux-tu inviter un ami?</Text>
                        <TouchableOpacity style={styles.yesButton} onPress={() => setModalVisible(false)}>
                          <Text style={styles.buttonText}>✔ OUI</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.noButton} onPress={Navigate}>
                          <Text style={styles.buttonText}>✖ NON</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                        
                        <View style={{ flex: 1 }}>
                            
                            {meteo.length > 0 && (
                            <View style={{ flex: 1 }}>
                            
                            <Text style={{marginBottom: 20, fontWeight: 'bold', fontSize:20, textAlign:"center"}}>Voici la météo des prochains jours</Text>
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Event", {event: eventId})}>
                                <Text style={styles.text}>◀ Retour</Text>
                            </TouchableOpacity>
                            <PagerView style={{ flex: 1 }} initialPage={0}>
                                {meteo.map((mete, index) => {
                                    console.log(`Index: ${index}, Mete Data:`, mete);
                                    return (
                                        <View key={index} style={styles.container}>

                                            <View style={styles.row}>
                                                
                                                <Image source={{uri: mete.Image}} style={styles.photo}/>
                                            <View style={styles.infoContainer}>
                                           
                                            <Text style={{fontWeight: 'bold'}}>{formatDate(mete.Date)}</Text>
                                            <Text style={{color: 'gray'}}>{mete.Condition}</Text>
                                            <Text>Min: {mete.MinTemperatureC}°C Max: {mete.MaxTemperatureC}°C</Text>
                                            <Text>Moyenne: {mete.MoyTemperatureC}°C</Text>
                                            {console.log(`Image URL: ${mete.Image}`)}
                                            </View>
                                        </View>
                                    </View>
                                    );
                                })}
                            </PagerView>
                            </View>
                        )}
                        <View style={{ paddingVertical: 100 }}>
                            <Text style={{textAlign: "center", fontSize: "25", marginBottom: "30"}}>Choisis une date</Text>
                            <CalendarPicker
                                onDateChange={setSelectedStartDate}
                                weekdays={['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']}
                                months={[
                                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                                ]}
                                previousTitle="Précédent"
                                nextTitle="Suivant"
                                todayBackgroundColor="#f2e6ff"
                                selectedDayColor="#7300e6"
                                selectedDayTextColor="#FFFFFF"
                                scaleFactor={375}
                                locale="fr"
                            />
                            <Button title={"Ajouter au calendrier"} onPress={addNewEvent}></Button>
                        </View>
                        </View>
                    )}  
                </View>
            </Modal>
            {name && (
                <View style={{marginTop: 50}}>
                    <Text style={{fontSize: 20, fontWeight: "bold"}}>Invite un contact à cet endroit "{name}"</Text>
                </View>
            )}
            {boutonRec &&(
            <Button title="Charger les contacts" onPress={fetchContacts} style={{paddingTop : 100}}/>
            )}
            {recherche && (
               <View>
               <TextInput
                    placeholder="Rechercher un contact                                         🔍"
                    value={searchText}
                    onChangeText={FetchFiltered}
                    style={{borderWidth: 2, marginTop: 50,padding: 10, borderRadius: 10}}
                />

                <TouchableOpacity style={{justifyContent:"center", alignItems:"center", borderWidth:1, borderRadius:8, width: 200, height: 40, backgroundColor:"red", marginLeft: 70, marginTop: 20}} onPress={() => {navigation.navigate("Agenda")}}>
                    <Text style={styles.buttonText}>✖ Finalement Non</Text>
                </TouchableOpacity>
                </View>
            )}
            {recherche && (
            <FlatList
                data={filteredContacts}
                keyExtractor={(item) => item.Id}
                renderItem={({ item}) => (
                    <TouchableOpacity onPress={() => sendSMS(item.phoneNumbers[0].number, `Salut c'est wilfried je t'invite à passer un bon moment avec moi à cette endroit "${name}" voici l'adresse ${formattedAddress},  le ${startDate}` )}>
                    <View style={styles.numContainer}>
                    <Text style={{fontWeight: "bold", textAlign: "center"}}>{item.name ? item.name : 'Nom non disponible'}</Text>
                    {item.phoneNumbers && item.phoneNumbers.length > 0 ? (
                       
                        <View style={styles.phoneContainer}>
                        
                        <Text style={{fontStyle:"italic", textAlign: "center"}} >Numéro: {item.phoneNumbers[0].number}</Text>
                        </View>
                        
                    ):(
                        <Text>Pas de numéro récupérer</Text>
                    )}
                    </View>
                    </TouchableOpacity> 
                )}
            />
            
        )}
        </View>
    )
}

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: 'lightblue',
        flex: 1,
        padding: 40,
        justifyContent: 'center',
        margin: 10,
    
    },
    modalText: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: "center"
    },

    infoContainer: {
        flex: 1,
    },

    photo: {
        width: 80,
        height: 80,
        marginRight: 1,
    },
    
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#79b6c9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 10,
        backgroundColor: "#e1f4f0"
    },

    infoContainer: {
        flex: 1,
    },

    numContainer: {
        marginBottom: 10,
        alignSelf: "center",
        marginTop: 20,
        padding: 15,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        width: 300
    },

    yesButton: {
        backgroundColor: 'green',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },

      noButton: {
        backgroundColor: 'red',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },

      backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        marginTop: 40
    },

    text:{
        fontSize: 20,
    },
})

export default Contact;