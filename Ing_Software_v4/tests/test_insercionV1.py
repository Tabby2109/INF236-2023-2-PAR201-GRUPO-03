import unittest
import requests
from datetime import datetime
from pymongo import MongoClient

class TestInserciones(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        #Establece la conexion a la base de datos de MongoDB
        cls.client = MongoClient('mongodb+srv://Nicolas_Oli:XNiUbtLHKl5Du5TS@bd-proyecto.efmj8sg.mongodb.net')
        cls.db = cls.client['test']
        cls.collection = cls.db['horas']
        cls.lista_agregados = []
        cls.calendar_url = "http://localhost:5000/api/addEvent"

        #Lista para borrar en la bd
        cls.lista_agregados = []


        #Data para insercion
        fechaI_calendar = datetime(2024, 5, 10, 12, 30, 0)
        fechaF_calendar = datetime(2024, 5, 10, 13, 30, 0)
        fechaI_str = fechaI_calendar.isoformat()
        fechaF_str = fechaF_calendar.isoformat()
        descripcion_calendar = {
            "nombre_paciente_desc": "Satoru Gojo",
            "telefono": "+8152223465",
            "rut_paciente": "99999999-9"
        }
        cls.data_calendar = {
            "nombre_paciente": "Paciente",
            "inicio_fecha": fechaI_str,
            "final_fecha": fechaF_str,
            "description": descripcion_calendar,
            "tipoExamen": "Radiografía",
            "rut_PA": "20.1",
            "EstadoExamen": "Pendiente",
        }

        #Esta es una lista para probar distintos ruts dentro del software:
        #En esta lista el unico rut que deberia ser valido deberia ser el ultimo, los demás deberia tirar algun error
        cls.lista_ruts = ["hola", "?¡!??¡#", 1234, 12.5, "12.560.123-5", "125601235", "16222333-9"]

        #Crear datos de descripcion y hora para la prueba de inputs de formulario
        cls.horas = []
        for i in range(len(cls.lista_ruts)):
            descripcion = {
                "nombre_paciente_desc": f"Jujutsu Kaisen {i}",
                "telefono": "+8152223465",
                "rut_paciente": cls.lista_ruts[i]
            }
            hora = {
                "nombre_paciente": f"Paciente Jujutsu {i}",
                "inicio_fecha": fechaI_str,
                "final_fecha": fechaF_str,
                "description": descripcion,
                "tipoExamen": "Radiografía",
                "rut_PA": f"20.{i}",
                "EstadoExamen": "Pendiente",
            }
            cls.horas.append(hora)

    @classmethod
    def tearDownClass(cls):
        #Eliminar cada elemento agregado de la lista

        for registro in cls.lista_agregados:
            cls.collection.delete_many({
                "nombre_paciente": registro["nombre_paciente"],
                "tipoExamen": registro["tipoExamen"],
                "rut_PA": registro["rut_PA"],
                "description.rut_paciente": str(registro["description"]["rut_paciente"])
            })

        cls.lista_agregados.clear()

        del cls.data_calendar
        
        for hora in cls.horas:
            del hora
        del cls.horas
        
        #Cierra la conexión a la base de datos despues de cada prueba
        cls.client.close()


    #Aqui se testea multiples inserciones de una misma hora de una misma persona
    def test_inserciones(self):
        count = 0
        #Se tratan de añadir 5 horas con el mismo paciente en la misma hora (de normal no deberia permitirse)
        for _ in range(5):
            response = requests.post(self.calendar_url, json=self.data_calendar)
            if response.status_code == 201:
                #Se añade a la lista de agregados
                self.lista_agregados.append(self.data_calendar)
                #Si hay exito con añadir la hora, sumamos 1
                count += 1

        #Si se cuenta mas de una insercion en la bd, significa que no esta funcionando correctamente
        self.assertEqual(count, 1, "Solo debe haber 1 insercion")

    #Aqui se testea uqe pasa se se ingresa de forma inadecuada el rut del paciente
    def test_insercion_ruts(self):

        count = 0
        for hora in self.horas:
            response = requests.post(self.calendar_url, json=hora)
            if response.status_code == 201:
                #Se añade a la lista de agregados
                self.lista_agregados.append(hora)
                #Si hay exito con añadir la hora, sumamos 1
                count += 1
        
        #El software deberia dejar solo 1 inserciones de todos los intentos anteriores de rut
        self.assertEqual(count, 1, "En total el software debe dejar insertar 1 hora de las testeadas")


if __name__ == '__main__':
    unittest.main()
