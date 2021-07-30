eventListeners();

function eventListeners() {
    document.querySelector('#formulario'),addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo =  document.querySelector('#tipo').value;

    if (usuario === '' || password === '') {
        // datos incorrectos
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Ambos campos son necesarios.',
          })
    } else{
        // Campos completos
        // Creamos el formData() para enviar los datos al formulario. Datos que se envían al servidor:
        var datos = new FormData();
        datos.append('user', usuario);
        datos.append('pass', password);
        datos.append('accion', tipo);

        // Crear el llamado a Ajax
        var xhr = new XMLHttpRequest();

        // abrir la conexión al documento PHP que recibe los datos
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        // recibimos la respuesta desde el servidor desde el archivo PHP (retorno de datos)
        xhr.onload = function () {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
               
                // respuesta correcta
                if (respuesta.respuesta === 'correcto') {
                    // si es un nuevo usuario:
                    if (respuesta.tipo === 'crear') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Excelente',
                            text: 'El usuario ' + respuesta.usuario + ' ha sido creado correctamente'
                          })
                    }else if (respuesta.tipo === 'login') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Excelente',
                            text: 'Bienvenido ' + respuesta.usuario
                          })
                          .then(resultado =>{
                              if (resultado.value) {
                                  window.location.href = 'index.php';
                              }
                          })
                    }
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al generar la consulta'
                      })
                }
                console.log(respuesta);
            }
        }

        // Enviamos la peticion
        xhr.send(datos);
    }
}