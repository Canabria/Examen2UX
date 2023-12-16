//Librerias

//Express
const express = require('express');
const servidor = express();
let port = 3001;
servidor.listen(port, ()=>{
    console.log('Servidor ejecutandose correctamente en el puerto: ', port);
});


async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}
run().catch(console.dir);

const {initializeApp} = require("firebase/app");

const {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification} = require("firebase/auth");
const firebaseConfig = {
  apiKey: "AIzaSyDMYLBCwpo6UCW3cowLj6-8fpYAWO7O0bA",
  authDomain: "examenux-48e6d.firebaseapp.com",
  projectId: "examenux-48e6d",
  storageBucket: "examenux-48e6d.appspot.com",
  messagingSenderId: "391485743850",
  appId: "1:391485743850:web:66c54056eb8093ba366d93",
  measurementId: "G-1XCY1Q8935"
};

const app = initializeApp(firebaseConfig);
//body-parser
const bodyParser = require('body-parser');
var urlEncodeParser = bodyParser.urlencoded({extended:true});
servidor.use(urlEncodeParser);
//Cors
const path = require('path');
//Path 
const cors = require('cors');
servidor.use(cors());

//EndPoints solicitados
servidor.post("/createUser",  (req, res) => {
    const auth = getAuth(app);
    const email = req.body.email;
    const password = req.body.password;
    createUserWithEmailAndPassword(auth, email, password)
      .then((resp) => {
          res.status(200).send({
          msg: "Usuario creado exitosamente",
          data: resp,
        });
        sendEmailVerification(auth.currentUser).then(()=>{
          console.log('Se envio el correo de verificacion');
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        res.status(500).send({
          msg: "Error al crear el usuario",
          errorCode: errorCode,
          errorMsg: errorMessage,
        }); 
    });
  })

servidor.post("/logIn",  (req, res) => {
    try {
      const auth = getAuth(app);
      const email = req.body.email;
      const password = req.body.password;
      signInWithEmailAndPassword(auth, email, password)
        .then((resp) => {
            res.status(200).send({
            msg: "Sesion iniciada",
            data: resp,
          })
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          res.status(500).send({
            msg: "Error al iniciar sesion, credenciales incorrectas", 
            errorCode: errorCode,
            errorMsg: errorMessage,
          });
    });
    } catch (error) {
      const errorCode = error.code;
        const errorMessage = error.message;
        res.status(500).send({
          msg: "Error al iniciar sesion, credenciales incorrectas", 
          errorCode: errorCode,
          errorMsg: errorMessage,
        });
    }
});

servidor.post("/logOut",  (res) => {
    const auth = getAuth(app);
    signOut(auth).then(() => {
      console.log('Se cerro bien la sesion');
    }).catch((error) => {
      console.log('Hubo un error');
    });
});



