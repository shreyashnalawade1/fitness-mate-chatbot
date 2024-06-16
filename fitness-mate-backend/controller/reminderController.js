const pool = require("../config/dbconnect");
const { sendNotification } = require("../utils/notification");
const tryCatch = require("../utils/tryCatch");

// Get reminder records between two dates
exports.getReminders = tryCatch(async (req, res, next) => {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Please provide both startDate and endDate' });
    }
    const user_id=req.user.id;
    const query = `
      SELECT * FROM reminders
      WHERE remind_time BETWEEN $1 AND $2 AND user_id=$3
    `;
    const rows = await pool.query(query, [startDate, endDate,user_id]);
    return res.status(200).json({
      message: "Reminder records retrieved successfully",
      data: {
        reminders: rows.rows
      }
    });
  });
  
  // Add a new reminder record
  exports.addReminder = tryCatch(async (req, res, next) => {
    const {  title, description, timestamp } = req.body;
    const user_id=req.user.id;

    const whatsapp=await pool.query('SELECT * from whatsappNumbers where user_id='+req.user.id+";");
    // console.log(whatsapp);
    await sendNotification( {type:"wp",msg:"A new reminder has been added",to:whatsapp.rows[0].no});
    await sendNotification({type:"email",msg:"A new reminder has been added",to:req.user.email});
    const row = await pool.query('INSERT INTO reminders (user_id, title, description, timestamp) VALUES($1, $2, $3, $4) RETURNING *', [user_id, title, description, new Date(timestamp)]);
    return res.status(201).json({
      message: "New reminder record added for the user",
      data: {
        reminder: row.rows[0]
      }
    });   
  });
  
  // Update an existing reminder record
  exports.updateReminder = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    const {  title, description, remind_time } = req.body;
    const row = await pool.query('UPDATE reminders SET  title=$2, description=$3, remind_time=$4 WHERE id=$5 RETURNING *', [user_id, title, description, new Date(remind_time), id]);
    return res.status(200).json({
      message: "Reminder record updated for the user",
      data: {
        reminder: row.rows[0]
      }
    });
  });
  
  // Delete a reminder record
  exports.deleteReminder = tryCatch(async (req, res, next) => {
    const { id } = req.params;
    await pool.query('DELETE FROM reminders WHERE id=$1', [id]);
    return res.status(204).json({
      message: "Reminder record deleted for the user"
    });
  });