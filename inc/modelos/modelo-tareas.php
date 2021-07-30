<?php
$accion = $_POST['tipo'];

// Crear tarea
if (isset($_POST['id_proyecto']) && isset($_POST['tarea'])) {

    $id_proyecto = (int) $_POST['id_proyecto'];
    $tarea = $_POST['tarea'];

    if ($accion === 'crear') {

        // almacenar la tarea en la BD
        // 1) crear conexión
        include '../funciones/conexion.php';
    
        try {
            // Realizar la consulta a la BD
            $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?)");
            $stmt->bind_param('si', $tarea, $id_proyecto);
            $stmt->execute();
            if ($stmt->affected_rows > 0) { //un error en affected_rows arroja -1 por eso lo ponemos >0
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado' => $stmt->insert_id,
                    'nombre_tarea' => $tarea,
                    'tipo' => $accion
                );
            }else{
                $respuesta = array(
                    'respuesta' => 'error'
                );
            }
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            //Capturar la excepción
            $respuesta = array(
                'error' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);
    }
}

// Actualizar tarea
if (isset($_POST['estado']) && isset($_POST['id'])) {

    $estado = $_POST['estado'];
    $id_tarea = (int) $_POST['id'];

    if ($accion === 'actualizar') {
        // modificar el estado de la tarea en la BD
        // 1) crear conexión
        include '../funciones/conexion.php';
    
        try {
            // Realizar la consulta a la BD
            $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ?");
            $stmt->bind_param('ii', $estado, $id_tarea);
            $stmt->execute();
            if ($stmt->affected_rows > 0) { //un error en affected_rows arroja -1 por eso lo ponemos >0
                $respuesta = array(
                    'respuesta' => 'correcto'
                );
            }else{
                $respuesta = array(
                    'respuesta' => 'error'
                );
            }
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            //Capturar la excepción
            $respuesta = array(
                'error' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);
    }
}

// Eliminar tarea
if (isset($_POST['id'])) {

    $id_tarea = (int) $_POST['id'];

    if ($accion === 'eliminar') {
        // Eliminar la tarea de la tarea en la BD
        // 1) crear conexión
        include '../funciones/conexion.php';
    
        try {
            // Realizar la consulta a la BD
            $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ?");
            $stmt->bind_param('i', $id_tarea);
            $stmt->execute();
            if ($stmt->affected_rows > 0) { //un error en affected_rows arroja -1 por eso lo ponemos >0
                $respuesta = array(
                    'respuesta' => 'correcto'
                );
            }else{
                $respuesta = array(
                    'respuesta' => 'error'
                );
            }
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            //Capturar la excepción
            $respuesta = array(
                'error' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);
    }
}
