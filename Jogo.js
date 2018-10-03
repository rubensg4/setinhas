var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var fonts = ["arcadeclassicregular"]

var tecla = 0;      //variável necessária para armazenar o que for digitado

var lastSpawn = -1;     //valor inicial para criar o primeiro projétil, é negativo para ser acionado logo no inicio

var spawnRate = 2000;       //tempo de intervalo entre projéteis
var velocidade = 1;     //velocidade no qual os projéteis se movem

var scoreframe = 0;     //serve como contador de tempo para definir como o score será aumentado
var score = 0;      //aumenta a cada quantidade determinada de scoreframe

var vida = 3;       //vida máxima do jogador

var setas = [];     //lista onde será armazenado todos os projéteis

//variáveis de todas as imagens que serão utilizadas
var imagem_coracao = new Image();
imagem_coracao.src = 'jogo-scrs/coracao.png';

var arrow_up = new Image();
arrow_up.src = 'jogo-scrs/arrow-up.png';

var arrow_down = new Image();
arrow_down.src = 'jogo-scrs/arrow-down.png';

var arrow_left = new Image();
arrow_left.src = 'jogo-scrs/arrow-left.png';

var arrow_right = new Image();
arrow_right.src = 'jogo-scrs/arrow-right.png';

var arrow_up_red = new Image();
arrow_up_red.src = 'jogo-scrs/arrow-up-red.png';

var arrow_down_red = new Image();
arrow_down_red.src = 'jogo-scrs/arrow-down-red.png';

var arrow_left_red = new Image();
arrow_left_red.src = 'jogo-scrs/arrow-left-red.png';

var arrow_right_red = new Image();
arrow_right_red.src = 'jogo-scrs/arrow-right-red.png';

//desabilita a função de mover a página no navegador pelas setas, já que será utilizado no jogo
window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

//captura o que for digitado e armazena na variável "tecla"
document.addEventListener("keydown", function(evento) {
    tecla = evento.keyCode;
});

//função principal do jogo
function desenha() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var time = Date.now();      //registra quantos milisegundos se passaram desde a data 01/01/1970

    desenhos_fixos();       //função que desenha tudo aquilo que é constante e imutável no canvas

    teclado();      //gerencia as ações a serem realizadas a partir da tecla pressionada

    //compara se o tempo atual é maior que o tempo do último projétil + o intervalo entre eles, como o valor inicial é -1, será acionado logo no primeiro frame
    if (time > (lastSpawn + spawnRate)) {
        lastSpawn = time;       //atualiza sempre qual a hora que o projétil foi gerado, para a nova comparação
        seta_random();      //função responsável por gerar um projétil
    }

    fisica();       //função responsável por toda atualização de posição e colisão

    scorecount();       //função responsável por mostrar e contar a pontuação
    lifecount();        //função responsável por mostrar e contar a quantidade de vidas
}

function desenhos_fixos() {
    //o coração representa o seu personagem
    ctx.drawImage(imagem_coracao, 241.66, 241.66, 16.66, 16.66);

    //os 4 desenhos representam a cabine branca no qual está posicionado o personagem
    ctx.fillStyle = "white";
    ctx.fillRect(213.88, 213.88, 5.55, 72.22);

    ctx.fillStyle = "white";
    ctx.fillRect(280.55, 213.88, 5.55, 72.22);

    ctx.fillStyle = "white";
    ctx.fillRect(213.88, 213.88, 72.22, 5.55);

    ctx.fillStyle = "white";
    ctx.fillRect(213.88, 280.55, 72.22, 5.55);

}

function teclado() {

    //posicionamento do escudo do personagem de acordo com a tecla apertada
    if (tecla === 39) {
        ctx.fillStyle = "blue";
        ctx.fillRect(275, 222.22, 2.77, 55.55);
    }

    else if(tecla === 37){
        ctx.fillStyle = "blue";
        ctx.fillRect(222.22, 222.22, 2.77, 55.55);
    }
    else if(tecla === 38){
        ctx.fillStyle = "blue";
        ctx.fillRect(222.22, 222.22, 55.55, 2.77);

    }
    else if(tecla === 40){
        ctx.fillStyle = "blue";
        ctx.fillRect(222.22, 275, 55.55, 2.77);
    }
}

function seta_random (){
    var random = Math.floor(Math.random() * 5) + 1;     //gera um valor aleatório de 1 a 5
    var novo = 0;       //variável onde será armazenado qual será será criada

    //gera o projétil de acordo com o valor, a variável "tipo" serve para o programa saber em qual direção foi gerada
    //armazena as dimensões e o tipo de projétil na variável "novo" e adiciona à lista "setas"
    if (random === 1){
        novo = {x: 241.66, y: 0, altura: 16.66, largura: 16.66, tipo: 1};
        setas.push(novo);
    }
    else if (random === 2){
        novo = {x: 0, y:  241.66, altura: 16.66, largura: 16.66, tipo: 2};
        setas.push(novo);
    }
    else if (random === 3){
        novo = {x:  241.66, y: 483.33, altura: 16.66, largura: 16.66, tipo: 3};
        setas.push(novo);
    }
    else if (random === 4){
        novo = {x: 483.33, y:  241.66, altura: 16.66, largura: 16.66, tipo: 4};
        setas.push(novo);
    }
    //caso o valor seja 5 não será gerado nenhum projétil
}

function fisica(){
    for (var i = 0; i < setas.length; i++) { //percorre todos os elementos da lista "setas"
        var object = setas[i];

        if (object.tipo ===1){               //caso o tipo seja 1 (cima)
            object.y += velocidade;          //soma a velocidade ao valor do y, para descer
            if (object.y + 16.66 >= 222.22){ //verifica se o projétil chegou à cabine do personagem
                if (tecla === 38){           //verifica se o escudo está posicionado nessa direção pela variável "tecla"
                    setas.splice(i,1);       //caso o escudo seteja nessa direção, exclui o projétil da lista
                }
                else {                       //caso o escudo não esteja nessa direção, exclui o projétil da lista e aplica o dano
                    setas.splice(i,1);
                    dano();
                }
            }

            //verifica se o projétil é o mais próximo do personagem pela posição da lista. Caso sim, carrega a imagem vermelha. Se não for, carrega a azul
            if (i !== 0){
                ctx.drawImage(arrow_down, object.x, object.y, object.largura, object.altura);
            }
            else{
                ctx.drawImage(arrow_down_red, object.x, object.y, object.largura, object.altura);
            }
        }

        else if (object.tipo ===3){         //caso o tipo seja 3 (baixo)
            object.y -= velocidade;         //subtrai a velocidade ao valor do Y, para subir
            if (object.y <= 275){           //verifica se o projétil chegou à cabine do personagem
                if (tecla === 40){          //verifica se o escudo está posicionado nessa direção pela variável "tecla"
                    setas.splice(i,1);      //caso o escudo seteja nessa direção, exclui o projétil da lista
                }
                else {                      //caso o escudo não esteja nessa direção, exclui o projétil da lista e aplica o dano
                    setas.splice(i,1);
                    dano();
                }
            }

            //verifica se o projétil é o mais próximo do personagem pela posição da lista. Caso sim, carrega a imagem vermelha. Se não for, carrega a azul
            if (i !== 0){
                ctx.drawImage(arrow_up, object.x, object.y, object.largura, object.altura);
            }
            else{
                ctx.drawImage(arrow_up_red, object.x, object.y, object.largura, object.altura);
            }
        }

        else if (object.tipo ===2){           //caso o tipo seja 2 (esquerda)
            object.x += velocidade;           //soma a velocidade ao valor do X, para ir para a direita
            if (object.x + 16.66 >= 222.22){  //verifica se o projétil chegou à cabine do personagem
                if (tecla === 37){            //verifica se o escudo está posicionado nessa direção pela variável "tecla"
                    setas.splice(i,1);        //caso o escudo seteja nessa direção, exclui o projétil da lista
                }
                else {                        //caso o escudo não esteja nessa direção, exclui o projétil da lista e aplica o dano
                    setas.splice(i,1);
                    dano();
                }
            }

            //verifica se o projétil é o mais próximo do personagem pela posição da lista. Caso sim, carrega a imagem vermelha. Se não for, carrega a azul
            if (i !== 0){
                ctx.drawImage(arrow_right, object.x, object.y, object.largura, object.altura);
            }
            else{
                ctx.drawImage(arrow_right_red, object.x, object.y, object.largura, object.altura);
            }
        }

        else if (object.tipo ===4){     //caso o tipo seja 4 (direita)
            object.x -= velocidade;     //subtrai a velocidade ao valor do X, para ir para a esquerda
            if (object.x <= 275){       //verifica se o projétil chegou à cabine do personagem
                if (tecla === 39){      //verifica se o escudo está posicionado nessa direção pela variável "tecla"
                    setas.splice(i,1);  //caso o escudo seteja nessa direção, exclui o projétil da lista
                }
                else {
                    setas.splice(i,1);  //caso o escudo não esteja nessa direção, exclui o projétil da lista e aplica o dano
                    dano();
                }
            }

            //verifica se o projétil é o mais próximo do personagem pela posição da lista. Caso sim, carrega a imagem vermelha. Se não for, carrega a azul
            if (i !== 0){
                ctx.drawImage(arrow_left, object.x, object.y, object.largura, object.altura);
            }
            else{
                ctx.drawImage(arrow_left_red, object.x, object.y, object.largura, object.altura);
            }
        }

    }

}

function scorecount() {
    scoreframe++;       //aumenta 1 ao scoreframe toda vez que o frame é atualizado

    if (scoreframe % 5 === 0){      //a cada 5 frames aumenta em 1 o score
        score++;
    }

    if (score % 5 === 0){       //a cada 5 de score aumenta a velocidade dos projéteis e diminui o intervalo entre eles
        spawnRate -= 0.8;
        velocidade += 0.0006;
    }

    //mostra o score no canvas
    ctx.fillStyle = "red";
    ctx.font = "16.66px arcadeclassicregular";
    ctx.textAlign = "start";
    ctx.fillText("Score: "+score,375,16.66);

}

function lifecount(){
    //mostra a vida no canvas
    ctx.fillStyle = "red";
    ctx.font = "16.66px arcadeclassicregular";
    ctx.textAlign = "start";
    ctx.fillText("Vida: "+vida+"/3",27.77,16.66);

    if (vida === 0){        //verifica se o jogador esgotou a quantidade de vidas
        tecla = 0;      //caso sim, reseta a variável tecla para não acionar o jogo novamente sem a escolha do jogador
        requestAnimationFrame(gameover);        //função responsável por mostrar as considerações finais e resetar o jogo
    }
    else {
        requestAnimationFrame(desenha);     //se o jogador não esgotou as vidas, executa mais uma vez a função principal
    }
}

function dano(){
    vida -= 1;      //diminui em 1 a quantidade de vidas

    //faz o canvas piscar em vermelho para que o jogador seja notificado do dano
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(0,0,canvas.width,canvas.height);

}

function inicio(){
    if (tecla !== 0){       //verifica se alguma tecla foi pressionada
        requestAnimationFrame(desenha);     //caso sim, executa a função principal
    }
    else{       //caso não, exibe a mensagem "Pressione  qualquer  tecla  para  iniciar" no centro do canvas e executa mais uma vez essa função
        ctx.fillStyle = "red";
        ctx.font = "16.66px arcadeclassicregular";
        ctx.textAlign = "center";
        ctx.fillText("Pressione  qualquer  tecla  para  iniciar",250,250);

        requestAnimationFrame(inicio);
    }
}

function gameover(){
    //caso o jogador tenha esgotado a quantidade de vidas e apertado alguma tecla reseta as variáveis e inicia a função principal
    if (tecla !== 0){
        scoreframe = 0;
        score = 0;
        spawnRate = 3000;
        velocidade = 1;
        vida = 3;
        setas = [];

        requestAnimationFrame(desenha);
    }

    //caso não, notifica ao jogador que esgotou a quantidade de vidas, exibe a pontuação e a mensagem e notifica para pressionar uma tecla para reiniciar
    else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "red";
        ctx.font = "33.33px arcadeclassicregular";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER",250,125);

        ctx.fillStyle = "red";
        ctx.font = "16.66px arcadeclassicregular";
        ctx.textAlign = "center";
        ctx.fillText("SCORE: "+score,250,250);

        ctx.fillStyle = "red";
        ctx.font = "16.66px arcadeclassicregular";
        ctx.textAlign = "center";
        ctx.fillText("Pressione  qualquer  tecla  para  reiniciar",250,375);

        requestAnimationFrame(gameover);
    }
}


requestAnimationFrame(inicio);      //função utilizada para fazer o jogador precisar apertar uma tecla para iniciar o jogo