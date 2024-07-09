import bcrypt from 'bcrypt'

export async function hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword;
}

export async function comparePassword(planePassword: string | any, hash: string) {

    const res = await bcrypt.compare(planePassword, hash)

    return res
}