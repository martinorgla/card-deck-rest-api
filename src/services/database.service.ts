import * as mongoDB from "mongodb";

export const collections: { cardDecks?: mongoDB.Collection } = {};

export async function connectToDatabase() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient("mongodb://mongodb-local");

    await client.connect();

    const db: mongoDB.Db = client.db("card-deck");

    const DbCollections = await db.collections();

    if (DbCollections.findIndex((collection) => collection.collectionName !== "cardDecks") !== -1) {
        await db.createCollection("cardDecks").then(() => {
            db.command({
                "collMod": "cardDecks",
                "validator": {
                    $jsonSchema: {
                        bsonType: "object",
                        required: ["deckId", "type", "shuffled", "initialSize", "remaining"],
                        additionalProperties: true,
                        properties: {
                            _id: {},
                            deckId: {
                                bsonType: "string",
                                description: "'deckId' is required and is a string"
                            },
                            type: {
                                bsonType: "string",
                                description: "'type' is required and is a string"
                            },
                            shuffled: {
                                bsonType: "bool",
                                description: "'shuffled' is required and is a boolean"
                            },
                            initialSize: {
                                bsonType: "number",
                                description: "'initialSize' is required and is a number"
                            },
                            remaining: {
                                bsonType: "number",
                                description: "'remaining' is required and is a number"
                            },
                            seed: {
                                bsonType: "string",
                                description: "'seed' is optional and is a string"
                            }
                        }
                    }
                }
            });
        });
    }

    const cardDecksCollection: mongoDB.Collection = db.collection("cardDecks");

    collections.cardDecks = cardDecksCollection;

    console.log(`Connected to database: ${db.databaseName}, collection: ${cardDecksCollection.collectionName}`);
}
