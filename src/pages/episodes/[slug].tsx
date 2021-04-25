import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { api } from '../../services/api';

import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image'
import Link from 'next/link'

import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss'; 
import { usePlayer } from '../../contexts/PlayerContext';

type Episode = {
    id: string;
    title: string;
    members: string;
    thumbnail: string;
    description: string;
    url: string;
    publishedAt: string;
    duration: number;
    durationAsString: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function EpisodePage(props: EpisodeProps){
    const episode = props.episode
    const { play } = usePlayer()
    
    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href='/'>
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                <Image 
                    width={700}
                    height={160}
                    src={props.episode.thumbnail}
                    objectFit='cover'
                    />
                <button>
                    <img src="/play.svg" alt="Tocar o episódio"
                        onClick={()=> play(episode)}
                    />
                </button>
            </div>
            <header>
                <h1>{props.episode.title}</h1>
                <span>{props.episode.members}</span>
                <span>{props.episode.publishedAt}</span>
                <span>{props.episode.durationAsString}</span>
            </header>
            <div className={styles.description} 
            dangerouslySetInnerHTML={{ __html: props.episode.description}}/> {/* nao eh muito recomendado pois pode fazer com que seja injetado um script caso o back seja desconhecido */} 
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async() => {
    const { data } = await api.get('/episodes', {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc',
        }
    })
    
    const paths = data.map(episode =>{
        return {
            params: {
                slug: episode.id
            }
        }
    })
    
    return {
        paths,
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
          id: data.id,
          title: data.title,
          members: data.members,
          thumbnail: data.thumbnail,
          description: data.description,
          url: data.file.url,
          publishedAt: format(parseISO(data.published_at), 
            'd MMM yy', {locale: ptBR}),
          duration: data.file.duration,
          durationAsString: convertDurationToTimeString(data.file.duration),
        }
    
    return {
        props: {
            episode
        }, revalidate: 60 * 60 * 24, // 24hours
    }
}