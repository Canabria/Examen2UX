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



