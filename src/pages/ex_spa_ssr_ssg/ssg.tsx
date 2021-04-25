export default function ssg(props){
    console.log(props.episodes)
    
    return (
        <>
            <p>Exemplo de SSG</p>
            <p>Abra o console para ver o conteúdo</p>
            <p>Toda a busca dos dados na API é feita pelo back-end, apenas a exibição no console é feita no front-end</p>
        </>
    )
}

/* 
    Só de definir uma funcao export function getStaticProps()
    o Next ja entende que deve executar essa funcao antes de executar o codigo principal da pagina
    e mais do que isso, ja sabe que se trata de uma static site generation e vai guardar uma versao estatica
    do site, sendo assim nao fara a requisicao novamente a cada vez
    
    Depois so eh necessario fazer com que a funcao seja assincrona e que seus processos sejam assincronos
*/
export async function getStaticProps() {
    const response = await fetch("http://localhost:3333/episodes")
    const data = await response.json()

    return {
        props : {
            episodes : data
        }, 
        revalidate : 60 * 60 * 8,
    }
}