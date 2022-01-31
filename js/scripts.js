function start(){

    // CRIAR ELEMENTOS

    $("#inicio").hide();
    $("#reinicio").remove();
    $("#botao").remove();

    $("#fundoGame").append("<div id='jogador' class='animacao1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='animacao2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='animacao3'></div>");
    $("#fundoGame").append("<div id='text'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    // VARIAVEIS

    var jogo = {};

    var teclas = {
        w:87,
        s:83,
        d:68
    }

    jogo.pressionou = [];

    $(document).keydown(function(valor){
        jogo.pressionou[valor.which] = true;
    });

    $(document).keyup(function(valor){
        jogo.pressionou[valor.which] = false;
    });

    var velocidadeInimigo1 = 5;
    var velocidadeInimigo2 = 3;
    var velocidadeAmigo = 1;
    var posicaoInimigoY = parseInt(Math.random()  * 350);
    var permissão = true;
    var end = false;
    var tentativas = 3;
    var pontos = 0;
    var amigosSalvos = 0;
   
    //sons

    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");

   //MOVIMENTOS

    jogo.timer = setInterval(loop,30);

    function loop (){
        
        if (end === false) {
            somGameover.pause();
            moveFundo();
            moveJogador();
            moveInimigo();
            moveInimigo2();
            moveAmigo();
            colisao();
            status();
        }

        else{
            fimdejogo();
            clearInterval(jogo.timer);
            jogo.timer = null;
        }
    }

    function moveFundo(){

        const esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda-1);

    }

    function moveJogador(){

        const top = parseInt($("#jogador").css("top"));

        if(jogo.pressionou[teclas.w] && top>10){
            
            $("#jogador").css("top", top-10)
        }

        if(jogo.pressionou[teclas.s] && top<470){
            $("#jogador").css("top", top+10)
        }

        if (jogo.pressionou[teclas.d]){
            disparar();
        }
    }

    function moveInimigo(){
        posicaoInimigoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoInimigoX - velocidadeInimigo1);
        $("#inimigo1").css("top", posicaoInimigoY);
        
        if(posicaoInimigoX<0){
            $("#inimigo1").css("left", 694);
            posicaoInimigoY =  parseInt(Math.random()*350);
            $("#inimigo1").css("top", posicaoInimigoY);
        }
    }

    function moveInimigo2(){
        posicaoInimigo2 = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoInimigo2 - velocidadeInimigo2);

        if(posicaoInimigo2 < 0){
            $("#inimigo2").css("left", 755);
        }
    }

    function moveAmigo(){
        posicaoAmigo = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoAmigo + velocidadeAmigo);

        if (posicaoAmigo > 900){    
            $("#amigo").css("left", 0);
            pontos = pontos + 1525;
            amigosSalvos = amigosSalvos + 1;
            somResgate.play();
        }
    }

    function disparar(){

        if(permissão){
            permissão = false;

            tiroX = parseInt($("#jogador").css("top")) + 40;
            tiroY = parseInt($("#jogador").css("left")) + 190;
            
            $("#fundoGame").append("<div id='disparo'></div>");
            $("#disparo").css("top", tiroX);
            $("#disparo").css("left", tiroY);

            tempoTiro =  window.setInterval(tiro,30);
            somDisparo.play();
            
        }

    }

    function tiro(){
        posicaoTiroX = parseInt($("#disparo").css("left"));
        $("#disparo").css("left", posicaoTiroX + 30 );

        if(posicaoTiroX > 900){
            clearInterval(tempoTiro)
            tempoTiro = null;
            $("#disparo").remove();
            permissão = true;
        }

    
    }

    function colisao(){

        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#amigo").collision($("#inimigo2")));
       

        if (colisao1.length>0 || colisao3.length>0){

            posicaoX1 = parseInt($("#inimigo1").css("left"));
            posicaoY1 = parseInt($("#inimigo1").css("top"));
            explosao1(posicaoX1, posicaoY1);
            reposiciona1();

            function reposiciona1(){
                var tempoColisao1 = window.setInterval(reposicionar, 1200);
                $("#inimigo1").remove();

                function reposicionar(){
                    if (end ===  false){
                        window.clearInterval(tempoColisao1);
                        tempoColisao1 = null;
                        $("#fundoGame").append("<div id='inimigo1' class='animacao2'></div>");
                        $("#inimigo1").css("left", 694);
                        posicaoInimigoY =  parseInt(Math.random()*350);
                        $("#inimigo1").css("top", posicaoInimigoY);
                    }
                }
            }
        }
        
        
        if (colisao2.length>0 || colisao4.length>0){

            posicaoX2 = parseInt($("#inimigo2").css("left"));
            posicaoY2 = parseInt($("#inimigo2").css("top"));
            explosao1(posicaoX2, posicaoY2);
            reposiciona2();

            function reposiciona2(){
                var tempoColisao2 = window.setInterval(reposicionar2, 2000);
                $("#inimigo2").remove();

                function reposicionar2(){
                    if (end === false){
                        window.clearInterval(tempoColisao2);
                        tempoColisao2 = null;
                        $("#fundoGame").append("<div id='inimigo2'></div>");
                        $("#inimigo2").css("left", 745);
                    }
                }
            }
        }

        if(colisao3.length>0 || colisao4.length>0){
            pontos = pontos + 50;
            velocidadeInimigo1 += 0.1;
            velocidadeInimigo2 += 0.1;
            $("#disparo").hide();
        }

        if(colisao1.length>0 || colisao2.length>0){
            tentativas = tentativas -1;
        }

        a = parseInt($("#inimigo2").css("left"));

        if(colisao5.length>0 && a < 700){
            posicaoX3 = parseInt($("#amigo").css("left"));
            explosao2(posicaoX3);

            var tempoMorte = window.setInterval(retiraMorte,300);
                function retiraMorte(){

                    window.clearInterval(tempoMorte);
                    tempoMorte = null;
                        $("#morte").remove();
                }
            
            somPerdido.play();
            reposiciona3();
            tentativas--;

            function reposiciona3(){
                           
                var tempoColisao3 = window.setInterval(reposicionar3, 2000);


                function reposicionar3(){
                    if(end === false){
                        window.clearInterval(tempoColisao3);
                        tempoColisao3 = null;
                        $("#fundoGame").append("<div id='amigo' class='animacao3'></div>");
                        $("#amigo").css("left", 0);
                    }
                }
            }
        }
    }

    function explosao1(posicaoX, posicaoY){
        $("#fundoGame").append("<div id='explosao1'></div>");
        $("#explosao1").css("background-image", "url(imgs/explosao.png)");
        var e = $("#explosao1");
        e.css("left", posicaoX);
        e.css("top", posicaoY);
        e.animate({width:200, opacity:0.5}, "slow");
        somExplosao.play();

        var tempoExplosao1 = window.setInterval(removeExplosao1, 500);
        function removeExplosao1(){
            e.remove();
            window.clearInterval(tempoExplosao1);
            tempoExplosao1 = null;

        }
    }

    function explosao2(x){
       
        $("#amigo").remove();
        $("#fundoGame").append("<div id='morte' class='animacao4'></div>");
        $("#morte").css("left", x);
        $("#morte").css("top", 500);
        
        
    }
    
    function status(){
        document.getElementById("text").textContent="PONTOS: " + pontos;
            if (tentativas === 1){
            $("#energia").css("background-image", "url(imgs/energia1.png)");
        }
         if (tentativas === 2){
             $("#energia").css("background-image", "url(imgs/energia2.png)");
        }
        if (tentativas === 3){
             $("#energia").css("background-image", "url(imgs/energia3.png)");
        }
        if(tentativas<1){ 
             $("#energia").css("background-image", "url(imgs/energia0.png)");
            end = true;}
    }

    function fimdejogo(){
        somGameover.play();
        $("#text").remove();
        $("#amigo").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#explosao").remove(); 
        $("#jogador").remove(); 
        $("#fundoGame").append("<div id='reinicio'></div>");
        $("#fundoGame").append("<button id='botao' onclick='start()'></button>");
        document.getElementById("reinicio").textContent = "Você obteve " + pontos + " pontos. "+ amigosSalvos+ " refugiados foram protegidos com êxito";
        document.getElementById("botao").textContent = "Clique aqui para reiniciar!";

    }
   
   
} 