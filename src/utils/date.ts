import moment from 'moment';

export const formatDate = (
  inputDate: string | null | undefined,
  fromFormat: string = 'YYYY-MM-DD',
  toFormat: string = 'DD/MM/YYYY',
) => {
  if (!inputDate) return null; // Nếu không có dữ liệu, trả về null

  const date = moment(inputDate, fromFormat, true); // Thêm `true` để kiểm tra định dạng
  if (!date.isValid()) {
    console.error(`Lỗi: Ngày không hợp lệ - ${inputDate}`);
    return null;
  }

  return date.format(toFormat);
};

export const showDateFormat = (date: string | null) => {
  const dataShow = date ? date.split('T')[0] : null;
  return dataShow;
};
