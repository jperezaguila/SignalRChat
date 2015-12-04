var chatHub;
var miNombre;
$(document).ready(function() {
    chatHub = $.connection.hubChat;
    registrarEventos();

    //capturar los eventos de peticion. Lo que hace (connection.hub.start()) inicializar la conexion,
    //asincrona nos devuelve onpromise 
    $.connection.hub.start().done(function() {
       
        
        bootbox.prompt("¿Como te llamas?", function(res) {
            if (res != null) {
                miNombre = res;
                chatHub.server.conectar(miNombre);
                registrarLlamadas();
            }
        });
    });
});

//llamadas al servidor
function registrarLlamadas() {
    $("#btnEnv").click(function() {
        var txt = $("#txtMens").val();
        //al generar de forma dimanica y pone las funciones en minusculas solo las clases en Matusculas.
        //cuando arranque js ejecutara server que es una propiedad.
        chatHub.server.enviarMensaje(miNombre, txt);
    });
}

//Clients.Caller.onConectado(usuario.Id, nombre, Usuarios, Mensajes);
//Clients.AllExcept(usuario.Id).onNuevoConectado(usuario.Id, nombre);

//registrar todos los enventos que me envia el servidor a mi. 
function registrarEventos() {
    chatHub.client.onConectado = function(id, nombre, usuarios, mensajes) {
        $.each(usuarios, function(key, obj) {
            var elem = "<li id='us-'" + obj.ID + "'>" + obj.Nombre + "</li";
            $("#conectados").append(elem);
        });

        $.each(mensajes, function (key, obj) {
            var elem = "<p>" + obj.Usuario + " dice" + obj.Contenido + "</p>";
            $("#mensajes").append(elem);
        });
    };
    chatHub.client.onNuevoConectado = function(id, nombre) {
        var elem = "<li id='us-" + id + "'>" + nombre + "<l/i>";
        $("#conectados").append(elem);
        $("#mensajes").append("<p> Se ha conectado" + nombre + "</p>");

    };

    chatHub.client.enviadoMensaje = function(usuaio, mensaje) {
        var elem = "<p>" + usuaio + " dice" + mensaje + "</p>";
        $("#mensajes").append(elem);
    };
    
    chatHub.client.usuarioDesconectado= function(id,nombre) {
        var item = $("#us-" + id);
        $("#conectados").remove(item);
        var elem = "<p>" + nombre + " se ha desconectado</p>";
        $("#mensajes").append(elem);
    }


}