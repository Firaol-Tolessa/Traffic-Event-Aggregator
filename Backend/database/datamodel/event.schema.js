const { object, string } = require('yup');
const yup = require('yup');


const VEHICLE_TYPES = {
    car: "car",
    truck: "truck",
    motorcycle: "motorcycle",
    bus: "bus"
};


const eventValidation = {
    schema: {
        body: {
            yupSchema: yup.object({
                cameraId: yup.string().required("Camera Id not provided"),
                timestamp: yup.string().required("Time stamp not provided"),
                vehiclePlate: yup.string().required("vehicle license plate not provided "),
                vehicleType: yup.mixed().oneOf(Object.values(VEHICLE_TYPES)).required("Vehicle type not provided")
            }),
        },
    },
};

module.exports = eventValidation;