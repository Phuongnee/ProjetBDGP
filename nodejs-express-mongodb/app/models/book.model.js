/**
 * Creation of a schema to define how the records
 * will be made in MongoDB for the book
 */

module.exports = (mongoose) => {
    const Book = mongoose.model(
        "book",
        mongoose.Schema({
            books: [
                {
                    title: String,
                    isbn: String,
                    publicationDate: String,
                    review: String,
                    rating: String,
                },
            ],
            uid: String,
        })
    );

    return Book;
};