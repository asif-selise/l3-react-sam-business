import { type TypographyVariants } from '@/src/interfaces/TypographyVariants';
import { Box, Typography } from '@mui/material';

interface Props {
  label: { value: string; typography?: TypographyVariants };
  value: { value: string; typography?: TypographyVariants };
}

const InfoGridV2 = ({
  label: { value: labelValue, typography: labelTypography = 'body2' },
  value: { value: valueText, typography: valueTypography = 'caption' },
}: Props) => {
  return (
    <Box mt={1}>
      <Box
        display="flex"
        flexDirection="row"
        sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
        columnGap={1}
      >
        <Typography variant={labelTypography} width="45%">
          {labelValue}
        </Typography>
        <Box width="65%" display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant={valueTypography}>{valueText}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default InfoGridV2;
