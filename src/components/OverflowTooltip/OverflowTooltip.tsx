import { type TypographyVariants } from '@/src/interfaces/TypographyVariants';
import { Tooltip, Typography } from '@mui/material';
import { JSX, useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  variant?: TypographyVariants;
}

const OverflowTooltip = ({ text, variant = 'body2' }: Props): JSX.Element => {
  const textElementRef = useRef<HTMLElement>(null);
  const [hoverStatus, setHover] = useState(false);

  const compareSize = () => {
    if (textElementRef.current) {
      setHover(textElementRef.current.scrollWidth > textElementRef.current.clientWidth);
    }
  };

  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
  }, [text]);

  useEffect(
    () => () => {
      window.removeEventListener('resize', compareSize);
    },
    []
  );

  return (
    <>
      {text && (
        <Tooltip
          title={text}
          disableHoverListener={!hoverStatus}
          placement="top"
          componentsProps={{
            tooltip: {
              sx: {
                maxWidth: '500px',
              },
            },
          }}
        >
          <Typography
            variant={variant}
            ref={textElementRef}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {text}
          </Typography>
        </Tooltip>
      )}
    </>
  );
};

export default OverflowTooltip;
