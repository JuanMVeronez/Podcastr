import Image from 'next/image';
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './styles.module.scss';


export function Player() {
    const { 
        episodesList, 
        currentEpisodeIndex, 
        isPlaying, 
        isInLoop,
        togglePlay,
        swipAvailable,
        swipEpisode,
        changeLoopOptions,
        changeAudioState, 
    } = usePlayer()

    const [episodeProgress, setEpisodeProgress] = useState(0)

    function setupEpisodeProgressListener() {
        audioRef.current.currentTime = 0

        audioRef.current.addEventListener('timeupdate', () => {
            setEpisodeProgress(audioRef.current.currentTime)
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount
        setEpisodeProgress(amount)
    }

    const episode = episodesList[currentEpisodeIndex]
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        isPlaying ? (
            audioRef.current.play()
        ) : (
            audioRef.current.pause()
        )
    }, [isPlaying])

    console.log(isInLoop)
    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>
            
            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit='cover'
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )
            }

            <footer className={!episode ? styles.empty : ""}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(episodeProgress)}</span>
                    {/* é uma div fazia pois esse é o player sem nada então não precisa do elemento */}
                    <div className={styles.slider}> 
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={episodeProgress}
                                onChange={handleSeek}
                                trackStyle={{backgroundColor: '#04d361'}}
                                railStyle={{backgroundColor: "#9f75ff"}}
                                handleStyle={{borderColor: "#04d361", borderWidth: 4}}
                            />
                        ) : (
                            <div className={styles.emptySlider}/> )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        onPlay={() => changeAudioState(true)}
                        onPause={() => changeAudioState(false)}
                        onLoadedMetadata={setupEpisodeProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode || !swipAvailable(1)}
                        onClick={() => swipEpisode(1)}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button type="button" 
                        className={styles.playButton} 
                        disabled={!episode}
                        onClick={() => togglePlay()}
                        >
                        {isPlaying ? (
                            <img src="/pause.svg" alt="pausar"/>
                        ) : (
                            <img src="/play.svg" alt="tocar"/>
                        )}
                    </button>
                    {console.log(`teste potão next result: ${!episode || !swipAvailable(-1)}`)}
                    <button type="button" disabled={
                        !episode || !swipAvailable(-1)
                        }>
                        <img src="/play-next.svg" alt="Tocar próxima"
                        onClick={() => swipEpisode(-1)}/>
                    </button>
                    <button type="button" disabled={!episode}
                        onClick={() => changeLoopOptions()}
                        className={isInLoop ? styles.isActive : ''}>
                        <img src="/repeat.svg" alt="Repitir"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}