// MongoDB connection string
// Atlas URI comes from env variable; local fallback is only for development
module.exports = {URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/booktrack'};