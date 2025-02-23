import { Box, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { type SetStateAction, useState } from 'react';
import CustomListItem from '../CustomListItem/CustomListItem';
import { type AutoText } from '@/src/hooks/useMasterData/masterData.interface';

interface Props {
  additionalTextList: AutoText[];
  selectedItem: string;
  setSelectedItem: React.Dispatch<SetStateAction<string>>;
}

const AdditionalText = ({ additionalTextList, selectedItem, setSelectedItem }: Props) => {
  const { t } = useTranslation('index');
  const [search, setSearch] = useState<string>('');

  const handleItemClick = (item: AutoText) => {
    setSelectedItem(item.Name);
  };

  const filteredItems = additionalTextList.filter((item: AutoText) =>
    item.Name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Box display={'flex'} flexDirection={'row'} alignItems={'baseline'} columnGap={1}>
        <Typography variant="subtitle2" noWrap sx={{ flexShrink: 0 }}>
          {t('ADDITIONAL_TEXT')}
        </Typography>
        <TextField
          fullWidth
          placeholder={t('SEARCH')}
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          sx={{ flexGrow: 1, mb: 2 }}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px',
          padding: '16px',
          height: '280px',
          overflowX: 'scroll',
        }}
      >
        {filteredItems.map((item) => (
          <Box key={item.Id}>
            <CustomListItem
              item={item}
              isSelected={item.Name === selectedItem}
              onClick={() => {
                handleItemClick(item);
              }}
            />
          </Box>
        ))}
      </Box>
    </>
  );
};

export default AdditionalText;
