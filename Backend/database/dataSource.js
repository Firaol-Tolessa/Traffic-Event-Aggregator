require("reflect-metadata");
const { DataSource } = require("typeorm");
const { Camera } = require("./datamodel/Camera");
const { Event } = require("./datamodel/Event");

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "postgres",
    password: "test",
    database: "traffic_aggregator",
    synchronize: true, // TODO : change this to false fo production
    logging: true,
    entities: [Camera, Event],
    migrations: [],
    subscribers: [],
});

module.exports = { AppDataSource };
