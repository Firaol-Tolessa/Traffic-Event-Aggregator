require("reflect-metadata");
const { assertValidSchema } = require("graphql");
const { AppDataSource } = require("./dataSource");
const { MoreThan, Between } = require("typeorm");

async function initDB() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log("Database connected");
    }
    return AppDataSource;
}

async function createRecord(entity, data) {
    const db = await initDB();
    const repo = db.getRepository(entity);
    const record = repo.create(data);
    return await repo.save(record);
}

async function getAllRecords(entity) {
    const db = await initDB();
    const repo = db.getRepository(entity);
    return await repo.find();
}

// Fetch all events with optional cursor pagination
async function getVehicles(entity, first = 5, after) {
    const db = await initDB();
    const repo = db.getRepository(entity);

    const query = repo.createQueryBuilder("event")
        .leftJoinAndSelect("event.camera", "camera") // <-- preload camera
        .orderBy("event.id", "ASC")
        .take(first);

    if (after) {
        query.where("event.id > :after", { after: parseInt(after, 10) });
    }

    const events = await query.getMany();

    // Cursor pagination structure
    const edges = events.map(event => ({
        cursor: String(event.id),
        node: event,
    }));

    const endCursor = edges.length ? edges[edges.length - 1].cursor : null;
    const hasNextPage = events.length === first;

    return {
        edges,
        pageInfo: {
            endCursor,
            hasNextPage,
        },
    };
}

// Fetch events for a specific vehicle plate
async function getVehicleByPlate(entity, vehiclePlate) {
    const db = await initDB();
    const repo = db.getRepository(entity);
    const events = await repo.find({
        where: { vehiclePlate },
        relations: ["camera"],
        order: { timestamp: "DESC" },
    });
    return events;
}

// Fetch a camera by ID, including its events
async function getCameraById(entity, cameraid) {
    const db = await initDB();
    const repo = db.getRepository(entity);

    return repo.findOne({
        where: { cameraId: cameraid },
        relations: ["events"],
    });
}

// Aggregate stats: total events and average speed
async function getAggregates(entity) {
    const db = await initDB();
    const repo = db.getRepository(entity);
    const totalEvents = await repo.count();
    const avg = await repo
        .createQueryBuilder("event")
        .select("AVG(event.speed)", "avg")
        .getRawOne();

    const avgSpeed = avg.avg;

    return { totalEvents, avgSpeed };
}


async function addCamera(entity, model, location, cameraId) {
    const db = await initDB();
    const repo = db.getRepository(entity);
    const newCam = repo.create({ model, location, cameraId });
    return await repo.save(newCam);
}

async function deleteCamera(entity, cameraId) {
    const db = await initDB();
    const repo = db.getRepository(entity);
    const cam = await repo.findOne({ where: { cameraId } });
    if (!cam) throw new Error("Camera not found");
    await repo.remove(cam);
    return cam;
}

module.exports = {
    initDB,
    createRecord,
    getVehicles,
    getVehicleByPlate,
    getCameraById,
    getAggregates,
    addCamera,
    deleteCamera
};
