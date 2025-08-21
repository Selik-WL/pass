import mongoose from 'mongoose';

export default function connectDB() {
    mongoose.connect(process.env.MONGODB_URL).
    then(() => console.log("Connexion effectuée à MongoDB avec succès!"))
    .catch(error => {
        console.error("Connexion à MongoDB échouée: ", error);
        console.log(error);
        process.exit(1);
    });
}