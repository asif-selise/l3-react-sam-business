import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, TextField } from '@mui/material';
import ProductsTable from './components/ProductsTable/ProductsTable';
import { type TableData } from '@/src/components/CustomTable/types';
import useGetPaginatedProducts, {
  type IProductType,
} from '@/src/hooks/useGetPaginatedProducts/useGetPaginatedProducts.hook';
import { useDispatch } from 'react-redux';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import type { ApiResponse } from '@/src/interfaces/ApiResponse.interface';
import type { Products } from '@/src/hooks/useMasterData/masterData.interface';
import type { UseQueryResult } from '@tanstack/react-query';
import { getCustomTableSettings } from '@/src/components/CustomTable/utilities';

interface ProductSearchProps {
  onProductRowClick: (value: TableData) => void;
  type: IProductType;
}

const ProductSearch = ({ onProductRowClick, type }: ProductSearchProps) => {
  const { t } = useTranslation('index');
  const dispatch = useDispatch();

  const searchKeywordRef = useRef<HTMLInputElement>(null);
  const searchPIDRef = useRef<HTMLInputElement>(null);

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchPID, setSearchPID] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rowPerPage, setRowPerPage] = useState<number>(0);

  const productsData: UseQueryResult<ApiResponse<Products[]> | null, Error> =
    useGetPaginatedProducts(type, pageNumber, searchKeyword, String(searchPID), rowPerPage);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSearchKeyword(text);
    } catch (err) {}
  };

  const handlePasteFromClipboardWithoutSpecialChars = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSearchKeyword(text.replace(/[^\w\s]/gi, ''));
    } catch (err) {}
  };

  const handleApplyFilter = () => {
    setSearchKeyword(searchKeywordRef.current?.value ?? '');
    setSearchPID(searchPIDRef.current?.value ? Number(searchPIDRef.current?.value) || null : null);
  };

  useEffect(() => {
    if (productsData.isError) {
      dispatch(showErrorMessage(t('DATA_FETCH_ERROR')));
    }
  }, [productsData.isError]);

  useEffect(() => {
    productsData.refetch();
  }, [searchKeyword, searchPID]);

  return (
    <>
      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end', pb: 3, gap: 3 }}
        aria-label="product-search"
      >
        <Button variant="contained" color="primary" onClick={handlePasteFromClipboard}>
          {t('INSERT_FROM_CLIPBOARD')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePasteFromClipboardWithoutSpecialChars}
        >
          {t('INSERT_FROM_CLIPBOARD_WITHOUT_SPECIAL_CHARS')}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <TextField
          inputRef={searchKeywordRef}
          placeholder={t('SEARCH_BY_KEYWORD')}
          sx={{ width: '65%' }}
        />

        <TextField
          type="number"
          inputRef={searchPIDRef}
          placeholder={t('SEARCH_BY_PID')}
          sx={{ width: '35%' }}
          InputProps={{
            sx: {
              '& input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
              },
            },
          }}
        />
        <Button
          variant="outlined"
          color="primary"
          sx={{ height: 'auto', px: 2.5 }}
          onClick={handleApplyFilter}
        >
          {t('FILTER')}
        </Button>
      </Box>

      <ProductsTable
        data={productsData.data?.Data as unknown as TableData[]}
        onPageChange={(pagenumber) => {
          setPageNumber(pagenumber);
          setTimeout(() => {
            const tableInfo = getCustomTableSettings('ProductsTable');
            if (tableInfo) {
              setRowPerPage(tableInfo?.rowsPerPage);
            }
            productsData.refetch();
          }, 0);
        }}
        totalDataLength={productsData.data?.TotalCount ?? 0}
        isLoading={productsData.isLoading}
        onProductRowClick={onProductRowClick}
      />
    </>
  );
};

export default ProductSearch;
