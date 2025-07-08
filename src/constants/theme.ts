import { theme } from 'antd';
import { ThemeConfig } from 'antd/lib/config-provider';

export const themeDarkConfig: ThemeConfig = {
  algorithm: [theme.darkAlgorithm],
  token: {
    colorBgElevated: '#141414',
    colorPrimaryText: '#141414',
    colorBgLayout: '#141414',
    colorPrimary: '#00b96b',
    colorBorder: 'rgba(253, 253, 253, 0.12)',
    borderRadius: 5,
    colorLink: '#ffffff',
    colorLinkHover: '#000000',
    fontFamily: 'Reddit Sans, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#141414',
    },
  },
};
export const themeOrangeConfig: ThemeConfig = {
  algorithm: [theme.defaultAlgorithm],
  token: {
    colorPrimaryText: '#ff6b35', // màu chữ chính
    colorBgLayout: '#ffffff', // nền layout trắng
    colorBorder: '#e5e7eb', // viền xám nhạt
    colorPrimary: '#ff6b35', // màu chủ đạo (nút, nhấn)
    borderRadius: 8,
    fontFamily: 'Reddit Sans, sans-serif',
  },
  components: {
    Menu: {
      colorBgContainer: '#ff6b35',               // nền menu chính
      colorBgElevated: '#f7931e',                // nền menu con khi hover hoặc active
      colorText: '#ffffff',                      // màu chữ menu
      colorBorder: '#e5e7eb',
      colorPrimary: '#ffd8b0',                   // màu icon hoặc nhấn trong menu
      controlItemBgActive: '#ff8c42',            // nền item đang chọn
    },
    Typography: {
      colorLink: '#f7931e',                      // màu link
      colorLinkHover: '#ff6b35',                 // hover đậm hơn
    },
    Drawer: {
      colorBgElevated: '#fff5db',                // nền drawer dạng cam vàng nhạt
      colorText: '#1a202c',                      // text đen đậm
      colorIcon: '#ff6b35',                      // icon màu cam
      colorIconHover: '#f7931e',
    },
    Layout: {
      headerBg: '#ff6b35',                       // header cam chính
    },
    Table: {
      controlItemBgActive: '#fff5db',            // nền filter đang chọn
      controlItemBgActiveHover: '#ffe4b3',       // hover filter
      rowExpandedBg: '#ffffff',                  // row mở rộng nền trắng
    },
  },
};



export const themeBlueConfig: ThemeConfig = {
  algorithm: [theme.defaultAlgorithm],
  token: {
    colorPrimaryText: '#284973',
    // colorBgElevated: "#284973",
    colorBgLayout: '#ffffff',
    colorBorder: '#e1e1e1',
    colorPrimary: '#284973',
    borderRadius: 5,
    fontFamily: 'Reddit Sans, sans-serif',
  },
  components: {
    Menu: {
      colorBgContainer: 'rgb(13,68,138)',
      colorBgElevated: 'rgb(13,68,138)', // bg child menu when hover or active li parent
      colorText: '#ffffff',
      colorBorder: '#e1e1e1',
      colorPrimary: '#8abbff',
      controlItemBgActive: '#1a3357',
    },
    Typography: {
      colorLink: 'rgb(39, 108, 255)',
      colorLinkHover: 'rgba(0, 54, 170, 0.65)',
    },
    Drawer: {
      colorBgElevated: 'rgb(13,68,138)',
      colorText: '#ffffff',
      colorIcon: '#ffffff',
      colorIconHover: '#ffffff',
    },
    Layout: {
      headerBg: 'rgb(13,68,138)',
    },
    Table: {
      controlItemBgActive: '#c8ced2',
      controlItemBgActiveHover: '#c8ced2',
      rowExpandedBg: '#ffffff',
    },
  },
};

export const themeBrownConfig: ThemeConfig = {
  algorithm: [theme.defaultAlgorithm],
  token: {
    // colorBgElevated: "#48433d",
    colorPrimaryText: '#48433d',
    colorBgLayout: '#ffffff',
    colorBorder: '#e1e1e1',
    colorPrimary: '#48433d',
    borderRadius: 5,
    fontFamily: 'Reddit Sans, sans-serif',
  },
  components: {
    Menu: {
      colorBgContainer: '#48433d',
      colorBgElevated: '#48433d', // bg child menu when hover or active li parent
      colorText: '#ffffff',
      colorBorder: '#e1e1e1',
      colorPrimary: '#ab7632',
      controlItemBgActive: '#2e2923',
    },
    Typography: {
      colorLink: '#000000',
      colorLinkHover: '#000000',
    },
    Drawer: {
      colorBgElevated: '#48433d',
      colorText: '#ffffff',
      colorIcon: '#ffffff',
      colorIconHover: '#ffffff',
    },
    Layout: {
      headerBg: '#48433d',
    },
    Table: {
      controlItemBgActive: '#b0afab',
      controlItemBgActiveHover: '#b0afab',
      rowExpandedBg: '#ffffff',
    },
  },
};
// const handleCheckTheme = () => {
//     const key = "color"
//     const themeColor = storage.getStorage(`V-OSINT3_${key}`);
//     console.log(themeColor);

//     switch (themeColor) {
//         case "black": return themeDarkConfig;
//         case "white": return themeLightConfig;
//         case "blue": return themeDarkConfig;
//     }

//     return themeLightConfig;
// }

// export const themeConfig:ThemeConfig = handleCheckTheme();
