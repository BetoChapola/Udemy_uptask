eventListeners();

// Seleccionamos la lista de proyectos
listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {

    // Document Ready
    document.addEventListener('DOMContentLoaded', function () {
        actualizarProgreso();
    });

    // botón que crea un nuevo proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    // Crear una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    // Botones para las acciones de tareas (Usaremos la técnica "delegation"): El delegation se usa en la función "accionesTareas()"
    // usaremos el mismo evento para diferentes elementos.
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e) {
    e.preventDefault();

    // Crear un input para el nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // Seleccionar el ID con el nuevo proyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    // al presionar "enter" se crea el nuevo proyecto
    inputNuevoProyecto.addEventListener('keypress', function (e) {
        var tecla = e.which || e.keyCode;
        if (tecla === 13) {
            guardarProyectoBD(inputNuevoProyecto.value);
            // aquí eliminamos el input. Pero ya tenemos su valor y se lo pasamos a la otra función:
            // guardarProyectoBD, entonces continuamos en esa función para mostrarlo en la lista.
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

// Guardamos el proyecto en la BD y lo agregamos a la lista de proyectos
function guardarProyectoBD(nombreProyecto) {
    // Crear llamado Ajax
    var xhr = new XMLHttpRequest();

    // Enviar los datos por el FormData()
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('tipo', 'crear');


    // Abrir la conexión con el archivo PHP
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    // Respuesta del archivo
    xhr.onload = function () {
        if (this.status === 200) {
            // obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var resultado = respuesta.respuesta,
                id_proyecto = respuesta.id_insertado,
                proyecto = respuesta.nombre_proyecto,
                tipo = respuesta.tipo;

            // Comprobar la inserción
            if (resultado === 'correcto') {
                // fue exitoso
                if (tipo === 'crear') {
                    // Se creo un nuevo proyecto
                    // inyectar el HTML
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                            ${proyecto}
                        </a>
                    `;
                    listaProyectos.appendChild(nuevoProyecto);
                    // Enviar la alerta
                    Swal.fire({
                        icon: 'success',
                        title: 'Proyecto creado',
                        text: 'El proyecto: ' + proyecto + ' se creó correctamente'
                    })
                    // Redireccionar a la nueva URL
                    .then(resultado =>{
                        if (resultado.value) {
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        }
                    })
                } else {
                    // Se actualizo o elimino el proyecto
                }
            } else {
                // hubo un error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al crear el proyecto'
                })
            }

        }
    };

    // Enviar el request
    xhr.send(datos);
}

// Agregar una nueva tarea al proyecto actual
function agregarTarea(e) {
    e.preventDefault();

    var nombreTarea = document.querySelector('.nombre-tarea').value;
    // Validar que el campo contenga algo
    if (nombreTarea === '') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La tarea no puede ir vacía.'
          })
    }else{
        // Si hay una tarea en el campo, insertar en DB

        // Crear llamado a Ajax
        var xhr = new XMLHttpRequest();

        // Enviar los datos por el FormData()
        var datos = new FormData();
            datos.append('id_proyecto', document.querySelector('#id_proyecto').value);
            datos.append('tarea', nombreTarea);
            datos.append('tipo', 'crear');
            
        // Abrir la conexion con el archivo PHP
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        // Respuesta del archivo
        xhr.onload = function () {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                // Asignamos valores
                var id_insertado = respuesta.id_insertado,
                    tarea = respuesta.nombre_tarea,
                    resultado = respuesta.respuesta,
                    tipo = respuesta.tipo;

                    if (resultado === 'correcto') {
                        // La tarea se inserto correctamente
                        if (tipo === 'crear') {
                            // Lanzar la alerta
                            Swal.fire({
                                icon: 'success',
                                title: 'Tarea Creada.',
                                text: 'La tarea: "' + tarea + '" se inserto correctamente.'
                            })

                            // Seleccionar el párrafo con la clase lista-vacia
                            var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                            if (parrafoListaVacia.length > 0) {
                                document.querySelector('.lista-vacia').remove();
                            }

                            // Construir el template
                            var nuevaTarea = document.createElement('li');
                            // la etiqueta debe quedar así: <li id="tarea: " class="tarea">
                            // por lo que vamos a agregarle un ID y una clase
                            nuevaTarea.id = 'tarea:' + id_insertado;
                            nuevaTarea.classList.add('tarea');
                            // Construimos el HTML:
                            nuevaTarea.innerHTML = `
                                <p>${tarea}</p>
                                <div class="acciones">
                                    <i class="far fa-check-circle"></i>
                                    <i class="fas fa-trash"></i>
                                </div>
                            `;

                            // Agregarlo al HTML
                            var listado = document.querySelector('.listado-pendientes ul');
                            listado.appendChild(nuevaTarea);

                            // Limpiar el formulario
                            document.querySelector('.agregar-tarea').reset();

                            // Llamamos a la función de actualizar
                            actualizarProgreso();
                        }
                    }else{
                        // Hubo un error al insertar la tarea
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al crear la tarea.'
                        })
                    }
            }
        }

        // Enviar los datos
        xhr.send(datos);
    }

}

// Cambia el estado de las tareas o las elimina
function accionesTareas(e) {
    e.preventDefault();

    // Si hiciste click en el icono de "palomita"
    if (e.target.classList.contains('fa-check-circle')) {
        // Si en elemento esta activa la clase "completo" quiere decir que la tarea esta terminada.
        // Podemos desactivar la clase para indicar que no está terminada.
        if (e.target.classList.contains('completo')) {
            // Podemos desactivar la clase para indicar que no está terminada.
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        }else{
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }

    // Si hiciste click en el boton "eliminar"
    if (e.target.classList.contains('fa-trash')) {
        // Antes de eliminar la tarea se envía una alerta
        Swal.fire({
            title: '¿Deseas eliminar la tarea?',
            text: "La tarea será eliminada.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, eliminar la tarea!'
          }).then((result) => {
            // Si la respuesta fue "SI": 
            if (result.isConfirmed) {
                
                // Guardamos el elemento <li></li> a eliminar en una variable:
                var tareaEliminar = e.target.parentElement.parentElement;
                // Borrar de la BD
                tareaEliminarBD(tareaEliminar);
                // Borrar del HTML
                tareaEliminar.remove();

              Swal.fire(
                'Eliminado!',
                'La tarea ha sido eliminada correctamente.',
                'success'
              )
            }
          })
    }
}

function cambiarEstadoTarea(tarea, estado) {
    // Cambia el estado de una tarea
    // console.log(tarea.parentElement.parentElement.id.split(':'));
    var idTarea = tarea.parentElement.parentElement.id.split(':');
    

    // Crear el llamado a Ajax
    var xhr = new XMLHttpRequest();

    // Enviar la información en el FormData()
    datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('tipo', 'actualizar');
    datos.append('estado', estado);
    

    // Abrir la conexion al archivo PHP
    xhr.open('POST','inc/modelos/modelo-tareas.php', true);
    
    // Respuesta del archivo
    xhr.onload = function () {
        if (this.status === 200) {
            // la tarea
            console.log(JSON.parse(xhr.responseText));

            // Llamamos a la función de actualizar
            actualizarProgreso();
        }
    }
    // Enviar los datos
    xhr.send(datos);
}

function tareaEliminarBD(tarea) {
    var idTarea = tarea.id.split(':');
    

    // Crear el llamado a Ajax
    var xhr = new XMLHttpRequest();

    // Enviar la información en el FormData()
    datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('tipo', 'eliminar');
    

    // Abrir la conexion al archivo PHP
    xhr.open('POST','inc/modelos/modelo-tareas.php', true);
    
    // Respuesta del archivo
    xhr.onload = function () {
        if (this.status === 200) {
            // la tarea
            console.log(JSON.parse(xhr.responseText));

            // Comprobar que haya tareas restantes:
            var listaTareasRestantes = document.querySelectorAll('li.tarea');

            if (listaTareasRestantes.length === 0) {
                document.querySelector('.listado-pendientes ul').innerHTML = 
                "<p class='lista-vacia'>Aun no hay tareas en este proyecto.</p>";
            }

            // Llamamos a la función de actualizar
            actualizarProgreso();
        }
    }
    // Enviar los datos
    xhr.send(datos);
}

// Actualizar el avance del proyecto (barra de porcentaje)
function actualizarProgreso() {
    
    // Tomar todas las tareas disponibles:
    const tareas = document.querySelectorAll('li.tarea');
    
    // Obtener las tareas completadas:
    const tareasCompletadas = document.querySelectorAll('i.completo');
    
    // Determinar el avance:
    const avance = Math.round((tareasCompletadas.length / tareas.length)*100)

    // Asignar el avance a la barra:
    const porcentaje = document.querySelector('#porcentaje')
    porcentaje.style.width = avance+'%';

    // Mostrar una alerta al completar el 100%
    if (avance === 100) {
        Swal.fire({
            icon: 'success',
            title: 'Proyecto terminado.',
            text: 'Has completado todas las tareas.'
        })
    }
}