import { createUser, findUserByEmail } from '../repositories/users';
import bcrypt from 'bcryptjs';


const registerUser = async (input: {
    email: string;
    password: string;
}) => {
    if (!input.email) throw new Error('Email is required');
    if (!input.password) throw new Error('Password is required');
    const email = await findUserByEmail(input.email);
    if (email != null) throw new Error('Email is already registered')

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const userInput = {
        email: input.email,
        password_hash: hashedPassword
    };

    const newUser = await createUser(userInput);
    const {password_hash, ...safeUser} = newUser;
    return safeUser
}; 

export { registerUser };