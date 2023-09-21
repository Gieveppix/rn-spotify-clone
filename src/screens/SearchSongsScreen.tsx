import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Player } from "../PlayerContext";
import { BottomModal } from "react-native-modals";
import { ModalContent } from "react-native-modals";
import { Audio } from "expo-av";
import { debounce } from "lodash";
import axios from "axios"
import SearchSongItem from "../components/SearchSongItem";
import ModalDropdown from 'react-native-modal-dropdown';

const SearchSongsScreen = () => {
  const colors = [
    "#27374D",
    "#1D267D",
    "#BE5A83",
    "#212A3E",
    "#917FB3",
    "#37306B",
    "#443C68",
    "#5B8FB9",
    "#144272",
  ];
  const navigation = useNavigation();
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const [backgroundColor, setBackgroundColor] = useState("#0A2647");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchedTracks, setSearchedTracks] = useState([]);
  const [input, setInput] = useState("");
  const [savedTracks, setSavedTracks] = useState([]);
  const value = useRef(0);
  const [currentSound, setCurrentSound] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  async function getSavedTracks() {
    console.log(":::::::::::::SEARCH:::::::::::::", input)
  if(input.length !== 0){
    const response = await axios.get(
      "https://api.spotify.com/v1/search",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: `${input}`,
          limit: 10,
          type: "track"
        },
      }
    );

    console.log("@@@@@@@@@@@@@", response.data.tracks.items[0].album.images[0].url)
   const data = await response.data.tracks;
    setSearchedTracks(
      data.items.map((track) => ({
        ...track,
      }))
    );
    console.log(":::::::::OOOOOOOOOOOOSOSOSOSO::::::::::::::::::::::", searchedTracks)
    }
  }
  
  const playTrack = async () => {
    console.log(savedTracks.length)

    if (savedTracks.length > 0) {
      setCurrentTrack(savedTracks[0]);
    }
    await play(savedTracks[0]);
  };
  const play = async (nextTrack) => {
    console.log(nextTrack);
    const preview_url = nextTrack?.preview_url;
    try {
      if (currentSound) {
        await currentSound.stopAsync();
      }
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });
      const { sound, status } = await Audio.Sound.createAsync(
        {
          uri: preview_url,
        },
        {
          shouldPlay: true,
          isLooping: false,
        },
        onPlaybackStatusUpdate
      );
      console.log(":::::::::::::::SOUND:::::::::::", status, sound)
      onPlaybackStatusUpdate(status);
      setCurrentSound(sound);
      setIsPlaying(status.isLoaded);
      await sound.playAsync();
    } catch (err) {
      console.log(err.message);
    }
  };
  const onPlaybackStatusUpdate = async (status) => {
    console.log(status);
    if (status.isLoaded && status.isPlaying) {
      const progress = status.positionMillis / status.durationMillis;
      console.log("progresss", progress);
      setProgress(progress);
      setCurrentTime(status.positionMillis);
      setTotalDuration(status.durationMillis);
    }

    if (status.didJustFinish === true) {
      setCurrentSound(null);
      playNextTrack();
    }
  };

  const circleSize = 12;
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayPause = async () => {
    if (currentSound) {
      if (isPlaying) {
        await currentSound.pauseAsync();
      } else {
        await currentSound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if(savedTracks.length > 0){
      handleSearch(input)
    }
  },[savedTracks])

  const extractColors = async () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomIndex];
    setBackgroundColor(randomColor);
  };


  const playNextTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current += 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack);
      extractColors();
      await play(nextTrack);
    } else {
      console.log("end of playlist");
    }
  };

  const playPreviousTrack = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      setCurrentSound(null);
    }
    value.current -= 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack);

      await play(nextTrack);
    } else {
      console.log("end of playlist");
    }
  };
  const debouncedSearch = debounce(getSavedTracks, 600);
  function handleSearch() {
    if(savedTracks.length){
      const filteredTracks = savedTracks.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      console.log(":::::::::::::TEXT:::::::::::::", input)
      setSearchedTracks(filteredTracks); // set searchedTracks to filteredTracks, not the search text
    }
  }
  const handleInputChange = (text) => {
    setInput(text);
    if (text.length !== 0) {
      debouncedSearch(text);
    }
  };

  const handleOptionSelect = (index, value) => {
    setSelectedOption(value);
    console.log(value);
  };
  return (
    <>
      <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, marginTop: 50 }}>
          <Pressable
            onPress={() => {
              setCurrentTrack(null)
              navigation.goBack()
            }}
            style={{ marginHorizontal: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <Pressable
            style={{
              marginHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 9,
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: "#42275a",
                padding: 9,
                flex: 1,
                borderRadius: 3,
                height: 38,
              }}
            >
              <AntDesign name="search1" size={20} color="white" />
              <TextInput
                value={input}
                onChangeText={handleInputChange}
                placeholder="Search"
                placeholderTextColor={"white"}
                style={{ fontWeight: "500",color:"white" }}
              />
            </Pressable>

            <ModalDropdown
            options={['Artist', 'Album', 'Track']}
            defaultValue="Sort"
            style={{
              marginHorizontal: 10,
              backgroundColor: '#42275a',
              padding: 10,
              borderRadius: 3,
              height: 38,
              justifyContent: 'center',
            }}
            textStyle={{
              color: 'white',
              fontSize: 16,
              textAlign: 'center',
            }}
            dropdownStyle={{
              backgroundColor: '#42275a',
              borderRadius: 3,
            }}
            dropdownTextStyle={{
              color: 'black', // Change this to a different color that is visible against the background
              fontSize: 16,
              textAlign: 'center',
            }}
            onSelect={(index, value) => handleOptionSelect(index, value)}
          />
          </Pressable>

          <View style={{ height: 50 }} />
          <View style={{ marginHorizontal: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white", marginBottom: 20 }}>
              Search Results
            </Text>
          </View>

          {searchedTracks.length === 0 ? (
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white", justifyContent: "center", alignSelf: "center"}}>Search something</Text> // Show a loading indicator while data is being fetched
          ) : searchedTracks.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={searchedTracks}
              renderItem={({ item }) => (
                <SearchSongItem
                  item={item}
                  onPress={play}
                  isPlaying={item === currentTrack}
                />
              )}
            />
          ) : (
            <Text>No tracks found.</Text> // Display a message if no tracks are found
          )}
        </ScrollView>
      </LinearGradient>

      {currentTrack && (
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            backgroundColor: "#5072A7",
            width: "90%",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: 15,
            position: "absolute",
            borderRadius: 6,
            left: 20,
            bottom: 70,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {currentTrack?.album?.images[0]?.url && (
              <Image
                style={{ width: 40, height: 40 }}
                source={{ uri: currentTrack.album.images[0].url }}
              />
            )}
            <Text
              numberOfLines={1}
              style={{
                fontSize: 13,
                width: 220,
                color: "white",
                fontWeight: "bold",
              }}
            >
              {currentTrack?.name} • {currentTrack?.artists[0]?.name}
            </Text>
          </View>

          {/* <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <AntDesign name="heart" size={24} color="#1DB954" />
            <Pressable>
              <AntDesign name="pausecircle" size={24} color="white" />
            </Pressable>
          </View> */}
        </Pressable>
      )}

      <BottomModal
        visible={modalVisible}
        onHardwareBackPress={() => {
          setCurrentTrack(null)
          setCurrentSound(null)
          setModalVisible(false)}}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
      >
        <ModalContent
          style={{ height: "100%", width: "100%", backgroundColor: "#5072A7" }}
        >
          <View style={{ height: "100%", width: "100%", marginTop: 40 }}>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <AntDesign
                onPress={() => setModalVisible(!modalVisible)}
                name="down"
                size={24}
                color="white"
              />

              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: "white" }}
              >
                {currentTrack?.name}
              </Text>

              <Entypo name="" size={24} color="white" />
            </Pressable>

            <View style={{ height: 70 }} />

            <View style={{ padding: 10 }}>
              <Image
                style={{ width: "100%", height: 330, borderRadius: 4 }}
                source={{ uri: currentTrack?.album?.images[0].url }}
              />
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                  >
                    {currentTrack?.name}
                  </Text>
                  <Text style={{ color: "#D3D3D3", marginTop: 4 }}>
                    {currentTrack?.artists[0].name}
                  </Text>
                </View>

                {/* <AntDesign name="heart" size={24} color="#1DB954" /> */}
              </View>

              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    width: "100%",
                    marginTop: 10,
                    height: 3,
                    backgroundColor: "gray",
                    borderRadius: 5,
                  }}
                >
                  <View
                    style={[
                      styles.progressbar,
                      { width: `${progress * 100}%` },
                    ]}
                  />
                  <View
                    style={[
                      {
                        position: "absolute",
                        top: -5,
                        width: circleSize,
                        height: circleSize,
                        borderRadius: circleSize / 2,
                        backgroundColor: "white",
                      },
                      {
                        left: `${progress * 100}%`,
                        marginLeft: -circleSize / 2,
                      },
                    ]}
                  />
                </View>
                <View
                  style={{
                    marginTop: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 15, color: "#D3D3D3" }}
                  >
                    {formatTime(currentTime)}
                  </Text>

                  <Text
                    style={{ color: "white", fontSize: 15, color: "#D3D3D3" }}
                  >
                    {formatTime(totalDuration)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 17,
                }}
              >
                <Pressable>
                  {/* <FontAwesome name="arrows" size={30} color="#03C03C" /> */}
                </Pressable>
                <Pressable onPress={playPreviousTrack}>
                  <Ionicons name="play-skip-back" size={30} color="white" />
                </Pressable>
                <Pressable onPress={handlePlayPause}>
                  {isPlaying ? (
                    <AntDesign name="pausecircle" size={60} color="white" />
                  ) : (
                    <Pressable
                      onPress={handlePlayPause}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: "white",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Entypo name="controller-play" size={26} color="black" />
                    </Pressable>
                  )}
                </Pressable>
                <Pressable onPress={playNextTrack}>
                  <Ionicons name="play-skip-forward" size={30} color="white" />
                </Pressable>
                <Pressable>
                  {/* <Feather name="repeat" size={30} color="#03C03C" /> */}
                </Pressable>
              </View>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default SearchSongsScreen;

const styles = StyleSheet.create({
  progressbar: {
    height: "100%",
    backgroundColor: "white",
  },
});
