const { db } = require("../../util/admin");

exports.getAllDreams = (req, res) => {
  db.collection("dreams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let dreams = [];
      if (data.size > 0) {
        data.forEach((doc) => {
          let dreamData = {
            _id: doc.id,
            data: doc.data(),
          };
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
};

exports.addDream = (req, res) => {
  if (req.body.title === "" && req.body.content === "") {
    res.status(400).json({
      message: "Gerekli alanları doldurunuz!",
      errorCode: "10000",
    });
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
};
