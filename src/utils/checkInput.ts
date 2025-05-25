export const checkCharacter = (val: string) => {
    const schemaInput = /^[A-Za-z]+$/
    return schemaInput.test(val)
}

export const checkNumberInput = (val: string) => {
    const schema = /^[0-9]+$/
    return schema.test(val)
}

export const checkEmail = (val: string) => {
    const schema = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return schema.test(val)
}