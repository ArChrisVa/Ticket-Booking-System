import { createUser, findUserByEmail } from '../repositories/users';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';


const registerUser = async (input: {
    email: string;
    password: string;
}) => {
    if (!input.email) throw new Error('Email is required');
    if (!input.password) throw new Error('Password is required');
    const email = await findUserByEmail(input.email);
    if (email != null) throw new Error('Email is already registered')

    const hashedPassword = await bcrypt.hash(input.password, 10); //asynchronously (non-blocking) hash the password with a salt round of 10
    const userInput = {
        email: input.email,
        password_hash: hashedPassword
    };

    const newUser = await createUser(userInput);
    const {password_hash, ...safeUser} = newUser;
    return safeUser
}; 

const loginUser = async (input: {email: string, password: string} ) =>
{
    if (!input.email) throw new Error('Email is required');
    if (!input.password) throw new Error('Password is required');

    const user = await findUserByEmail(input.email);
    if(user == null) throw new Error('Invalid credentials')

    const isOk = await bcrypt.compare(input.password, user.password_hash)
    if (!isOk) throw new Error('Invalid credentials')

    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET is not set')
    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '1h' })

    return { token };
}

export { registerUser, loginUser };