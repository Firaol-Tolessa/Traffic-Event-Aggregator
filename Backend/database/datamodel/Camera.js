const { EntitySchema } = require("typeorm");

const Camera = new EntitySchema({
    name: "Camera",
    tableName: "camera",
    columns: {
        cameraId: {
            type: "varchar",
            primary: true,
        },
        model: { type: "varchar" },
        location: { type: "varchar" }
    },
    relations: {
        events: {
            type: "one-to-many",
            target: "Event",
            inverseSide: "camera",
        },
    },
});

module.exports = { Camera };
