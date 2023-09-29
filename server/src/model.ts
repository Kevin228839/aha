import {pool} from './db';
import {RowDataPacket} from 'mysql2';
import bcrypt from 'bcrypt';
import {EmailSignupPayload} from './types';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve(__dirname, '../.env')});

const checkEmailExist = async (
  requestBody: EmailSignupPayload
): Promise<boolean> => {
  const conn = await pool.getConnection();
  try {
    const [data] = await conn.query<RowDataPacket[]>(
      "SELECT COUNT(*) FROM user_info WHERE type='email' and email=? and verified=1",
      [requestBody.email]
    );
    if (data[0]['COUNT(*)'] === 0) {
      return false;
    } else {
      return true;
    }
  } finally {
    conn.release();
  }
};

const registerEmail = async (
  requestBody: EmailSignupPayload
): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    const saltRound = parseInt(process.env.bcrypt_salt as string);
    const passwordHash = bcrypt.hashSync(
      requestBody.password.toString(),
      saltRound
    );

    await conn.query(
      "DELETE FROM user_info WHERE type='email' and email=? and verified=0;INSERT INTO user_info(email, password_hash, signup_ts) VALUES (?, ?, CURRENT_TIMESTAMP())",
      [requestBody.email, requestBody.email, passwordHash]
    );
    await conn.query('COMMIT');
  } catch (err) {
    await conn.query('ROLLBACK');
    throw err;
  } finally {
    conn.release();
  }
};

export {checkEmailExist, registerEmail};
