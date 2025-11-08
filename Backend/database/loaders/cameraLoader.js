const DataLoader = require("dataloader");
const { Camera } = require("../datamodel/Camera");
function createCameraLoader(db) {
    const cameraRepo = db.getRepository(Camera);
    return new DataLoader(async (cameraIds) => {
        const cameras = await cameraRepo.findByIds(cameraIds);
        const cameraMap = new Map(cameras.map(cam => [cam.cameraId, cam]));
        return cameraIds.map(id => cameraMap.get(id));
    });
}

module.exports = { createCameraLoader };
