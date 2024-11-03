import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Button, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from 'expo-linear-gradient';

const Accueil = () => {
    const navigation = useNavigation();

    
    
    return(
    <LinearGradient
        colors={['#178220', '#00ffd0']}
        style={styles.container}
    >
        <View style={styles.innerContainer}>
            <Text style={styles.title}>Bienvenue sur Around You</Text>
            <Text style={styles.subtitle}>Retrouve tes activités autour de toi:</Text>
            <Text style={styles.info}>Activités, Evènement sportif</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Localisation')} style={styles.button}>
                <Text style={styles.buttonText}>Commencer</Text>
            </TouchableOpacity>
        </View>
    </LinearGradient>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
    },
    innerContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 5,
    },
    info: {
        fontSize: 16,
        fontWeight: '400',
        color: '#ffffff',
        textAlign: 'center',
    },

    button: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: '#4CAF50', 
        paddingVertical: 10, 
        paddingHorizontal: 20,
        marginTop: 50
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center', 
    },
})
export default Accueil;