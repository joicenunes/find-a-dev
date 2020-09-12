## Primeiros passos

Comecei criando o app pelo CLI do React. *Duh*. Então fiz alguns testes com a API do Github com o fetch. Vi no tutorial que ele utiliza outra ferramenta pra realizar os requests, mas o fetch já me atendia e, com 4 dias, eu não ia perder tempo tentando entender como a outra funciona, a menos que me reste tempo quando finalizar tudo.

## Buscando um usuário

Utilizando o próprio App.js que o CLI cria, substituí os componentes pelo formulário que vai dar início ao request. Mantive o logo inicialmente para servir de loader.

~~Pouco acostumada com a semântica do React, quis usar `{{double brackets}}` direto. Not a real problem~~

## Buscando a lista de repositórios favoritos do usuário

Problemas com o lugar onde colocar o componente até perceber que estava fora do div encapsulador. :D Eu passei um bom tempo pra entender que era por isso **e** porque eu não estava colocando a response da request no Promise.resolve() que não estava mostrando a lista.

## Métodos de condicionar a visibilidade de componentes

Testei dois dos jeitos mais simples de fazer a condicional. Não sabia até então como fazer, mas uma olhadinha rápida nos docs do react me deram a luz.

## Mostrando a localização em um mapa

~~Medo de ser cobrada pelo google durante os testes.~~

Comecei pesquisando sobre a API, fiquei assustada com o fato de não existir chaves gratuitas. Comecei a buscar um jeito de fazer a informação que eu tinha (retornado no request de usuário do git: {location: "Cidade, Estado"}) em um jeito de buscar o lugar para mostrar no mapa.

Find Place Request