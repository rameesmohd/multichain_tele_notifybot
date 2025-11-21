const dotenv = require('dotenv');
const express = require('express');
dotenv.config();
const app = express();
app.use(express.json()); 

require('./cron_jobs');
const PORT = process.env.PORT || 7000

app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});
