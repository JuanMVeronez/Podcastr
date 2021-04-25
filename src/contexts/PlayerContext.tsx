import { createContext, useState, ReactNode, useContext} from 'react';

type Episode = {
    id: string;
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodesList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isInLoop: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    swipAvailable: (direction: number) => boolean;
    swipEpisode: (direction: number) => void;
    changeLoopOptions: () => boolean;
    togglePlay: () => void
    changeAudioState: (newState: boolean) => void;
}
 
type PlayerContextProviderProps = {
    children: ReactNode // Qualquer tipo que o React aceite
}

export const PlayerContext = createContext({} as PlayerContextData)

export default function PlayerContextProvider(props: PlayerContextProviderProps) {
    /*  Como vao ser variaveis que vao mudar, como variaveis de estado devem ser declara-
      das dessa forma, assim podem ser mudadas impactando os elements do react
  */
  const [episodesList, setEpisodesList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInLoop, setIsInLoop] = useState(false)
  function play(episode: Episode): void {
    setEpisodesList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number): void {
      setEpisodesList(list)
      setCurrentEpisodeIndex(index)
      setIsPlaying(true)
  }

  function swipAvailable(direction: number): boolean {
    const isOkToNext = (currentEpisodeIndex != 0 && direction == -1)
    const isOkToPrevios = (currentEpisodeIndex != episodesList.length - 1 && direction == 1)

    if (isInLoop) return true
    if (isOkToNext) return true
    if (isOkToPrevios) return true
    return false
  }

  function swipEpisode(direction: number): void {
    if (!swipAvailable) return

        if (currentEpisodeIndex == 0 && direction == -1) {
            setCurrentEpisodeIndex(episodesList.length - 1)
            return
        }
        if (currentEpisodeIndex == episodesList.length - 1 && direction == 1) {
            setCurrentEpisodeIndex(0)
            return
        }
        setCurrentEpisodeIndex(currentEpisodeIndex + direction)
    }

    function changeLoopOptions(): boolean {
        setIsInLoop(!isInLoop)
        return isInLoop
    }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function changeAudioState(newState: boolean): void {
    setIsPlaying(newState);
  }

  return (
    <PlayerContext.Provider value={{ 
            episodesList, 
            currentEpisodeIndex, 
            isPlaying, 
            isInLoop,
            play,
            playList, 
            swipAvailable,
            swipEpisode,
            changeLoopOptions,
            togglePlay, 
            changeAudioState
        }}>
        {props.children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}