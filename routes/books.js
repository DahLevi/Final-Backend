let express = require('express');
let router = express.Router();
let bookSchema = require('../models/books');

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error": message});
}

router.post('/', (request, response, next) =>{
    let bookJSON = request.body;
    if (!bookJSON.title)
        HandleError(response, 'Missing Information', 'Form Data Missing', 500);
    else{
        let book = new bookSchema({
            title: bookJSON.title, // firstName: request.body.firstName
            description: bookJSON.description,
            year: bookJSON.year || 1970,
            author : bookJSON.author,
            hardCover: bookJSON.hardCover || false,
            price: bookJSON.price || 15
        });
        book.save( (error) => {
            if (error){
                response.send({"error": error});
            }else{
                response.send({"id": book.id});
            }
        });
    }
});
// Check Post with: db.books.find()

router.get('/', (request, response, next)=>{
    let title = request.query['title'];
    if (title){
        bookSchema
            .find({"title": title})
            .exec( (error, books) =>{
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(books);
                }
            });
    }else{
        bookSchema
            .find()
            .exec( (error, books) =>{
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(books);
                }
            });
    }
});

router.get('/:id', (request, response, next) =>{
    bookSchema
        .findById({"_id": request.params.id}, (error, result) => {
            if (error){
                response.status(500).send(error);
            }else if (result){
                response.send(result);
            }else{
                response.status(404).send({"id": request.params.id, "error": "Not Found (1)"});
            }
        });
});

router.patch('/:id', (request, response, next) => {
    bookSchema
        .findById(request.params.id, (error, result) => {
            if (error) {
                response.status(500).send(error);
            }else if (result){
                if (request.body._id){
                    delete request.body._id;
                }
                for (let field in request.body){
                    result[field] = request.body[field];
                }
                result.save((error, book)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(book);
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found (2)"});
            }
        });
});

router.delete('/:id', (request, response, next) => {
    bookSchema
        .findById(request.params.id, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                result.remove((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send({"deletedId": request.params.id});
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found (3)"});
            }
        });
});
module.exports = router;