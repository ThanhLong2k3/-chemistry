export const getUrl = (
    url: string,
    path: string | number | undefined,
    key: any = ':id',
): string => {

    return url.replace(key, path + '');
};
