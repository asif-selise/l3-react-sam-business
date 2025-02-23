import { Box, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { type SetStateAction, useState } from 'react';
import CustomListItem from '../CustomListItem/CustomListItem';
import { type AutoText } from '@/src/hooks/useMasterData/masterData.interface';

interface Props {
  title: string;
  messageList: AutoText[];
  selectedItem: string;
  setSelectedItem: React.Dispatch<SetStateAction<string>>;
}

const MessageListComponent = ({ title, messageList, selectedItem, setSelectedItem }: Props) => {
  const { t } = useTranslation('index');
  const [search, setSearch] = useState<string>('');

  const handleItemClick = (item: AutoText) => {
    setSelectedItem(item.Name);
  };

  const filteredItems = messageList.filter((item) =>
    item.Name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Box display={'flex'} flexDirection={'row'} alignItems={'baseline'} columnGap={1}>
        <Typography variant="subtitle2" noWrap sx={{ flexShrink: 0 }}>
          {title}
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
          padding: '16px',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px',
          height: '250px',
          overflowY: 'scroll',
        }}
      >
        <ul style={{ margin: 0, padding: 0, listStyleType: 'none' }}>
          {filteredItems.map((item) => (
            <CustomListItem
              key={item.Name}
              item={item}
              isSelected={item.Name === selectedItem}
              onClick={() => {
                handleItemClick(item);
              }}
            />
          ))}
        </ul>
      </Box>
    </>
  );
};

export default MessageListComponent;
