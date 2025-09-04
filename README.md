# QA-_XAcademy-TicketazoRegistro_Automation
Repo del ejercicio de la clase nº 7 de la automatización de la vista de Registro de la pagina Ticketazo


** Test cases ** 

Casos Positivos (Happy Path)

"Registro exitoso con todos los datos válidos"
- Nombres/Apellido completos
- Teléfono de 10 dígitos
- DNI de 8 dígitos
- Provincia y Localidad seleccionadas
- Fecha válida y mayor de edad
- Email correcto y confirmado
- Contraseña y Repetir contraseña iguales (mínimo 8 caracteres, combinación válida)
** Resultado esperado: Mensaje de éxito y redirección a login


"Validación de maxlength en Teléfono y DNI"
- Teléfono: no permite escribir más de 10
- DNI: no permite escribir más de 8
** Resultado esperado: Los campos limitan la entrada y no se rompe el formulario.


"Enmascaramiento de contraseñas"
Al escribir en ambos campos, los caracteres aparecen como puntos/asteriscos.

----------------------------------------------------------------------------------

Casos Negativos (Negative Path)

- Campos obligatorios vacíos
Acción: Click en Registrarse sin completar nada.
** Resultado Esperado: El formulario no se envía; los campos requeridos se marcan como inválidos; se mantiene en /auth/registerUser.

- Formato inválido de Email
Acción: Ingresar un valor sin @ ni dominio válido (ej. no-es-email).
** Resultado Esperado: Campo de email inválido (typeMismatch); el formulario no avanza.

- Email y Confirmar Email distintos
Acción: Ingresar a@a.com y confirmar con b@b.com.
** Resultado Esperado: El formulario bloquea el envío; se mantiene en /auth/registerUser; la UI debería mostrar mensaje de error (“emails no coinciden”).

- Contraseña y Repetir contraseña distintos
Acción: Ingresar Secret123! y confirmar con Secret123.
** Resultado Esperado: El formulario bloquea el envío; se mantiene en /auth/registerUser; la UI debería mostrar mensaje de error (“las contraseñas no coinciden”).

- Contraseña menor a 8 caracteres
Acción: Ingresar Abc123 (6 caracteres).
** Resultado Esperado: Campo de contraseña inválido por longitud mínima; no avanza; la UI debería mostrar mensaje (“mínimo 8 caracteres”).

- Teléfono inválido (letras o longitud <10)
Acción: Ingresar abc123 o 123456789 (9 dígitos).
** Resultado Esperado: Campo inválido por pattern; el formulario no se envía.

- DNI inválido (letras o longitud <8)
Acción: Ingresar abcd1234 o 1234567 (7 dígitos).
** Resultado Esperado: Campo inválido; el formulario no se envía.

- Fecha de nacimiento imposible
Acción: Ingresar 31/02/2000.
** Resultado Esperado: Campo de fecha inválido; el formulario no avanza; no redirige.

- Edad no permitida (<18 años)
Acción: Ingresar fecha que corresponde a 16 años.
** Resultado Esperado: El formulario bloquea el envío; la UI debería mostrar mensaje de error (“debe ser mayor de 18 años”).

- Provincia y Localidad no seleccionadas
Acción: Completar todo menos Provincia/Localidad.
** Resultado Esperado: Campos inválidos; el formulario no avanza; no redirige.

- Localidad seleccionada sin Provincia previa
Acción: Dejar Provincia vacía pero completar Localidad.
** Resultado Esperado: El formulario no avanza; debería mostrar error de dependencia (Provincia requerida antes que Localidad).

- Prevención de doble submit
Acción: Hacer doble click rápido en Registrarse.
**Resultado Esperado: Se envía una sola vez (se intercepta un solo request al backend).

- Error de servidor 422 (duplicado)
Acción: Completar datos válidos con email ya existente; backend responde 422.
** Resultado Esperado: El formulario no redirige; se mantiene en /auth/registerUser; los campos conservan valores; la UI debería mostrar mensaje (“ya existe una cuenta con ese email”).
