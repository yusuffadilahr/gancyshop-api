import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
    const saltRound = 10
    return await bcrypt.hash(password, saltRound)
}

export const comparePassword = async ({ password, existingPassword }: { password: string, existingPassword: string }) => {
    return await bcrypt.compare(password, existingPassword)
}