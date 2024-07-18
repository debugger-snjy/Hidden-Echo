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

## Workflow of Registering User (Algorithm)
- Code Should effectively handles both scenarios :
    - Registering a new user
    - Updating an existing but unverified user account with a new password and verification code

- Flow : [Might Update the Flow Later]
    ```js
    IF existingUserByEmail EXISTS THEN
        IF existingUserByEmail.isVerified THEN
            // The User is Already Saved in the Database
            success : false;
        ELSE
            // save the updated user
        END IF
    ELSE
        // Create a new user with he provided details
        // Save the New User
    END IF
    ```