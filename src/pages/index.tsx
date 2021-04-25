import {GetStaticProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { api } from '../services/api'

import { parseISO, format,  } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import styles from './home.module.scss';
import { usePlayer } from '../contexts/PlayerContext'

type Episode = {
  id: string;
  title: string;
  members: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home(props: HomeProps) {
  const { playList } = usePlayer()
  const {latestEpisodes, allEpisodes} = props
  /*
    eh prefirivel no React sempre criar um objeto novo do que mudar seu valor
    isso pois o React adota o principio de imutabilidade (da programacao funcional)
  */
  const episodeList = [...latestEpisodes, ...allEpisodes]
  
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        
        <ul>
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <div style={{width: 90}}>
                  <Image className={styles.imgPodcastMain}
                    width={192}
                    height={192}
                    src={episode.thumbnail} 
                    alt={episode.title}
                    objectFit='cover'
                    />
                </div>
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.durationAsString}</span>
                  <span>{episode.publishedAt}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="play this podcast"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
          <h2>Todos os episódios</h2>
          
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{width: 72}}>
                      <Image 
                        width={120}
                        height={120}
                        src={episode.thumbnail} 
                        alt={episode.title} 
                        objectFit='cover'
                        />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{width: 100}}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button" 
                        onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                        <img src="/play-green.svg" alt="tocar episódio"/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit:12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode =>{
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      thumbnail: episode.thumbnail,
      description: episode.description,
      url: episode.file.url,
      publishedAt: format(parseISO(episode.published_at), 
        'd MMM yy', {locale: ptBR}),
      duration: episode.file.duration,
      durationAsString: convertDurationToTimeString(episode.file.duration),
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    }, revalidate: 60
  }
}