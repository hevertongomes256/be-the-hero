import React, {useState, useEffect} from 'react';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

import api from "../../services/api"

import logoImg from '../../assets/logo.png';

import styles from './styles';

export default function Incidents() {

    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0); 
    const navigation = useNavigation();
    const [page, setPage] = useState(1);
    const [loading, setLoaging] = useState(false)

    function navigateToDetail(incident){
        navigation.navigate('Detail', { incident });
    }

    async function loadIncidents(){

        if(loading){
            return; // Parar de buscar
        }

        if( total > 0 && incidents.length  === total){
            return;
        }

        setLoaging(true);

        const response = await api.get('incidents', {
            params: {page}
        });
        
        setIncidents([...incidents, ...response.data])
        setTotal(response.headers['x-total-count'])
        setPage(page + 1);
        setLoaging(false);
    }
    
    useEffect(() => {
        loadIncidents();
    }, [])

    return(
        <View style={styles.continer}>

            <View style={styles.header}>
                <Image source={logoImg}/>
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}>{total} casos</Text>
                </Text>
            </View>

            <Text style={styles.title}>Bem-vindo</Text>
            <Text style={styles.description}> Escolha um dos casos e salve o dia</Text>

           
            <FlatList 
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                style={styles.incidentsList}
                data={incidents}
                keyExtractor={incident => String(incident.id)}
                showsVerticalScrollIndicator={true}
                renderItem={({item: incident}) => (
                    <View style={styles.incident}>
                    <Text style={styles.incidentProperty}>ONG</Text>
                    <Text style={styles.incidentValue}>{incident.name}</Text>

                    <Text style={styles.incidentProperty}>CASO</Text>
                    <Text style={styles.incidentValue}>{incident.title}</Text>

                    <Text style={styles.incidentProperty}>Valor</Text>
                <Text style={styles.incidentValue}>
                    {Intl.NumberFormat('pt-br', { 
                    style: 'currency', currency: 'BRL'
                    }).format(incident.value)}
                    </Text>
                    <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => navigateToDetail(incident)}>
                       <Text style={styles.detailButtonText}>Ver mais detalhes</Text> 
                        <Feather name="arrow-right" size={16} color="#E02041"/>
                    </TouchableOpacity>
                </View>

                )}
            />
        </View>
    );
}