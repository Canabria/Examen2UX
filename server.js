//Librerias

//Express
const express = require('express');
const servidor = express();
let port = 3001;
servidor.listen(port, ()=>{
    console.log('Servidor ejecutandose correctamente en el puerto: ', port);
});

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:rkWiLiw7VuFk8ShP@cluster0.l9vwzuj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
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
servidor.post('/createPost', async (req, res)=>{
    try {
        const client = new MongoClient(uri);
        const mainDB = client.db("mainExamenDB");
        const Post = mainDB.collection("Posts");
        const doc = req.body;
        const result = await Post.insertOne(doc);
        console.log(
            `Se inserto un documento con el _id: ${result.insertedId}`,
        );
        res.status(200).send("El Post se creo exitosamente")
    } catch(error){
        res.status(500).send("No se creo el Post, algo salio mal")
    }finally {
        await client.close();
    }
    
})

servidor.get('/listPost', async (req, res)=>{
    try {
        const client = new MongoClient(uri);
        const mainDB = client.db("mainExamenDB");
        const Post = mainDB.collection("Posts");
        const query = {};
        const options = {
            sort: { Titulo: 1 },
        };
        const cursor = Post.find(query, options);
        if ((await Post.countDocuments(query)) === 0) {
            res.status(500).send("No se encontraron Posts")
        }else{
            let arr = []
            for await (const doc of cursor) {
                console.dir(doc);
                arr.push(doc)
            }
            res.status(200).send({
                documentos: arr,
            });
        }
        
    } catch(error){
        res.status(500).send("Algo salio mal")
        console.log(error);
    }finally {
        await client.close();
    } 
    run().catch(console.dir);
})

servidor.put('/editPost/:id', async (req, res)=>{
    try {
        const client = new MongoClient(uri);
        const mainDB = client.db("mainExamenDB");
        const Post = mainDB.collection("Posts");
        const filter = {id:req.params.id};
        const options = { upsert: true };
        const updateDoc = {
            $set: {
            ...req.body,
          },
        };
        const result = await Post.updateOne(filter, updateDoc, options);
        console.log(
            `${result.matchedCount} documento cumplio con las caracteristicas establecidas, se actualizaron ${result.modifiedCount} documento(s)`,
         );
        res.status(200).send("El post se actualizo correctamente")
    } catch(error){
        res.status(500).send("Algo salio mal, no se pudo actualizar el post")
        console.log(error);
    }finally {
        await client.close();
    } 
    run().catch(console.dir);
})

servidor.delete('/deletePost/:id', async (req, res)=>{
    try {
        const client = new MongoClient(uri);
        const mainDB = client.db("mainExamenDB");
        const Post = mainDB.collection("Posts");
        const query = {id:req.params.id};
        const result = await Post.deleteOne(query);
        if (result.deletedCount === 1) {
            console.log("Se borro el Post correctamente");
            res.status(200).send("Se borro el Post correctamente")
        } else {
            console.log("Ningun Post concuerda con la informacion brindada, no se borro ninguno");
        }
    } catch(error){
        res.status(500).send("Algo salio mal, no se pudo borrar el post")
        console.log(error);
    }finally {
        await client.close();
    } 
    run().catch(console.dir);
})


