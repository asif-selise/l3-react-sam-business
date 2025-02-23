import { Alert, Box, Checkbox, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { type ProductItem } from '../../../../../../Interfaces/ProductItem';
import SaveArticleList from '../../../../../../Services/SaveArticleList';
import { type SamOfferProductDetail } from '@/src/hooks/useTourData/tourData.interface';
import ItemListSelectionModal from '../ItemListSelectionModal/ItemListSelectionModal';
import { useTranslation } from 'react-i18next';

interface Props {
  openArticleSelection: boolean;
  itemList: ProductItem[];
  detailProducts: SamOfferProductDetail[] | null;
  onSave: (
    updatedDetailProducts: SamOfferProductDetail[] | null,
    text: string | null
  ) => Promise<null | undefined>;
  onClose: () => void;
}

const ArticleSelection = ({
  openArticleSelection,
  onClose,
  detailProducts,
  itemList,
  onSave,
}: Props) => {
  const { t } = useTranslation('index');

  const [dataList, setDataList] = useState<ProductItem[]>([]);

  const handleCheckboxChange = (productId: number) => {
    setDataList((prevList) =>
      prevList.map((item) =>
        item.ProductId === productId
          ? {
              ...item,
              SelectedToEdit: !item.SelectedToEdit,
              Quantity: !item.SelectedToEdit ? 1 : 0,
            }
          : item
      )
    );
  };

  const handleInputChange = (productId: number, value: number) => {
    setDataList((prevList) =>
      prevList.map((item) => (item.ProductId === productId ? { ...item, Quantity: value } : item))
    );
  };

  const handleItemSelectionSave = () => {
    const { updatedDetailProducts, newDeviceAdditionalText } = SaveArticleList(
      dataList,
      detailProducts
    );
    onSave(updatedDetailProducts, newDeviceAdditionalText);
  };

  useEffect(() => {
    const updatedItems = itemList.map((item) => ({
      ...item,
      SelectedToEdit: item.Quantity > 0,
    }));
    setDataList(updatedItems);
  }, [itemList]);

  return (
    <ItemListSelectionModal
      isOpen={openArticleSelection}
      onSave={handleItemSelectionSave}
      onClose={onClose}
    >
      <Alert severity="info" sx={{ pl: 2 }}>
        {t('SELECT_ONE_OR_MORE_ITEMS_BY_SELECTING_THE_RELEVANT_ROWS')}
      </Alert>
      <Box padding={'16px'} display={'flex'} flexDirection={'column'} rowGap={1}>
        {dataList.length > 0 ? (
          dataList.map((item) => (
            <Box key={item.ProductId} display={'flex'} columnGap={3} alignItems={'center'}>
              <Checkbox
                sx={{ maxWidth: '50px', ml: -1 }}
                checked={item.SelectedToEdit}
                onChange={() => {
                  handleCheckboxChange(item.ProductId);
                }}
              />

              <TextField
                disabled={!item.SelectedToEdit}
                required
                type="number"
                size="small"
                value={item.Quantity ?? 0}
                inputProps={{ min: 0 }}
                onChange={(e) => {
                  handleInputChange(item.ProductId, Number(e.target.value));
                }}
                sx={{
                  minWidth: '64px',
                  maxWidth: '100px',
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                  },
                }}
                variant="outlined"
              />

              <OverflowTooltip variant="body2" text={item.Text ?? ''} />
            </Box>
          ))
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={'100%'}
            height="calc(56vh - 250px)"
          >
            <Typography>{t('NO_LIST_FOUND')}</Typography>
          </Box>
        )}
      </Box>
    </ItemListSelectionModal>
  );
};

export default ArticleSelection;
