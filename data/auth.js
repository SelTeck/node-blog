
import { db } from '../database/connection.js'

export async function findById(userId) {
    try {
        let result = await db.execute(
            `SELECT * FROM Account WHERE user_id = ?`, 
            [userId]
        );
        
        return result;
        
    } catch (error) {
        throw error;
    } finally {
        if (db) await db.release();
    }
 }
 