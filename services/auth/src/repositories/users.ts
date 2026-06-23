import {pool} from '../db'


export const createUser = async (user: 
    {
        email: string;
        password_hash: string;
    }) => {
        const result = await pool.query(
            `INSERT INTO users (email, password_hash)
             VALUES($1, $2)
             RETURNING *`,
            [user.email, user.password_hash]
        )

        return result.rows[0];
    };

export const findUserByEmail = async (email: string) => {
    const result = await pool.query(
        `SELECT id, email, role, password_hash, created_at
         FROM users
         WHERE users.email = $1
        `,
        [email]
    )

    return result.rows[0] ?? null;
};