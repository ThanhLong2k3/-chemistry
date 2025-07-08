export function generateImage(url: string) {
    return isImageUrlValid(url) ? url : false;
}

export const isImageUrlValid = (url: string) => {
    const img = new Image();
    img.src = url;

    try {
        // Synchronously check if the naturalWidth property is greater than 0
        img.width; // Accessing width property triggers image loading
        return img.naturalWidth > 0;
    } catch (error) {
        return false; // Any error during image loading indicates invalid URL
    }
};

export const checkImageExists = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve();
        };
        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };
        img.src = url;
    });
};
