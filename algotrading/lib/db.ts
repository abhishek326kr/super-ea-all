
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    console.warn('Invalid/Missing environment variable: "MONGODB_URI". Application will run with mock data.');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined | null;
}

if (uri) {
    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            client = new MongoClient(uri, options);
            global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise!;
    } else {
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
    }
} else {
    // Return null or handle mock data logic elsewhere
    clientPromise = null;
}

export default clientPromise;
