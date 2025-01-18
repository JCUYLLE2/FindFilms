import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const DetailsScreen = ({ route, navigation }) => {
  const { movie } = route.params;

  // Stel een limiet in voor de breedte en hoogte van de afbeelding
  const imageWidth = Math.min(width - 40, 300); // Max 300px breedte
  const imageHeight = (imageWidth / 2) * 3; // Verhouding 2:3

  // Rond de gemiddelde score af naar 1 decimaal
  const roundedVoteAverage = movie.vote_average.toFixed(1);

  return (
    <ScrollView style={styles.container}>
      {/* Terugknop */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Terug</Text>
      </TouchableOpacity>

      {/* Film Detail */}
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={[styles.poster, { width: imageWidth, height: imageHeight }]}
        resizeMode="contain" // Behoud originele verhoudingen
      />

      {/* Kader voor titel, beschrijving en details */}
      <View style={styles.detailsContainer}>
        {/* Titel en Beschrijving */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
        </View>

        {/* Details */}
        <View style={styles.extraDetails}>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Originele Titel:</Text> {movie.original_title}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Taal:</Text> {movie.original_language.toUpperCase()}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Populariteit:</Text> {movie.popularity}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Release Datum:</Text> {movie.release_date}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Video Beschikbaar:</Text> {movie.video ? 'Ja' : 'Nee'}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Aantal Stemmen:</Text> {movie.vote_count}
          </Text>
          <View style={[styles.scoreContainer, { width: width > 600 ? 200 : '100%' }]}>
  <Text style={styles.scoreLabel}>Gemiddelde Score:</Text>
  <Text style={styles.scoreValue}>{roundedVoteAverage}/10</Text>
</View>

        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#382E31', // Donkergrijze achtergrond
    padding: 20,
  },
  backButton: {
    backgroundColor: '#AC274F', // Dieproze
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 20, // Ruimte onder de knop
    alignSelf: 'flex-start', // Zorg dat de knop links uitlijnt
  },
  backButtonText: {
    color: '#FFD9DA', // Zachtroze tekstkleur
    fontSize: 16,
    fontWeight: 'bold',
  },
  poster: {
    borderRadius: 10,
    marginBottom: 20, // Ruimte onder de afbeelding
    alignSelf: 'center', // Centreer de afbeelding
  },
  detailsContainer: {
    backgroundColor: '#191516', // Donkere achtergrond voor details
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row', // Titel/beschrijving links, details rechts
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1, // Neem de linkerhelft
    paddingRight: 10, // Ruimte tussen tekst en details
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD9DA', // Zachtroze
    marginBottom: 10,
  },
  overview: {
    fontSize: 16,
    color: '#EB638B', // Roze tekstkleur
    lineHeight: 22, // Maak de tekst wat leesbaarder
    marginBottom: 20, // Ruimte onder de beschrijving
  },
  extraDetails: {
    flex: 1, // Neem de rechterhelft
    paddingLeft: 10, // Ruimte tussen details en tekst
  },
  detail: {
    fontSize: 14,
    color: '#FFD9DA', // Zachtroze
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#EB638B', // Roze tekstkleur voor labels
  },
 scoreContainer: {
  marginTop: 10,
  marginBottom: 10,
  padding: 10,
  backgroundColor: '#AC274F', // Achtergrondkleur voor de score
  borderRadius: 10,
  alignItems: 'center',
  alignSelf: 'center', // Zorg dat het kader gecentreerd is
},

  scoreLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD9DA',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD9DA',
  },
});

export default DetailsScreen;
