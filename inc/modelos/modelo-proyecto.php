<?php

$proyecto = $_POST['proyecto'];
$accion = $_POST['tipo'];

if ($accion === 'crear') {

    // almacenar el proyecto en la BD
    // 1) crear conexión
    include '../funciones/conexion.php';

    try {
        // Realizar la consulta a la BD
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?)");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) { //un error en affected_rows arroja -1 por eso lo ponemos >0
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'nombre_proyecto' => $proyecto,
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