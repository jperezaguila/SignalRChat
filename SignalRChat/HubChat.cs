using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Security.Permissions;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using SignalRChat.Modelo;

namespace SignalRChat
{
    public class HubChat : Hub
    {
        public List<Usuario> Usuarios= new List<Usuario>();
        public List<Mensaje> Mensajes=new List<Mensaje>();

        //Se llama desde el cliente, y guarda al usuaio dentro de la lista usuarios.
        public void Conectar(String nombre)
        {
            var usuario = new Usuario()
            {
                Id = Context.ConnectionId,
                Nombre = nombre,
             };
            Usuarios.Add(usuario);
            if (Usuarios.All(o=>o.Id !=usuario.Id))
            {
                //Clients.Caller - onConectado(creado) le doy el id, nombre y mensajes
                Clients.Caller.onConectado(usuario.Id, nombre, Usuarios, Mensajes);
                //Allxcepted. no enviara mensaje  al usuario conectado.
                Clients.AllExcept(usuario.Id).onNuevoConectado(usuario.Id, nombre);
            }

        }

        public void EnviarMensaje(String usuario, string mensaje)
        {
            Mensajes.Add(new Mensaje() {Contenido = mensaje,Usuario = usuario});
            if (Mensajes.Count>30)
            {
                Mensajes.RemoveAt(0);

            }
            Clients.All.enviadoMensaje(usuario, mensaje);
        }

        //creacion de funcion para saber usuarios conectados y desconectados, 
        //metodo ondisconected lo sobreescibimos y definimos nuestro propio codigo
        public override Task OnDisconnected(bool stopCalled)
        {
            var item = Usuarios.FirstOrDefault(o => o.Id == Context.ConnectionId);
            if (item!=null)
            {
                Usuarios.Remove(item);
                Clients.All.usuarioDesconectado(item.Id, item.Nombre);
            }
            return base.OnDisconnected(stopCalled);
        }
    }
 
 
}