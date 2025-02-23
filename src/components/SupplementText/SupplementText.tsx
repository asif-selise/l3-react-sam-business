import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { sanitizeData } from '@/src/helpers/sanitizeData';

interface Props {
  text: string | null | undefined;
}

const SupplementText = ({ text }: Props) => {
  const [isSupplementExpanded, setIsSupplementExpanded] = useState(false);
  const { t } = useTranslation('index');
  const maxLength = 250;

  const toggleText = () => {
    setIsSupplementExpanded((prev) => !prev);
  };

  if (text) {
    return (
      <>
        {text.length > maxLength && !isSupplementExpanded
          ? `${text}`.substring(0, maxLength) + '...'
          : `${text}`}
        {text.length > maxLength && (
          <Typography
            variant="subtitle2"
            sx={{
              color: 'primary.main',
              display: 'inline',
              pl: '4px',
              cursor: 'pointer',
            }}
            onClick={toggleText}
          >
            {!isSupplementExpanded ? `${t('SHOW_MORE')}` : `${t('SHOW_LESS')}`}
          </Typography>
        )}
      </>
    );
  } else {
    return <>{sanitizeData(text)}</>;
  }
};

export default SupplementText;
