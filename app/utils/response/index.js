export const Success = (data = [], message, code) => {
    return {
        status: 'success',
        message,
        code,
        data,
    }
};

export const Error = (message, code) => {
    return {
        status: 'error',
        message,
        code
    }
};