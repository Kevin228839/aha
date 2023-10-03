import {pool} from './db';
import {RowDataPacket} from 'mysql2';
import bcrypt from 'bcrypt';
import {EmailSignupPayload, UserStatistics} from './types';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve(__dirname, '../.env')});

const checkEmailAccountExist = async (email: string): Promise<boolean> => {
  const conn = await pool.getConnection();
  try {
    const [data] = await conn.query<RowDataPacket[]>(
      "SELECT COUNT(*) FROM user_info WHERE type='email' and email=? and verified=1",
      [email]
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

const createEmailAccount = async (
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
      "DELETE FROM user_info WHERE type='email' and email=? and verified=0;\
      INSERT INTO user_info(email, password_hash, signup_ts) VALUES (?, ?, CURRENT_TIMESTAMP())",
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

const setEmailAccountAsVerified = async (email: string): Promise<boolean> => {
  const conn = await pool.getConnection();
  try {
    const [data] = await conn.query<RowDataPacket[]>(
      "SELECT COUNT(*) FROM user_info WHERE type='email' and email=? and verified=0",
      [email]
    );
    if (data[0]['COUNT(*)'] === 0) {
      return false;
    }
    await conn.query(
      "UPDATE user_info SET verified=1, login_times=login_times+1 WHERE type='email' and email=?",
      [email]
    );
    await conn.query('COMMIT');
    return true;
  } catch (err) {
    await conn.query('ROLLBACK');
    throw err;
  } finally {
    conn.release();
  }
};

const getEmailUserInfo = async (email: string): Promise<object> => {
  const conn = await pool.getConnection();
  try {
    const [data] = await conn.query<RowDataPacket[]>(
      "SELECT id, type, email, name FROM user_info WHERE type='email' and email=? and verified=1",
      [email]
    );
    return data[0];
  } finally {
    conn.release();
  }
};

const checkSignInEmail = async (email: string): Promise<boolean> => {
  const conn = await pool.getConnection();
  try {
    const [data] = await conn.query<RowDataPacket[]>(
      "SELECT COUNT(*) FROM user_info WHERE type='email' and email=? and verified=1",
      [email]
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

const checkSignInPassword = async (
  email: string,
  password: string
): Promise<boolean> => {
  const conn = await pool.getConnection();
  try {
    const [data] = await conn.query<RowDataPacket[]>(
      "SELECT password_hash FROM user_info WHERE type='email' and email=? and verified=1",
      [email]
    );
    const passwordHash = data[0]['password_hash'];
    return await bcrypt.compare(password, passwordHash);
  } finally {
    conn.release();
  }
};

const updateLastSessionTS = async (
  type: string,
  email: string
): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      'UPDATE user_info SET lastsession_ts=CURRENT_TIMESTAMP() WHERE type=? and email=?',
      [type, email]
    );
    await conn.query('COMMIT');
  } catch (err) {
    await conn.query('ROLLBACK');
    throw err;
  } finally {
    conn.release();
  }
};

const updateLoginTimesAndLastSessionTS = async (
  type: string,
  email: string
): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      'UPDATE user_info SET login_times=login_times+1 WHERE type=? and email=?;\
      UPDATE user_info SET lastsession_ts=CURRENT_TIMESTAMP() WHERE type=? and email=?',
      [type, email, type, email]
    );
    await conn.query('COMMIT');
  } catch (err) {
    await conn.query('ROLLBACK');
    throw err;
  } finally {
    conn.release();
  }
};

const getDashBoardUserList = async (): Promise<RowDataPacket[]> => {
  const conn = await pool.getConnection();
  try {
    const [data] = await conn.query<RowDataPacket[]>(
      'SELECT email, type, signup_ts, login_times, lastsession_ts FROM user_info'
    );
    return data;
  } finally {
    conn.release();
  }
};

const getDashBoardStatistics = async (): Promise<UserStatistics> => {
  const conn = await pool.getConnection();
  try {
    const [data] = await conn.query<RowDataPacket[][]>(
      'SELECT COUNT(*) as total_signup_user FROM user_info;\
       SELECT COUNT(*) as today_active_user FROM user_info WHERE DATE(lastsession_ts)=CURDATE();\
       SELECT COUNT(*)/7 as average_active_user FROM user_info WHERE lastsession_ts > NOW() - INTERVAL 7 DAY '
    );
    return {
      total_sign_up_user: data[0][0]['total_signup_user'],
      today_active_user: data[1][0]['today_active_user'],
      average_active_user: data[2][0]['average_active_user'],
    };
  } finally {
    conn.release();
  }
};

const changeUserName = async (email: string, type: string, name: string) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('UPDATE user_info SET name=? WHERE email=? and type=?', [
      name,
      email,
      type,
    ]);
    await conn.query('COMMIT');
  } catch (err) {
    await conn.query('ROLLBACK');
    throw err;
  } finally {
    conn.release();
  }
};

const changeUserPassword = async (email: string, newPassword: string) => {
  const conn = await pool.getConnection();
  try {
    const saltRound = parseInt(process.env.bcrypt_salt as string);
    const newPasswordHash = bcrypt.hashSync(newPassword.toString(), saltRound);
    await conn.query(
      "UPDATE user_info SET password_hash=? WHERE email=? and type='email'",
      [newPasswordHash, email]
    );
  } catch (err) {
    await conn.query('ROLLBACK');
    throw err;
  } finally {
    conn.release();
  }
};

const checkGoogleOauthAccountExist = async (email: string) => {
  const conn = await pool.getConnection();
  try {
    const [data] = await conn.query<RowDataPacket[]>(
      "SELECT COUNT(*) FROM user_info WHERE type='google' and email=?",
      [email]
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

const createGoogleOAuthAccount = async (
  email: string,
  name: string
): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "INSERT INTO user_info(type, email, name, signup_ts, login_times) VALUES ('google', ?, ?, CURRENT_TIMESTAMP(), 1)",
      [email, name]
    );
    await conn.query('COMMIT');
  } catch (err) {
    await conn.query('ROLLBACK');
    throw err;
  } finally {
    conn.release();
  }
};

const updateGoogleOAuthAccount = async (email: string): Promise<void> => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      "UPDATE user_info SET login_times=login_times+1 WHERE type='google' and email=?",
      [email]
    );
    await conn.query('COMMIT');
  } catch (err) {
    await conn.query('ROLLBACK');
    throw err;
  } finally {
    conn.release();
  }
};

const getGoogleUserInfo = async (email: string): Promise<object> => {
  const conn = await pool.getConnection();
  try {
    const [data] = await conn.query<RowDataPacket[]>(
      "SELECT id, type, email, name FROM user_info WHERE type='google' and email=?",
      [email]
    );
    return data[0];
  } finally {
    conn.release();
  }
};

export {
  checkEmailAccountExist,
  createEmailAccount,
  setEmailAccountAsVerified,
  getEmailUserInfo,
  checkSignInEmail,
  checkSignInPassword,
  updateLastSessionTS,
  updateLoginTimesAndLastSessionTS,
  getDashBoardUserList,
  getDashBoardStatistics,
  changeUserName,
  changeUserPassword,
  checkGoogleOauthAccountExist,
  createGoogleOAuthAccount,
  updateGoogleOAuthAccount,
  getGoogleUserInfo,
};
