const db = require("../models/");
const BookDB = db.book;

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  BookDB.create({
    books: req.body.books,
    uid: req.body.uid,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the book.",
      });
    });
};

exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  BookDB.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving books.",
      });
    });
};

exports.getListOfUser = (req, res) => {
  const uid = req.params.uid;

  var condition = uid
    ? { uid: { $regex: new RegExp(uid), $options: "i" } }
    : {};

  BookDB.find(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "Not found book list for user " + uid,
        });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving user book list with id " + uid,
      });
    });
};

exports.findOne = (req, res) => {
  const uid = req.params.uid;
  const isbn = req.params.isbn;

  var condition =
    uid && isbn ? { uid: uid, books: { $elemMatch: { isbn: isbn } } } : {};

  BookDB.findOne(condition)
    .then((data) => {
      if (data) {
        const book = data.books.find((b) => b.isbn === isbn);
        res.send(JSON.stringify(book));
      } else res.status(404).send("Not found book with id: " + isbn);
    })
    .catch((err) => {
      if (err.status === 500)
        res.status(500).send({
          message: "Error retrieving book with id " + err,
        });
      else res.status(404).send("Not found book with id: ");
    });
};

exports.addBookToList = (req, res) => {
  const uid = req.params.uid;

  BookDB.collection
    .updateOne({ uid: uid }, { $push: { books: req.body.books } })
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found book with id: " + uid });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating book with id " + uid,
      });
    });
};

exports.update = (req, res) => {
  const uid = req.params.uid;
  const isbn = req.params.isbn;

  BookDB.collection
    .findOneAndUpdate(
      { uid: uid, "books.isbn": isbn },
      { $set: { "books.$": req.body } }
    )
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found book with id " + isbn });
      else res.send({ message: "Book was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating book with id " + isbn,
      });
    });
};

exports.delete = (req, res) => {
  const uid = req.params.uid;
  const isbn = req.params.isbn;

  BookDB.collection
    .updateOne({ uid: uid }, { $pull: { books: { isbn: isbn } } })
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found book with id " + isbn });
      else res.send({ message: "Book was deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete book with id " + isbn,
      });
    });
};

exports.deleteAll = (req, res) => {
  const uid = req.params.uid;

  BookDB.deleteMany({ uid: uid })
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Books were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all books.",
      });
    });
};

exports.findByDateReading = (req, res) => {
  const uid = req.params.uid;
  const dateReading = req.params.dateReading;

  BookDB.aggregate([
    { $match: { uid: uid } },
    { $unwind: "$books" },
    {
      $match: {
        "books.dateReading": { $in: [new RegExp(`.*${dateReading}.*`, "i")] },
      },
    },
  ])
    .then((data) => {
      if (!data || data.length === 0) {
        res.status(404).send({
          message: `Cannot find book with dateReading ${dateReading}.`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving book with dateReading " + dateReading,
      });
    });
};

exports.findByNote = (req, res) => {
  const uid = req.params.uid;
  const note = req.params.note;

  BookDB.aggregate([
    { $match: { uid: uid } },
    { $unwind: "$books" },
    { $match: { "books.note": { $in: [new RegExp(`.*${note}.*`, "i")] } } },
  ])
    .then((data) => {
      if (!data || data.length === 0) {
        res.status(404).send({
          message: `Cannot find book with note ${note}.`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving book with note " + note,
      });
    });
};

exports.findByAvis = (req, res) => {
  const uid = req.params.uid;
  const avis = req.params.avis;

  BookDB.aggregate([
    { $match: { uid: uid } },
    { $unwind: "$books" },
    { $match: { "books.avis": { $in: [new RegExp(`.*${avis}.*`, "i")] } } },
  ])
    .then((data) => {
      if (!data || data.length === 0) {
        res.status(404).send({
          message: `Cannot find book with avis ${avis}.`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving book with avis " + avis,
      });
    });
};
