Para este hito numero 3 se realizo la HU numero 6, donde los pacientes pueden mandar solicitudes para agendar horas. Dichas
horas son revisadas por el jefe de unidad para aceptarlas o no, cualquier decision repercutira en un cambio para la base
de datos, por ejemplo mostrando en el calendario las horas aceptadas. Para probar todas esas funcionalidades tendremos al 
paciente Nicolas con el rut 202073507-7 coon clave 123 para probar en generar aquellas solicitudes, y despues comprobar en la base
de datos. La otra funcionalidad se la llevara el jefe de unidad, que para este caso hay una cuenta de Diego con el rut
20398972-5 y clave 123, el tiene cuenta de tipo jefe de unidad para poder visualizar las solicitudes en una lista con las 
opciones de aceptar o rechazar, cabe recalcar que solo ese tipo de cuenta puede visualizar las solicitudes, por lo tanto
las cuentas de tipo medico no podran ver aquella lista.

Como se realizo la HU numero 6 esto provoco un cambio en la estructura del modelo de dominio, donde tambien se actualizo correspondientemente en la wiki

Se arreglo la observacion del hito anterior sobre estado de las horas "Pendiente" y "Completado", donde ambas 
mostraran los resultados, cuando realmente solo las horas con el estado "Completado" deben de mostrar aquellos resultados.
