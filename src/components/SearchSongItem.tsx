import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React ,{useContext} from  "react";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Player } from "../PlayerContext";
import { db } from "../logic/firebaseConfig";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { doc, updateDoc, increment, setDoc, getDoc} from "firebase/firestore"

const SearchSongItem = ({ item, onPress, isPlaying }) => {
  const { currentTrack, setCurrentTrack } = useContext(Player);

  const updateFirebaseDocument = async (trackId, trackName) => {
    try {
      const trackRef = doc(db, 'tracks', trackId); // Use the trackId as the document ID
      const trackSnapshot = await getDoc(trackRef);
  
      if (trackSnapshot.exists()) {
        // Track document exists, update the 'playCount' field
        await updateDoc(trackRef, {
          playCount: increment(1),
        });
      } else {
        // Track document doesn't exist, create a new one
        await setDoc(trackRef, {
          trackName: trackName,
          playCount: 1, // Initialize playCount to 1
        });
      }
  
      console.log(':::::::::::::::::::::::::::::::::::::::::Document updated successfully.:::::::::::::::::::::::::::::::::::::::::');
    } catch (error) {
      console.error(':::::::::::::::::::::::::::::::::::::::::Error updating document:::::::::::::::::::::::::::::::::::::::::', error);
    }
  };

  const handlePress = async () => {
    console.log("::::::::::::::::::::::::::ITEM::::::::::::::::", item)
    await updateFirebaseDocument(item.id, item.name);
    setCurrentTrack(item);
    onPress(item)
  } 
  return (
    <Pressable
    onPress={handlePress}
      style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
    >
      <Image
        style={{ width: 50, height: 50, marginRight: 10 }}
        source={{ uri: item?.album?.images[0].url }}
      />

      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={
            isPlaying
              ? {
                  fontWeight: "bold",
                  fontSize: 14,
                  color: "#3FFF00",
                }
              : { fontWeight: "bold", fontSize: 14, color: "white" }
          }
        >
          {item?.name}
        </Text>
        <Text style={{ marginTop: 4, color: "#989898" }}>
          {item?.artists[0].name}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
          marginHorizontal: 10,
        }}
      >
        {/* <AntDesign name="heart" size={24} color="#1DB954" /> */}
        <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
      </View>
    </Pressable>
  );
};

export default SearchSongItem;

const styles = StyleSheet.create({});
