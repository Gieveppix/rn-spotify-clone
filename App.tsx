import { ModalPortal } from "react-native-modals";
import { PlayerContext } from "./src/PlayerContext";
import Navigation from "./src/navigation/StackNavigator";
import { useState } from "react";

export default function App() {
  // const [progress, setProgress] = useState(null);
  return (
    <>
      <PlayerContext>
        <Navigation />
        <ModalPortal/>
      </PlayerContext>
    </>
  );
}
