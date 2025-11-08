const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require('@apollo/server/standalone');
const { expressMiddleware } = require('@as-integrations/express5');
const { gql } = require("graphql")

const express = require('express');
const { expressYupMiddleware } = require('express-yup-middleware');
const { createHash } = require("node:crypto");

const cors = require("cors");

const eventSchemaValidator = require("../database/datamodel/event.schema");
const { Event } = require("../database/datamodel/Event");
const { Camera } = require("../database/datamodel/Camera");
const {
    initDB,
    createRecord,
    getVehicles,
    getVehicleByPlate,
    getCameraById,
    getAggregates,
    addCamera,
    deleteCamera } = require("../database/dbConnection");
const { createCameraLoader } = require("../database/loaders/cameraLoader");

const app = express();
app.use(cors());
app.use(express.json());

const BUFFER_WINDOW = 10000; //in milli seconds

let date = new Date();




const typeDefs = `
type Event{
    id: ID!
    timestamp : String!
    vehiclePlate : String!
    vehicleType : String!
    speed : Float
    camera: Camera!
}

type Camera{
    model : String!
    location : String!
    cameraId : String!
    events: [Event!]!
}


type EventEdge {
  cursor: String!
  node: Event!
}


type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
}
  
type EventConnection {
  edges: [EventEdge!]!
  pageInfo: PageInfo!
}

type Query {
    getVehicles(first: Int!, after: String): EventConnection!
    getVehicle(vehiclePlate: String!): [Event!]
    getCameraById(cameraId: String!): Camera
    getAggregates: Aggregate!

  }

type Mutation{
    addCamera (model : String! , location : String!, cameraId : String!) : Camera
    deleteCamera (cameraId : String!) : Camera
  }

type Aggregate {
  totalEvents: Int!
  avgSpeed: Float
}
`

const resolvers = {
    Query: {
        getVehicles: (_, { first, after }) => getVehicles(Event, first, after),
        getVehicle: (_, { vehiclePlate }) => getVehicleByPlate(Event, vehiclePlate),
        getCameraById: (_, { cameraId }) => getCameraById(Camera, cameraId),
        getAggregates: () => getAggregates(Event),
    },
    Mutation: {
        addCamera: (_, { model, location, cameraId }) => addCamera(Camera, model, location, cameraId),
        deleteCamera: (_, { cameraId }) => deleteCamera(Camera, cameraId)
    },
    Event: {
        camera: (parent) => {
            return parent.camera; // already loaded by leftJoinAndSelect
        },
    },

}


const start = () => (async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async () => {
            const db = await initDB();
            return {
                db,
                cameraLoader: createCameraLoader(db),
            };
        },
    });
    await server.start();

    app.use(
        "/graphql",
        expressMiddleware(server, {

        })
    );

    app.post('/api/events',
        expressYupMiddleware({ schemaValidator: eventSchemaValidator }),
        (req, res) => {

            const event = req.body;
            // Handeling forign key defination insertion to entery
            // [ Needs to be sent as an object not just a field]
            event.camera = { cameraId: event.cameraId };

            // Timeframe to check if the event is of same vehicle  
            const eventTime = new Date(event.timestamp);
            const timeBucket = Math.floor(eventTime.getTime() / (BUFFER_WINDOW));

            // Remove timestamp from the hash value calculation
            const { ['timestamp']: _, ...filteredEvent } = event;
            filteredEvent.time = timeBucket;

            // Convert the event into string and hash it
            const values = Object.values(filteredEvent).join().replace(" ", "");
            const eventHash = createHash('sha256').update(values).digest('hex');
            event.eventHash = eventHash;

            // Call database create event function
            createRecord(Event, event)
                .then(result => {
                    console.log("Event recorderd ", event);
                    res.status(200);
                    res.send("Event recorded");
                })
                .catch(error => {
                    res.status(400);
                    res.send("Event not recorded");
                    console.error;
                });

            console.log(eventHash);
        }
    )
    app.listen(3000, () =>
        console.log("🚀 Server running at http://localhost:3000/graphql")
    );
})();

start();