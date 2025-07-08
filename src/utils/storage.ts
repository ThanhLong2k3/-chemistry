const storagePrefix = 'FRAGILE_';

const storage = {
    getStorage: (key: string) => {
        const value = localStorage.getItem(`${storagePrefix}${key}`);
        return value ? JSON.parse(value) : '';
    },
    setStorage: (key: string, value: string) => {
        localStorage.setItem(`${storagePrefix}${key}`, value);
    },
    clearStorage: (key: string) => {
        localStorage.removeItem(`${storagePrefix}${key}`);
    },
};

export default storage;
