const pool = require("../config/dbconnect");
const tryCatch = require("../utils/tryCatch");

module.exports.getWeight=tryCatch(async (req,res,next)=>{
    const { startDate, endDate } = req.query;
    const user_id=req.user.id;
  if (!startDate || !endDate || !user_id ) {
    return res.status(400).json({ error: 'Please provide both startDate and endDate' });
  }
  const query = `
    SELECT * FROM weight_records
    WHERE recorded_at_timestamp BETWEEN $1 AND $2 AND user_id=$3
  `;                                                                            
    const row = await pool.query(query, [startDate, endDate,user_id]);
    return res.status(201).json({
        "message":"New weight Record added for the user",
        data:{
            weightRecord:row.rows
        }
    })
})


module.exports.putWeight=tryCatch(async(req,res,next)=>{
    const {timestamp,weight}=req.body;
    const user_id=req.user.id;
    const row=await pool.query('INSERT INTO weight_records (user_id,timestamp,weight) VALUES($1,$2,$3) RETURNING *',[user_id,new Date(timestamp),weight]);
    return res.status(201).json({
        "message":"New weight Record added for the user",
        data:{
            weightRecord:row.rows[0]
        }
    })
});

module.exports.updateWeight=tryCatch(async(req,res,next)=>{
    const {id}=req.params;
    const {weight}=req.body;

    const row=await pool.query('UPDATE weight_records SET weight=$1 WHERE id=$2 RETURNING *',[weight,id]);
    return res.status(200).json({
        "message":"Weight Record updated for the user",
        data:{
            weightRecord:row.rows[0]
        }
    });
})

module.exports.deleteWeight=tryCatch(async(req,res,next)=>{
    const {id}=req.params;
    const row=await pool.query('DELETE FROM weight_records WHERE id=$1',[id]);
    return res.status(204).json({
        "message":"Weight Record deleted for the user",
    });
});


exports.getHeight = tryCatch(async (req, res, next) => {
    const { startDate, endDate} = req.query;
    const user_id=req.user.id;
    if (!startDate || !endDate || !user_id) {
      return res.status(400).json({ error: 'Please provide both startDate and endDate' });
    }
    const query = `
      SELECT * FROM height_records
      WHERE recorded_at_timestamp BETWEEN $1 AND $2 AND user_id=$3
    `;
    const row = await pool.query(query, [startDate, endDate,user_id]);
    return res.status(200).json({
      message: "Height records retrieved successfully",
      data: {
        heightRecords: row.rows
      }
    });
  });

  // Add a new height record
exports.putHeight = tryCatch(async (req, res, next) => {
    const {  timestamp, height } = req.body; 
    const id=req.user.id;
    console.log(req.user)
    const row = await pool.query('INSERT INTO height_records (user_id, recorded_at_timestamp, height) VALUES($1, $2, $3) RETURNING *', [id, new Date(timestamp), height]);
    return res.status(201).json({
      message: "New height record added for the user",
      data: {
        heightRecord: row.rows[0]
      }
    });
  });

  
// Update an existing height record
exports.updateHeight = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { height } = req.body;
    const row = await pool.query('UPDATE height_records SET height=$1 WHERE id=$2 RETURNING *', [height, id]);
    return res.status(200).json({
      message: "Height record updated for the user",
      data: {
        heightRecord: row.rows[0]
      }
    });
  });
  
  // Delete a height record
  exports.deleteHeight = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    await pool.query('DELETE FROM height_records WHERE id=$1', [id]);
    return res.status(204).json({
      message: "Height record deleted for the user"
    });
  });
  

  
// Get sleep records between two dates
exports.getSleep = tryCatch(async (req, res, next) => {
    const { startDate, endDate } = req.query;
    const user_id=req.user.id;
    if (!startDate || !endDate || !user_id) {
      return res.status(400).json({ error: 'Please provide both startDate and endDate' });
    }
    const query = `
      SELECT * FROM sleep_records
      WHERE sleep_start_time BETWEEN $1 AND $2 AND user_id=$3
    `;
    const row = await pool.query(query, [startDate, endDate,user_id]);
    return res.status(200).json({
      message: "Sleep records retrieved successfully",
      data: {
        sleepRecords: row.rows
      }
    });
  });
  
  // Add a new sleep record
  exports.putSleep = tryCatch(async (req, res, next) => {
    const {sleep_time, sleep_start_time, sleep_end_time } = req.body;
    const user_id=req.user.id;

    const row = await pool.query('INSERT INTO sleep_records (user_id, sleep_time, sleep_start_time, sleep_end_time) VALUES($1, $2, $3, $4) RETURNING *', [user_id, sleep_time, new Date(sleep_start_time), new Date(sleep_end_time)]);
    return res.status(201).json({
      message: "New sleep record added for the user",
      data: {
        sleepRecord: row.rows[0]
      }
    });
  });
  
  // Update an existing sleep record
  exports.updateSleep = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { sleep_time, sleep_start_time, sleep_end_time } = req.body;
    const row = await pool.query('UPDATE sleep_records SET sleep_time=$1, sleep_start_time=$2, sleep_end_time=$3 WHERE id=$4 RETURNING *', [sleep_time, new Date(sleep_start_time), new Date(sleep_end_time), id]);
    return res.status(200).json({
      message: "Sleep record updated for the user",
      data: {
        sleepRecord: row.rows[0]
      }
    });
  });
  
  // Delete a sleep record
  exports.deleteSleep = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    await pool.query('DELETE FROM sleep_records WHERE id=$1', [id]);
    return res.status(204).json({
      message: "Sleep record deleted for the user"
    });
  });



  
// Get glucose records between two dates
exports.getGlucose = tryCatch(async (req, res, next) => {
    const { startDate, endDate} = req.query;
    const user_id=req.user.id;
    if (!startDate || !endDate || !user_id) {
      return res.status(400).json({ error: 'Please provide both startDate and endDate' });
    }
    const query = `
      SELECT * FROM glucose_records
      WHERE timestamp BETWEEN $1 AND $2 AND user_id=$3
    `;
    const row = await pool.query(query, [startDate, endDate,user_id]);
    return res.status(200).json({
      message: "Glucose records retrieved successfully",
      data: {
        glucoseRecords: row.rows
      }
    });
  });
  
  // Add a new glucose record
  exports.putGlucose = tryCatch(async (req, res, next) => {
    const {  timestamp, glucose_level } = req.body;
    const user_id=req.user.id;
    const row = await pool.query('INSERT INTO blood_glucose_records (user_id, timestamp, glucose_level) VALUES($1, $2, $3) RETURNING *', [user_id, new Date(timestamp), glucose_level]);
    return res.status(201).json({
      message: "New glucose record added for the user",
      data: {
        glucoseRecord: row.rows[0]
      }
    });
  });
  
  // Update an existing glucose record
  exports.updateGlucose = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { timestamp, value } = req.body;
    const row = await pool.query('UPDATE glucose_records SET timestamp=$1, value=$2 WHERE id=$3 RETURNING *', [new Date(timestamp), value, id]);
    return res.status(200).json({
      message: "Glucose record updated for the user",
      data: {
        glucoseRecord: row.rows[0]
      }
    });
  });
  
  // Delete a glucose record
  exports.deleteGlucose = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    await pool.query('DELETE FROM glucose_records WHERE id=$1', [id]);
    return res.status(204).json({
      message: "Glucose record deleted for the user"
    });
  });

  // Get temperature records between two dates
exports.getTemperature = tryCatch(async (req, res, next) => {
    const { startDate, endDate } = req.query;
    const user_id=req.user.id;
    if (!startDate || !endDate || !user_id) {
      return res.status(400).json({ error: 'Please provide both startDate and endDate' });
    }
    const query = `
      SELECT * FROM temperature_records
      WHERE timestamp BETWEEN $1 AND $2 AND user_id=$3
    `;
    const row = await pool.query(query, [startDate, endDate,user_id]);
    return res.status(200).json({
      message: "Temperature records retrieved successfully",
      data: {
        temperatureRecords: row.rows
      }
    });
  });
  
  // Add a new temperature record
  exports.putTemperature = tryCatch(async (req, res, next) => {
    const { timestamp, value } = req.body;
    const user_id=req.user.id;
    const row = await pool.query('INSERT INTO temperature_records (user_id, timestamp, value) VALUES($1, $2, $3) RETURNING *', [user_id, new Date(timestamp), value]);
    return res.status(201).json({
      message: "New temperature record added for the user",
      data: {
        temperatureRecord: row.rows[0]
      }
    });
  });
  
  // Update an existing temperature record
  exports.updateTemperature = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { value } = req.body;
    const row = await pool.query('UPDATE temperature_records SET  value=$1 WHERE id=$2 RETURNING *', [value, id]);
    return res.status(200).json({
      message: "Temperature record updated for the user",
      data: {
        temperatureRecord: row.rows[0]
      }
    });
  });
  
  // Delete a temperature record
  exports.deleteTemperature = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    await pool.query('DELETE FROM temperature_records WHERE id=$1', [id]);
    return res.status(204).json({
      message: "Temperature record deleted for the user"
    });
  });


  
// Get location records between two dates
exports.getLocation = tryCatch(async (req, res, next) => {
    const { startDate, endDate} = req.query;
    const user_id=req.user.id;

    if (!startDate || !endDate || !user_id) {
      return res.status(400).json({ error: 'Please provide both startDate and endDate' });
    }
    const query = `
      SELECT * FROM location_records
      WHERE timestamp BETWEEN $1 AND $2 AND user_id=$3
    `;
    const row = await pool.query(query, [startDate, endDate,user_id]);
    return res.status(200).json({
      message: "Location records retrieved successfully",
      data: {
        locationRecords: row.rows
      }
    });
  });
  
  // Add a new location record
  exports.putLocation = tryCatch(async (req, res, next) => {
    const {  latitude, longitude, timestamp } = req.body;
    const user_id=req.user.id;
    const row = await pool.query('INSERT INTO location_records (user_id, latitude, longitude, timestamp) VALUES($1, $2, $3, $4) RETURNING *', [user_id, latitude, longitude, new Date(timestamp)]);
    return res.status(201).json({
      message: "New location record added for the user",
      data: {
        locationRecord: row.rows[0]
      }
    });
  });
  
  // Update an existing location record
  exports.updateLocation = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { latitude, longitude, timestamp } = req.body;
    const row = await pool.query('UPDATE location_records SET latitude=$1, longitude=$2, timestamp=$3 WHERE id=$4 RETURNING *', [latitude, longitude, new Date(timestamp), id]);
    return res.status(200).json({
      message: "Location record updated for the user",
      data: {
        locationRecord: row.rows[0]
      }
    });
  });
  
  // Delete a location record
  exports.deleteLocation = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    await pool.query('DELETE FROM location_records WHERE id=$1', [id]);
    return res.status(204).json({
      message: "Location record deleted for the user"
    });
  });


// Get activity records between two dates
exports.getActivity = tryCatch(async (req, res, next) => {
    const { startDate, endDate} = req.query;
    const user_id=req.user.id;
    
    if (!startDate || !endDate || !user_id) {
      return res.status(400).json({ error: 'Please provide both startDate and endDate' });
    }
    const query = `
      SELECT * FROM activity_records
      WHERE timestamp BETWEEN $1 AND $2 AND user_id=$3
    `;
    const row = await pool.query(query, [startDate, endDate,user_id]);
    return res.status(200).json({
      message: "Activity records retrieved successfully",
      data: {
        activityRecords: row.rows
      }
    });
  });
  
  // Add a new activity record
  exports.putActivity = tryCatch(async (req, res, next) => {
    const {  title, description, timestamp, duration, calories, picture } = req.body;
    const user_id=req.user.id;
    const row = await pool.query('INSERT INTO activity_records (user_id, title, description, timestamp, duration, calories, picture) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *', [user_id, title, description, new Date(timestamp), duration, calories, picture]);
    return res.status(201).json({
      message: "New activity record added for the user",
      data: {
        activityRecord: row.rows[0]
      }
    });
  });
  
  // Update an existing activity record
  exports.updateActivity = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { title, description, timestamp, duration, calories, picture } = req.body;
    const row = await pool.query('UPDATE activity_records SET title=$1, description=$2, timestamp=$3, duration=$4, calories=$5, picture=$6 WHERE id=$7 RETURNING *', [title, description, new Date(timestamp), duration, calories, picture, id]);
    return res.status(200).json({
      message: "Activity record updated for the user",
      data: {
        activityRecord: row.rows[0]
      }
    });
  });
  
  // Delete an activity record
  exports.deleteActivity = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    await pool.query('DELETE FROM activity_records WHERE id=$1', [id]);
    return res.status(204).json({
      message: "Activity record deleted for the user"
    });
  });



  
// Get water log records between two dates
exports.getWaterLogs = tryCatch(async (req, res, next) => {
    const { startDate, endDate } = req.query;
    const user_id=req.user.id;
    if (!startDate || !endDate || !user_id) {
      return res.status(400).json({ error: 'Please provide both startDate and endDate' });
    }
    const query = `
      SELECT * FROM water_log
      WHERE timestamp BETWEEN $1 AND $2
    `;
    const rows = await pool.query(query, [startDate, endDate]);
    return res.status(200).json({
      message: "Water log records retrieved successfully",
      data: {
        waterLogs: rows.rows
      }
    });
  });
  
  // Add a new water log record
  exports.putWaterLogs = tryCatch(async (req, res, next) => {
    const {  quantity, timestamp } = req.body;
    const user_id=req.user.id;
    const row = await pool.query('INSERT INTO water_log (user_id, quantity, timestamp) VALUES($1, $2, $3) RETURNING *', [user_id, quantity, new Date(timestamp)]);
    return res.status(201).json({
      message: "New water log record added for the user",
      data: {
        waterLog: row.rows[0]
      }
    });
  });
  
  // Update an existing water log record
  exports.updateWaterLog = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { quantity, timestamp } = req.body;
    const row = await pool.query('UPDATE water_log SET quantity=$1, timestamp=$2 WHERE id=$4 RETURNING *', [ quantity, new Date(timestamp), id]);
    return res.status(200).json({
      message: "Water log record updated for the user",
      data: {
        waterLog: row.rows[0]
      }
    });
  });
  
  // Delete a water log record
  exports.deleteWaterLog = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    await pool.query('DELETE FROM water_log WHERE id=$1', [id]);
    return res.status(204).json({
      message: "Water log record deleted for the user"
    });
  });