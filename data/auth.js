
import { db } from '../database/connection.js'

export async function findByUser(userId) {
    try {
        let query = `SELECT EXISTS(SELECT * FROM Account WHERE user_id = ?) as isEXIST`;
        let result = await db.execute(query, userId);
        await db.release();
        return result;
        
    } catch (error) {
        if (db) await db.release();
        throw error;
    }
 }
 