'use client';

import { EN, VI } from '@/constants/config';
import { ConfigProvider, Dropdown, MenuProps, Typography } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { FaAngleDown } from 'react-icons/fa';
import styles from './LanguagesSwitcher.module.scss';
import { ENIcon, VNIcon } from '@/assets/svg/index';
import { LanguageSwitcherProps } from '@/models/language-switcher';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

const LanguagesSwitcher = () => {
  const t = useTranslations('global');
  const router = useRouter();
  const locale = useLocale();
  const [, startTransition] = useTransition();

  const languages: MenuProps['items'] = [
    {
      key: VI,
      label: t('vi'),
      icon: <VNIcon />,
    },
    {
      key: EN,
      label: t('en'),
      icon: <ENIcon />,
    },
  ];

  const handleChangeLanguage = (e: any) => {
    const locale = e?.key;
    startTransition(() => {
      router.replace(`/${locale}`);
    });
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Typography: {
              colorLink: '#ffffff',
              colorLinkHover: '#ffffff',
              colorLinkActive: '#ffffff',
            },
          },
        }}
      >
        <Dropdown
          menu={{ items: languages, onClick: handleChangeLanguage }}
          trigger={['click']}
        >
          <Typography.Link
            onClick={(e) => e.preventDefault()}
            className={styles.locale}
          >
            {
              (
                languages.find(
                  (item) => item?.key === locale,
                ) as LanguageSwitcherProps
              )?.icon
            }
            <Typography.Text className={styles.title}>
              {
                (
                  languages.find(
                    (item) => item?.key === locale,
                  ) as LanguageSwitcherProps
                )?.label
              }
            </Typography.Text>
            <FaAngleDown />
          </Typography.Link>
        </Dropdown>
      </ConfigProvider>
    </>
  );
};

export default LanguagesSwitcher;
