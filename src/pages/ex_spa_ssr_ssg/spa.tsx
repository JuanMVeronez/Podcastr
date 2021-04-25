import { useEffect } from "react"

export default function spa() {
    /* 
    Dispara uma acao colateral com base em uma acao que eh passado via variavel no []
    logo caso uma das variaveis mudar o codigo eh executado.
    caso esteja sem variaveis eh executada QUANDO A PAGINA EH CARREGADA
    */
    useEffect(() => {
        fetch('http://localhost:3333/episodes')
        .then(response => response.json())
        .then(data => console.log(data))
    }, [])
    /* 
    No caso faz o request na resource episodes da porta 3333
    Depois pega o formato json() dos dados e depois passa os dados para o console.log
    */
   
    return (
        <>
           <p>Exemplo de SPA</p>
           <p>Abra o console para ver o conteúdo</p>
           <p>Caso o js estiver desabilitado ele não ira aparecer</p>
        </>
    )
}