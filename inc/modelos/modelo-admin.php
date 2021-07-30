<?php

$accion = $_POST['accion'];
$contraseña = $_POST['pass'];
$usuario = $_POST['user'];

if ($accion === 'crear') {
    // Crear administradores

    // hashear contraseña
    $opciones = array('cost' => 12);
    $hash_contraseña = password_hash($contraseña, PASSWORD_BCRYPT, $opciones);

    // almacenar el password en la BD
    // 1) crear conexion
    include '../funciones/conexion.php';

    try {
        // Realizar la consulta a la BD
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?)");
        $stmt->bind_param('ss', $usuario, $hash_contraseña);
        $stmt->execute();
        if ($stmt->affected_rows > 0) { //un error en affected_rows arroja -1 por eso lo ponemos >0
            $respuesta = array(
                'respuesta' => 'correcto',
                'usuario' => $usuario,
                'id_insertado' => $stmt->insert_id,
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
        //Capturar la excepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}

if ($accion === 'login') {
    // codigo para logear administradores
    // 1) crear conexions
    include '../funciones/conexion.php';

    try {
        // seleccionar el admin de la BD
        $stmt = $conn->prepare("SELECT id, usuario, password FROM usuarios WHERE usuario = ?");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        // Logear el usuario
        $stmt->bind_result($id_usuario, $nombre_usuario, $pass_usuario);
        $stmt->fetch();
        if ($nombre_usuario) {
            // El usuario existe, verificar password
            if (password_verify($contraseña, $pass_usuario)) {
                // Iniciar la sesion:
                session_start();
                $_SESSION['nombre'] = $usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;
                // Login correcto
                $respuesta = array (
                    'respuesta' => 'correcto',
                    'usuario' => $nombre_usuario,
                    'tipo' => $accion
                );
            }else{
                // Login incorrecto
                $respuesta = array(
                    'resultado' => 'Password incorrecto'
                );
            }
        }else{ 
            $respuesta = array(
                'error' => 'Usuario no existe'
            );
        }
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        //Capturar la excepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($respuesta);
}

// habitacion 1821





// die (json_encode($_POST));
// El corazon de PHP son los arreglos
// El corazon de JS son los objetos
// Ambos se comunican con JSON