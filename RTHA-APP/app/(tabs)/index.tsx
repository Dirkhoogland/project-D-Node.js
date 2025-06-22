import { Image } from 'expo-image';
import { Dimensions, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useRef, useState } from 'react';
import { Modalize } from 'react-native-modalize';
import Toast from 'react-native-toast-message';

type FlightResult = {
  FlightID?: string | number;
  FlightNumber?: string;
  ScheduledLocal?: string;
  AirlineShortname?: string;
};

export default function HomeScreen() {
  const [airline, setAirline] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [results, setResults] = useState<FlightResult[]>([]);
  const listRef = useRef<FlatList<FlightResult>>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightResult | null>(null);
  const modalizeRef = useRef<Modalize>(null);

  function getApiDate(dateString: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString();
  }

  useEffect(() => {
    if (airline && selectedDate) {
      const url = `https://api.project-d.nl/touchpoints?ScheduledLocal=${encodeURIComponent(getApiDate(selectedDate))}&AirlineShortname=${encodeURIComponent(airline.toUpperCase())}`;
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzQ5NjQ1NDQyLCJleHAiOjE3NDk2NDkwNDJ9.N5DzpFwN471PwlHACXpx8R8vy3mH2eBLHkwHalYdaU8';

      fetch(url,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      )
        .then(res => res.json())
        .then(data => {
          const fetchedResults = data.data || [];

          if (fetchedResults.length === 0) {
            Toast.show({
              type: 'info',
              text1: 'Geen resultaten',
              text2: 'Er zijn geen vluchten gevonden voor deze maatschappij op deze datum.',
              position: 'bottom',
            });
          }

          const uniqueResults = Array.from(
            new Map<string | number, FlightResult>(
              fetchedResults
                .filter((item: FlightResult) => item.FlightID !== undefined && item.FlightID !== null)
                .map((item: FlightResult) => [item.FlightID!, item])
            ).values()
          );

          setResults(uniqueResults);

          setTimeout(() => {
            listRef.current?.scrollToOffset({ offset: 0, animated: true });
          }, 300);
        })
        .catch(() => {
          setResults([]);
          Toast.show({
            type: 'error',
            text1: 'Fout',
            text2: 'Kon de gegevens niet ophalen. Controleer uw netwerk.',
            position: 'bottom',
          });
        });
    } else {
      setResults([]);
    }
  }, [airline, selectedDate]);

  function openDetails(flight: FlightResult) {
    setSelectedFlight(flight);
    modalizeRef.current?.open();
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/front-door.png')}
          style={styles.frontDoor}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welkom</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Vraag hier uw vluchtgegevens op:</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Luchtvaartmaatschappij"
          placeholderTextColor="#f59ba4"
          value={airline}
          onChangeText={setAirline}
        />

        <Calendar
          current="2024-01-01"
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#00adf5' }
          }}
          style={{
            marginTop: 16,
            borderRadius: 8,
            overflow: 'hidden',
            borderWidth: 3,
            borderColor: '#ed1b38',
            backgroundColor: '#fff',
          }}
          theme={{
            arrowColor: '#ed1b38',
            disabledArrowColor: '#ccc',
          }}
        />

        <ThemedText style={{ marginTop: 16 }}>
          Geselecteerde datum: {selectedDate}
        </ThemedText>

        <FlatList
          ref={listRef}
          data={results}
          keyExtractor={(item, idx) => item.FlightID?.toString() || idx.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openDetails(item)}>
              <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
                <ThemedText style={{ color: "#ed1b38" }}>
                  Vluchtnummer: {item.FlightNumber}{'\n'}
                  Maatschappij: {item.AirlineShortname}{'\n'}
                  Tijd: {item.ScheduledLocal}
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
          style={{
            marginTop: 16,
            borderRadius: 8,
            overflow: 'hidden',
            borderWidth: 3,
            borderColor: '#ed1b38',
            backgroundColor: '#fff',
          }}
          ListEmptyComponent={
            airline && selectedDate ? (
              <ThemedText style={{ textAlign: 'center', marginTop: 8 }}>Geen resultaten gevonden.</ThemedText>
            ) : null
          }
        />

        <Modalize ref={modalizeRef} snapPoint={300} modalHeight={400}>
          {selectedFlight && (
            <View style={{ padding: 20 }}>
              <ThemedText type="title" style={{ marginBottom: 10, color: '#ed1b38' }}>Vlucht Details</ThemedText>
              <ThemedText style={{ color: '#ed1b38' }}>Vluchtnummer: {selectedFlight.FlightNumber}</ThemedText>
              <ThemedText style={{ color: '#ed1b38' }}>Maatschappij: {selectedFlight.AirlineShortname}</ThemedText>
              <ThemedText style={{ color: '#ed1b38' }}>Tijd: {selectedFlight.ScheduledLocal}</ThemedText>
            </View>
          )}
        </Modalize>

      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  frontDoor: {
    height: 300,
    width: Dimensions.get('window').width,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  input: {
    borderWidth: 3,
    borderColor: '#ed1b38',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    backgroundColor: '#fff',
  },
});
