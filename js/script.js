$(document).ready(function () {
  //ydn.db.deleteDatabase('db-lista');

  //INICIALIZANDO O BANCO DE DADOS
  var schema = {
    stores:[{
      name:'lista',
      keyPath: 'timeStamp'
    }]
  };
  var db = new ydn.db.Storage('db-lista', schema);

  var adicionar = function () {
      //ELEMENTO LISTA (HTML)
      var elementoLista = $('#lista');
      //ELEMENTO MENSAGEM (INPUT)
      var elementoMensagem = $('#mensagem');
      //JSON DE DADOS A SEREM SALVOS (REGISTRO)
      var dados = {
        timeStamp: new Date().getTime(), //KEY
        mensagem: elementoMensagem.val() //CAMPO
      };
      //INSETIR ITEM NA LISTA (DB)
      var evPut = db.put('lista', dados);
      evPut.done(function(_key) {
        //AO ADICIONAR, RECUPERAR O OBJETO INSERIDO
        db.get('lista',_key).done(function(_item){
          //INCLUI O ITEM NA LISTA (HTML)
          renderItem(_item);
        });
      });
      //TRATAMENTO CASO OCORRA ERRO
      evPut.fail(function(_e) {
        console.error('ERRO AO INSERIR',_e);
      });

      //LIMPA O CAMPO MENSAGEM (INPUT)
      elementoMensagem.val('');
    };

    //FUNÇÃO QUE ADICIONA O ITEM NA LISTA (HTML)
    var renderItem = function(_item) {
      //ELEMENTO LISTA (HTML)
      var elementoLista = $('#lista');
      //ELEMENTO ITEM DA LISTA
      var p = $('<p class="list-group-item"></p>');
      //ELEMENTO BOTÃO REMOVER
      p.append('<a href="" id="'+_item.timeStamp+'" class="pull-right remover">&times;</a>');
      //ADICIONA A MENSAGEM NO ITEM
      p.append(_item.mensagem);
      //ADICIONA O ITEM NA LISTA
      elementoLista.prepend(p); //append
    };

    var remover = function(_key) {
      //_key está vindo como string, porém foi salva como inteiro
      _key = parseInt(_key);
      //REMOVE O ITEM DA LISTA (PELA KEY)
      var evRemove = db.remove('lista', _key);
      //EM CASO DE SUCESSO, //REMOVE O ITEM DA LISTA HTML
      evRemove.done(function(n){
        //SE n=0 então não excluiu!
        if (n>0) {
          $('#'+_key).parent().remove();
        } else {
          //TRANTAR O ERRO!
          console.log('ERRO AO REMOVER')
        }
      });
      //TRATAMENTO EM CASO DE ERRO
      evRemove.fail(function(e) {
        console.error('ERRO AO REMOVER', e);
      });
    };

    //ASSIM QUE O BANCO ESTIVER OK, RECUPERAR LISTA
    db.onReady(function() {
      //LISTA A LISTA HTML
      $('#lista').html('');
      //RECUPERA A LISTA PREVIAMENTE SALVA
      //RECUPERA OS ITENS DA LISTA
      df = db.values('lista');
      //AGUARDA RECUPERAR OS ITENS DO BANCO
      df.done(function(_itens) {
        var totalItens = _itens.length; //TOTAL DE ITENS
        for (var i = 0; i < totalItens; i++) {
          //INCLUI O ITEM NA LISTA (HTML)
          renderItem(_itens[i]);
        }
      });
      //TRATAMENTO DE ERRO AO RECUPERAR ITENS DB
      df.fail(function(_e) {
        console.error('ERRO AO LER ITENS',_e);
      });
    });

    //EVENTO DE CLICK DO BOTÃO PUBLICAR
    $('#publicar').click(function () {
        adicionar();
    });

    //EVENTO DE CLICK DO BOTÃO REMOVER
    $(document).on('click','.remover',function(_e) {
      _e.preventDefault();
      if (confirm("DESEJA REMOVER O ITEM SELECIONADO?")==true) {
        var key = $(this).attr('id');
        remover(key);
      }
    });

});
