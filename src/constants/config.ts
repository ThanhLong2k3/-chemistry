export const BASE_URL = process.env.VITE_BASE_URL;

export const EN = "en"
export const VI = "vi"

// Cookie
export const TOKEN_KEY = 'access_token';
export const TOKEN_INV_KEY = 'access_token_inv';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const LOCALE_KEY = 'i18nlang';

export const PAGE_INDEX = 'page_index';
export const PAGE_SIZE = 'page_size';
export const SEARCH_DATA = 'search_data';
export const HTTP = 'http';
export const DEFAULT_UID_FILE_LIST = '-1';
export const DEFAULT_NAME_FILE_LIST = 'image.png';
export const DEFAULT_STATUS_FILE_LIST = 'done';
export const ACCESS_TOKEN = 'access_token';
export const ROLE = 'role';
export const CONFIG_SLUGIFY = { locale: 'vi', lower: true };
export const MIN_PAGE_SIZE = '1';
export const MAX_PAGE_SIZE = '1000000000';
export const MAX_PAGE_SIZE_1 = '1000000001';
export const MAX_PAGE_SIZE_2 = '1000000002';
export const MAX_PAGE_SIZE_3 = '1000000003';
export const MAX_PAGE_SIZE_4 = '1000000004';
export const FORMAT_DATE = 'DD/MM/YYYY';

export const ORDERS_STATUSES = [
    {
        label: 'Đã giao & thành công',
        value: '1',
        color: '#00a11f',
        backgroundColor: '#00a11f',
    },
    {
        label: 'Chờ xác nhận',
        value: '2',
        color: '#955251',
        backgroundColor: '#955251',
    },
    {
        label: 'Đã xác nhận & đang chuẩn bị hàng',
        value: '3',
        color: '#009473',
        backgroundColor: '#009473',
    },
    {
        label: 'Đã chuẩn bị hàng & chờ bên vận chuyển lấy hàng',
        value: '4',
        color: '#dda11b',
        backgroundColor: '#dda11b',
    },
    {
        label: 'Đã đưa cho bên vận chuyển và đang giao',
        value: '5',
        color: '#01018d',
        backgroundColor: '#01018d',
    },
    {
        label: 'Hủy đơn hàng',
        value: '6',
        color: '#ff2000',
        backgroundColor: '#ff2000',
    },
];

export const ORDERS_PAYMENTS = [
    {
        label: 'Thanh toán trực tiếp',
        value: '1',
    },
    {
        label: 'Thanh toán khi nhận hàng',
        value: '2',
    },
    {
        label: 'Chuyển khoản',
        value: '3',
    },
];

export const ROLES = [
    {
        label: 'Quản trị viên',
        value: '1',
    },
    {
        label: 'Nhân viên nhập hàng',
        value: '2',
    },
    {
        label: 'Nhân viên bán hàng',
        value: '3',
    },
    {
        label: 'Nhân viên media',
        value: '4',
    },
];

export const ORDERS_PAIDS = [
    {
        label: 'Đã thanh toán',
        value: '1',
    },
    {
        label: 'Chưa thanh toán',
        value: '2',
    },
];

export const INVOICE_PAIDS = [
    {
        label: 'Đã thanh toán',
        value: '1',
    },
    {
        label: 'Chưa thanh toán',
        value: '2',
    },
];
