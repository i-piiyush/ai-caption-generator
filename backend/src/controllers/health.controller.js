const mongoose = require('mongoose');

const healthController = (req, res) => {
  try {
    const mongoConnectionState = mongoose.connection.readyState;
    let dbStatus = 'unknown';

    // Map Mongoose's numeric state to a human-readable string
    switch (mongoConnectionState) {
      case 0:
        dbStatus = 'disconnected';
        break;
      case 1:
        dbStatus = 'connected';
        break;
      case 2:
        dbStatus = 'connecting';
        break;
      case 3:
        dbStatus = 'disconnecting';
        break;
    }

    // Determine the overall status and HTTP response code
    const isReady = mongoConnectionState === 1;
    const httpStatusCode = isReady ? 200 : 503; // 503 Service Unavailable

    res.status(httpStatusCode).json({
      message: "backend woke up",
      status: isReady ? "ready" : "not_ready",
      database: {
        status: dbStatus
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "An error occurred in the health check controller",
      error: error.message
    });
  }
};

module.exports = healthController;
