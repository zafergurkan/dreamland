/*
@author zafer.bilal.gurkan
@date 09.05.2020
@description vuejs ile yapmayı planladığım sitenin backend kısmını firebase functions ile başladım.
*/
"use strict"; //javascript için katı kural kontrolleri sağlar.
const functions = require("firebase-functions");
const admin = require("firebase-admin"); //npm install firebase-admin

var serviceAccount = require("./util/key/key.json"); //firebase>proje ayarları > hizmet hesapları >yeni özel anahtar
admin.initializeApp({
  //kimlik doğrulama
  credential: admin.credential.cert(serviceAccount), //firebase sertifika ayarları
  databaseURL: "https://askidahayallerim.firebaseio.com",
});
const db = admin.firestore(); //veritabanı erişimi
const express = require("express"); // npm install express
const app = express(); // express nesnesi oluşturma

const cors = require("cors"); //npm install cors
app.use(cors()); //tarayıcı güvenlik protokolleri için gerekli

app.get("/dreams", (req, res) => {
  db.collection("dreams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let dreams = [];
      if (data.size > 0) {
        data.forEach((doc) => {
          let dreamData = {
            _id : doc.id,
            data : doc.data()
          }
          dreams.push(dreamData);
        });
        return res.json(dreams);
      } else
        return res.status(500).json({ message: "Henüz gönderi oluşturulmadı" });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Tüm hayalleri listeleme sırasında bir hata oldu.",
        errorMessage: err,
        errorCode: "10001",
      });
    });
});

app.post("/dream", (req, res) => {
  // ...url/api/dream
  if (req.body.title === "" && req.body.content === "") {
    res.status(400).json({ message: "Gerekli alanları doldurunuz!" });
  }
  const newDream = {
    dreamTitle: req.body.dreamTitle,
    dreamContent: req.body.dreamContent,
    dreamImage: req.body.dreamImage,
    username: req.body.username,
    userFirstName: req.body.userFirstName,
    userImage: req.body.userImage,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("dreams")
    .add(newDream)
    .then((doc) => {
      const responseDream = {
        message: "Gönderi başarı ile oluşturuldu.",
        data: newDream,
        id: doc.id,
        serverPath: doc.path,
      };
      return res.json(responseDream);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Ekleme sırasında bir hata oldu.",
        errorMessage: err,
        errorCode: "10002",
      });
    });
});

exports.api = functions.region("europe-west1").https.onRequest(app); //firebase function isteklerini yakalamak için
