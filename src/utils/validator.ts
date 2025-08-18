import { useNotification } from '@/components/UI_shared/Notification';
import { FormRule } from 'antd';

interface keyValidator {
  required?: any;
  email?: any;
  phone?: any;
  number?: any;
  username?: any;
  password?: any;
  people_name?: any;
  full_name?: any;
  department_name?: any;
  required_max50?: any;
  Description_max50?: any;
  years_of_experience?: any;
  validateText255?: any;
  validateText50?: any;
  validateDescription?: any;
  validateNoLetterOrNumber?: any;
}
// Hàm decode HTML entity (ví dụ: &amp; -> &)
const decodeHtml = (html: any) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};


export const RULES_FORM: Record<keyof keyValidator, FormRule[]> = {
  required: [
    {
      required: true,
      message: 'Không được để trống',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm,
    },
  ],
  email: [
    {
      required: true,
      message: 'Không được để trống',
    },
    {
      pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
      message: 'Email không đúng định dạng',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm,
    },
    {
      max: 50,
      message: 'Không nhập quá 50 ký tự',
    },
  ],

  validateText255: [
    {
      max: 255,
      message: 'Không được vượt quá 255 ký tự.',
    },
    {
      pattern: /^(?=.*\p{L})(?!^\d+$)(?!^[\p{S}\p{P}\s]+$)[\p{L}\p{N}\p{P}\p{S}\s]+$/u,
      message:
        'Phải có ít nhất một chữ cái, không được chỉ toàn số, không được chỉ toàn ký tự đặc biệt.',
    },
  ],

  validateNoLetterOrNumber: [
    {
      max: 255,
      message: 'Không được vượt quá 255 ký tự.',
    },
    {
      pattern: /^[\p{L}\s]+$/u,
      message: 'Không được chứa ký tự đặc biệt hoặc chữ số.',
    },
  ],


  validateText50: [
    {
      max: 50,
      message: 'Không được vượt quá 50 ký tự.',
    },
    {
      // Có ít nhất 1 chữ cái, không chỉ toàn số, không chỉ toàn ký tự đặc biệt, và không có khoảng trắng
      pattern: /^(?!.*\s)(?=.*\p{L})(?!^[\d]+$)(?!^[\p{S}\p{P}]+$)[\p{L}\p{N}\p{P}\p{S}]+$/u,
      message:
        'Phải có ít nhất một chữ cái, không được chỉ toàn số, không được chỉ toàn ký tự đặc biệt, và không được chứa khoảng trắng.',
    },
  ],

  validateDescription: [
    {
      validator: (_, value) => {
        if (!value || value === '<p><br></p>') {
          return Promise.resolve();
        }

        // 1. Loại bỏ thẻ HTML
        let textOnly = value.replace(/<[^>]*>/g, '').trim();

        // 2. Giải mã HTML entities (&amp; -> & ...)
        textOnly = decodeHtml(textOnly);

        // 3. Kiểm tra phải có ít nhất một chữ cái Unicode
        const hasLetter = /\p{L}/u.test(textOnly);

        if (!hasLetter) {
          return Promise.reject(
            new Error(
              'Phải có ít nhất một chữ cái và có thể chứa số hoặc ký tự đặc biệt, không chỉ chứa số hoặc ký tự đặc biệt.'
            )
          );
        }

        return Promise.resolve();
      },
    },
  ],

  years_of_experience: [
    {
      required: true,
      message: 'Không được để trống',
    },
    {
      // pattern để đảm bảo chỉ nhập số nguyên
      pattern: /^\d+$/,
      message: 'Chỉ được nhập số nguyên dương.',
    },
    {
      // validator tùy chỉnh để kiểm tra logic phức tạp hơn
      validator: (_, value) => {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return Promise.reject(new Error('Vui lòng nhập một số hợp lệ.'));
        }
        if (numValue < 0) {
          return Promise.reject(
            new Error('Số năm kinh nghiệm không thể là số âm.')
          );
        }
        if (numValue > 50) {
          return Promise.reject(
            new Error('Số năm kinh nghiệm không thể lớn hơn 50.')
          );
        }
        return Promise.resolve(); // Hợp lệ
      },
    },
  ],

  phone: [
    {
      min: 9,
      max: 11,
      pattern: /^0\d{8,10}$/,
      message: 'Số điện thoại phải có từ 9 đến 11 chữ số và bắt đầu bằng 0',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm,
    },
  ],
  number: [
    {
      required: true,
      pattern: /^[0-9]*$/gm,
      message: 'Chỉ được là số',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm,
    },
  ],
  username: [
    {
      required: true,
      pattern: /^[a-zA-Z0-9]{6,10}$/g,
      message:
        'Tài khoản có độ dài 6-10 chữ/số và không chứa khoảng cách và ký tự đặc biệt',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm,
    },
  ],
  password: [
    {
      required: true,
      pattern:
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\\[\]:;<>,.?~\\-]).{8,}$/g,
      message:
        'Mật khẩu phải có ít nhất 8 kí tự bao gồm chữ hoa, chữ thường, ít nhất một kí tự đặc biệt và số',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm,
    },
  ],
  people_name: [
    {
      required: true,
      message: 'Không được để trống',
    },
    {
      pattern:
        /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/gm,
      message:
        'Tên nguời dùng phải bắt đầu bằng chữ in hoa. Không bắt đầu và kết thúc bằng dấu cách, không chứa số và ký tự đặc biệt.',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm,
    },
    {
      max: 50,
      message: 'Không nhập quá 50 ký tự',
    },
  ],
  full_name: [
    {
      required: true,
      message: 'Không được để trống',
    },
    {
      pattern: /^[a-zA-Z ]+$/gm,
      message: 'Tên nguời dùng không chứa ký tự số, không chứa ký tự đặc biệt',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm,
    },
  ],
  department_name: [
    {
      required: true,
      pattern:
        /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/gm,
      message:
        'Tên phải bắt đầu bằng chữ in hoa, Không bắt đầu và kết thúc bằng dấu cách, không chứa sô và ký tự đặc biệt',
    },
    {
      max: 50,
      message: 'Không nhập quá 50 ký tự',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm,
    },
  ],
  required_max50: [
    {
      required: true,
      message: 'Không được để trống',
    },
    {
      min: 1,
      message: 'Tên phải tối thiểu 1 ký tự',
    },
    {
      max: 50,
      message: 'Không nhập quá 50 ký tự',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm,
    },
  ],
  Description_max50: [
    {
      min: 1,
      message: 'Tên phải tối thiểu 1 ký tự',
    },
    {
      max: 500,
      message: 'Không nhập quá 500 ký tự',
    },
    {
      message: 'Không được bỏ trống',
      pattern: /^(?!\s+$).*/gm,
    },
  ],
};

export const validateDates = (
  startDate: string,
  endDate?: string | null,
  show?: (msg: any) => void
): boolean => {
  if (endDate && endDate < startDate) {
    show?.({
      result: 1,
      messageError: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
    });
    return false;
  }
  return true;
};

export const checkDateOfBirth = (
  DateOfBirth: string | null,
  show?: (msg: any) => void
) => {
  if (DateOfBirth) {
    const regex = /^(\d{4})-(\d{2})-(\d{2})$|^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(DateOfBirth)) {
      show?.({
        result: 1,
        messageError:
          'Định dạng ngày sinh không hợp lệ (yyyy-mm-dd hoặc dd/mm/yyyy)',
      });
      return false;
    }

    const parsedDate = DateOfBirth.includes('-')
      ? new Date(DateOfBirth)
      : new Date(DateOfBirth.split('/').reverse().join('-'));

    if (isNaN(parsedDate.getTime())) {
      show?.({
        result: 1,
        messageError: 'Ngày sinh không hợp lệ',
      });
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (parsedDate >= today) {
      show?.({
        result: 1,
        messageError: 'Ngày sinh phải nhỏ hơn ngày hiện tại',
      });
      return false;
    }
  }
  return true;
};

export const checkNumber = (
  value: number | null,
  show?: (msg: any) => void
) => {
  if (value && value < 0) {
    show?.({
      result: 1,
      messageError: 'Số phải lớn hơn hoặc bằng 0',
    });
    return false;
  }
  return true;
};
