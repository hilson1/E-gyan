import db from "../db.js";

export const logActivity = async ({
  user_id,
  module,
  action = "view",
  item_id = null,
}) => {
  try {
    await db.query(
      `INSERT INTO user_activity (user_id, module, action, item_id)
       VALUES (?, ?, ?, ?)`,
      [user_id, module, action, item_id]
    );
  } catch (err) {
    console.error("Activity log failed:", err.message);
  }
};
