
import { db } from '../database/connection.js'

export async function findById(userId) {
    try {
        let result = await db.execute(
            `SELECT * FROM Account WHERE user_id = ?`, 
            [userId]
        );
        
        await db.release();
        return result;
        
    } catch (error) {
        if (db) await db.release();
        throw error;
    }
 }
 