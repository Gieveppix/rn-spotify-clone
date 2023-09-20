import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import * as WebBrowser from 'expo-web-browser';
import React ,{useEffect} from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { ResponseType, useAuthRequest } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: '6edc43935ccf46e4858446e69ba7b35d',
      clientSecret: '2f9852cc5a6046c1ae0d6c57798f3f20',
      scopes: ["user-read-email",
      "user-library-read",
      "user-read-recently-played",
      "user-top-read",
      "playlist-read-private",
      "playlist-read-collaborative",
      "playlist-modify-public"],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: "exp://localhost:8081/--/spotify-auth-callback"
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      accessToken = response.params.access_token;
      navigation.navigate("Main")
    }
  }, [response]);



  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 80 }} />
        <Entypo
          style={{ textAlign: "center" }}
          name="spotify"
          size={80}
          color="white"
        />
        <Text
          style={{
            color: "white",
            fontSize: 40,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 40,
          }}
        >
          Millions of Songs Free on spotify!
        </Text>

        <View style={{ height: 80 }} />
        <Pressable
          onPress={() => promptAsync()}
          style={{
            backgroundColor: "#1DB954",
            padding: 50,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            marginVertical:10
          }}
        >
          <Text style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}>Sign In with Spotify</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
