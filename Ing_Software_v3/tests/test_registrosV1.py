import unittest
import requests
from pymongo import MongoClient


class RegisterTests(unittest.TestCase):
    registro_valido = None
    registro_invalido = None

    @classmethod
    def setUpClass(cls):
        cls.client = MongoClient('mongodb+srv://Nicolas_Oli:XNiUbtLHKl5Du5TS@bd-proyecto.efmj8sg.mongodb.net')
        cls.db = cls.client['test']
        cls.collection = cls.db['users']
        cls.base_url = "http://localhost:5000/api/register"

        #Lista para borrar en la bd
        cls.lista_agregados = []
        
        cls.registro_valido = {
            "email": "hola@gmail.com",
            "password": "123",
            "nombre": "Pedro",
            "apellido": "González",
            "tipo": "medico",
            "rut": "23053812-0"
        }

        cls.registro_valido2 = {
            "email": "hola2@gmail.com",
            "password": "1234",
            "nombre": "Pedro2",
            "apellido": "González2",
            "tipo": "medico",
            "rut": "23053812-2"
        }

        cls.registro_invalido = {
            "email": "94384",
            "password": "invalid",
            "nombre": "643265",
            "apellido": "32453",
            "tipo": "medico",
            "rut": "número"
        }
    
    @classmethod
    def tearDownClass(cls):

        for registro in cls.lista_agregados:
            cls.collection.delete_many({
                "username": registro["email"],
                "password": registro["password"],
                "nombre": registro["nombre"],
                "apellido": registro["apellido"],
                "tipo": registro["tipo"],
                "rut": registro["rut"]
            })

        del cls.registro_valido
        del cls.registro_invalido
        del cls.registro_valido2


    def test_registro_valido(self):
        response = requests.post(self.base_url, json=self.registro_valido)
        self.lista_agregados.append(self.registro_valido)
        self.assertEqual(response.status_code, 201, "Debe aceptar registro")
    
    def test_registro_invalido(self):
        response = requests.post(self.base_url, json=self.registro_invalido)
        self.lista_agregados.append(self.registro_invalido)
        self.assertEqual(response.status_code, 400, "Debe arrojar error")

    
    def test_registro_multiple(self):
        i = 0
        count = 0
        while i < 5:
            response = requests.post(self.base_url, json=self.registro_valido2)
            if response.status_code == 201:
                self.lista_agregados.append(self.registro_valido2)
                count+=1
            i+=1
        self.assertEqual(count, 1, "Solo debe permiter hacer 1 registro")
    

if __name__ == '__main__':
    unittest.main()
