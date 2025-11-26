
import { query } from "../database/connection.js";

export async function findById(userId) {
    return await query("SELECT * FROM Account WHERE user_id = ?", [userId]);
 }
 