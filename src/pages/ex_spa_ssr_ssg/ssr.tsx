export default function ssg(props){
    console.log(props.episodes)
    
    return (
        <>
            <p>Exemplo de SSR</p>
            <p>Abra o console para ver o conteúdo</p>
            <p>Toda a busca dos dados na API é feita pelo back-end, apenas a exibição no console é feita no front-end</p>
        </>
    )
}

/* 
    Só de definir uma funcao export function getServerSideProps()
    o Next ja entende que deve executar essa funcao antes de executar o codigo principal da pagina
    
    Depois so eh necessario fazer com que a funcao seja assincrona e que seus processos sejam assincronos
*/
export async function getServerSideProps() {
    const response = await fetch("http://localhost:3333/episodes")
    const data = await response.json()

    // como se trata de um props entao essa termo e obrigatorio para o retorn
    // mas o nome do dado interno pode ser mudado para qualquer um
    return {
        props : {
            episodes : data,
        }
    }
    // O revalidade define um tempo em segundos que deve ser passado antes que seja feita uma nova requisicao
    // durante esse tempo sera consumida uma versao estatica da pagina, ja carregada no servidor
}