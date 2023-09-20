import {createContext, useState} from "react";

const Player = createContext(undefined);
console.log("AAAAAAAA::::::::::::::::::::", Player)

const PlayerContext = ({children}) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    return (
        <Player.Provider value={{currentTrack, setCurrentTrack}}>
            {children}
        </Player.Provider>
    )
}

export {PlayerContext, Player}