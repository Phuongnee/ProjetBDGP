/**
 * Configuration des routes pour récupérer ou accéder
 * aux différentes données pour les livres
 */

module.exports = (app) => {
    const book = require("../controllers/book.controller.js");
  
    var router = require("express").Router();
  
    // Create a new book
    router.post("/", book.create);
  
    router.post("/:uid", book.addBookToList);
  
    // Retrieve all books
    router.get("/", book.findAll);
  
    // Retrieve a list of user
    router.get("/:uid", book.getListOfUser);
  
    // Retrieve a single book with uid and isbn
    router.get("/:uid/:isbn", book.findOne);
  
    // Update a book with uid and isbn
    router.put("/:uid/:isbn", book.update);
  
    // Delete a book with uid and isbn
    router.delete("/:uid/:isbn", book.delete);
  
    // Delete all books for a specific user
    router.delete("/:uid", book.deleteAll);
  
    // Find all books by date of reading
    router.get("/:uid/dateReading/:dateReading", book.findByDateReading);
  
    // Find all books by note
    router.get("/:uid/note/:note", book.findByNote);
  
    // Find all books by avis
    router.get("/:uid/avis/:avis", book.findByAvis);
  
    app.use('/api/books', router);
  };