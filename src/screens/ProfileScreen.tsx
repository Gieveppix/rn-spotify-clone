import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { getAllTracks } from '../logic/firebaseConfig';

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  let trackList = null;

  const retrieveTracks = async () => {
    try {
      const response = await getAllTracks();
      const trackArray = Object.values(response);
      setTracks(trackArray);
    } catch (error) {
      console.log("Do nothing", error);
      throw error;
    }
  };

  useEffect(() => {
    retrieveTracks();
  }, []);
  useEffect(() => {
    const getPlaylists = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setPlaylists(response.data.items);
      } catch (error) {
        console.error("Error retrieving playlists:", error);
      }
    };

    getPlaylists();
  }, []);
  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = async () => {
    console.log("hi");
    console.log("accesssssed token", accessToken);
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUserProfile(data);
      return data;
    } catch (error) {
      console.log("error my friend", error.message);
    }
  };
  console.log(playlists);
  const navigation = useNavigation()

  const logout = () => {
    accessToken = undefined;
    navigation.navigate("Login")
  }
  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View style={{ padding: 12}}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                resizeMode: "cover",
              }}
              source={{ uri: userProfile?.images[0].url }}
            />
            <View>
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                {userProfile?.display_name}
              </Text>
              <Text style={{ color: "gray", fontSize: 16, fontWeight: "bold" }}>
                {userProfile?.email}
              </Text>
            </View>
              <TouchableOpacity onPress={logout} style={{ marginLeft: 70 }}>
                <Text style= {{color: "gray", fontSize: 16, fontWeight: "bold"}} >
                  LOGOUT
                </Text>
              </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "500",
            marginHorizontal: 12,
          }}
        >
          Your Playlists
        </Text>
        <View style={{padding:15}}>
          {playlists.map((item, index) => (
            <View style={{flexDirection:"row",alignItems:"center",gap:8,marginVertical:10}}>
              <Image
                source={{
                  uri:
                    item?.images[0]?.url ||
                    "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=800",
                }}
                style={{ width: 50, height: 50, borderRadius: 4 }}
              />
              <View>
                <Text style={{color:"white"}}>{item?.name}</Text>
                <Text  style={{color:"white",marginTop:7}}>0 followers</Text>
              </View>
            </View>
          ))}
        </View>
        <View>
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ marginBottom: 10 }}>
              <Text style={{ color: "white" }}>
                Track: {item.data.trackName} was played {item.data.playCount}
              </Text>
            </TouchableOpacity>
          )}
        />
          <TouchableOpacity onPress={retrieveTracks}>
            <Text style= {{color: "gray", fontSize: 16, fontWeight: "bold", marginBottom: 100}} >
                  Refresh
                </Text>
          </TouchableOpacity>
          </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
