const User = require("../models/users");

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
  const dLon = (lon2 - lon1) * (Math.PI / 180); // Convert degrees to radians
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}
const filterWorkerData = (worker) => {
    const { _id, firstName, lastName, role, services, status, rating } = worker;
    return {
      _id,
      firstName,
      lastName,
      role,
      services,
      status,
      rating
    };
  };

// Controller function to get nearby workers without using MongoDB geostatic queries
const getAllWorkers = async (req, res) => {
  const { userId, type } = req.params;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user || !user.latitude || !user.longitude) {
      return res.status(404).json({ error: "User location not available" });
    }

    let allWorkers;

    if (type) {
      allWorkers = await User.find({
        role: "worker",
        status: "online",
        services: { $elemMatch: { name: type } },
      });
    } else {
      allWorkers = await User.find({ role: "worker", status: "online" });
    }

    const workersWithDistance = allWorkers.map((worker) => {
      const distanceFromUser = calculateDistance(
        user.latitude,
        user.longitude,
        worker.latitude,
        worker.longitude
      );
      return {
        ...filterWorkerData(worker),
        distance: distanceFromUser.toFixed(2),
      };
    });

    const filteredDistance = 20;
    const nearbyWorkers = workersWithDistance.filter(
      (worker) => parseFloat(worker.distance) <= filteredDistance
    );

    res.json({ workers: nearbyWorkers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleOnlineStatus = async (req, res) => {
  try {
    const {id} = req.params;
    const {status} = req.body;
    const updatedStatus = await User.findByIdAndUpdate(id, {status}, {new: true}).select("_id firstName lastName role status").lean();
    res.status(200).json({updatedStatus});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 }


module.exports = { getAllWorkers, toggleOnlineStatus};
