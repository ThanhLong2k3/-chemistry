export const getSlugify = (url: string) => {
    return url.substring(url.lastIndexOf('/') + 1);
}