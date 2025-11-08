
const { EntitySchema } = require("typeorm");


const Event = new EntitySchema({
    name: "Event",
    tableName: "event",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        timestamp: {
            type: "timestamp",
            createDate: true,
        },
        vehiclePlate: {
            type: "varchar",
            nullable: true,
        },
        vehicleType: {
            type: "enum",
            enum: ["car", "truck", "motorcycle", "bus"]
        },
        speed: {
            type: "float",
            nullable: true
        },
        eventHash: {
            type: "varchar",
            nullable: false,
            unique: true,  // ensures no two events with the same hash
        }
    },
    relations: {
        camera: {
            type: "many-to-one",
            target: "Camera",
            joinColumn: { name: "cameraId" },
            inverseSide: "events",
        },
    },
});

module.exports = { Event }