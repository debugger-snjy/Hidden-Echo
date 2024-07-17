# Project Notes

## Documents Datatype in Mongoose

- Document and Model are distinct classes in Mongoose. The Model class is a subclass of the Document class. When you use the Model constructor, you create a new document.

    ```js
    const MyModel = mongoose.model('Test', newSchema({ name: String }));
    const doc = newMyModel();

    doc instanceof MyModel; // true
    doc instanceof mongoose.Model; // true
    doc instanceof mongoose.Document; // true
    ```

- In Mongoose, a "document" generally means an instance of a model. You should not have to create an instance of the Document class without going through a model.