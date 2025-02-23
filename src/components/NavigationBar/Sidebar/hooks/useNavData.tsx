import { useMemo } from 'react';
import SvgColor from '../../../svg-color/svg-color';
import { useTranslation } from 'react-i18next';

const getIcon = (name: string) => (
  <SvgColor src={`/assets/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

export function useNavData() {
  const { t } = useTranslation('index');
  const data = useMemo(
    () => [
      {
        items: [
          {
            title: t('DASHBOARD'),
            path: '/sam/dashboard',
            icon: getIcon('ic_dashboard'),
          },
          {
            title: t('DATA'),
            path: '/sam/data-menu',
            icon: getIcon('ic_menu_item'),
          },
          {
            title: t('SAK_7000'),
            path: '/sam/sak-7000',
            icon: getIcon('ic_sak_7000'),
          },
          // {
          //   title: t('ADMINISTRATION'),
          //   path: '#',
          //   icon: getIcon('ic_user'),
          // },
          {
            title: t('HELP'),
            path: '#',
            icon: getIcon('ic_help'),
          },

          {
            title: t('ABOUT_SAM'),
            path: '#',
            icon: getIcon('ic_about'),
          },
          {
            title: t('MAINTENANCE'),
            path: '/sam/maintenance',
            icon: getIcon('maintenance'),
          },
        ],
      },
    ],
    []
  );

  return data;
}
