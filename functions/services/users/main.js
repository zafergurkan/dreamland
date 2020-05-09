const { admin, db } = require("../../util/admin");

const firebase = require("firebase");
const configFirebase = require("../../util/config/config");
firebase.initializeApp(configFirebase);

//core stuff
const {validateSignupData} = require("../../util/core/dreams");;

//signup function
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    username: req.body.username,
    userFirstName: req.body.userFirstName,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  const noImage = "img.png";
  let token, userId;
  let userData = {};

  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({
          message: "Bu kullanıcı adı daha önce alınmış!",
          errorCode: "20000",
        });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userData = data.user;
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        username: newUser.username,
        userFirstName: newUser.userFirstName,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${configFirebase.storageBucket}/o/${noImage}?alt=media`,
        userId,
      };
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({
        token: token,
        userData: userData,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({
          message: "Email adresi ile daha önce kullanıcı kaydı oluşturulmuş",
          errorCode: "20001",
        });
      } else {
        return res.status(500).json({
          message:
            "Kullanıcı kaydı yapılırken beklenmedik bir sistem hatası yaşandı. Lütfen daha sonra tekrar deneyiniz.",
          errorCode: "90000",
        });
      }
    });
};
