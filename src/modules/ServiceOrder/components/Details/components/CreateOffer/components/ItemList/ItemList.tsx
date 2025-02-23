import CustomTableHead from '@/src/components/CustomTable/components/CustomTableHead/CustomTableHead';
import { type HeadCell } from '@/src/components/CustomTable/types';
import {
  Autocomplete,
  Box,
  Button,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Popper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ItemListRow from './components/ItemListRow/ItemListRow';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { type ButtonEvent, type EditControl, type GridEditControl } from '../../types';
import { type SamOfferProductDetail } from '@/src/hooks/useTourData/tourData.interface';
import Scrollbar from '@/src/components/Scrollbar/Scrollbar';
import { initCbo } from '../../Services/InitCbo';
import { useDispatch, useSelector } from '@/src/redux/store';
import {
  type SamOfferProduct,
  type Manufacturer,
  type SamOfferNewDeviceText,
  type SamOfferOldDeviceText,
} from '@/src/hooks/useMasterData/masterData.interface';
import { newDeviceAdditionalTextSelectionChanged } from '../../Services/NewDeviceAdditionalTextSelectionChanged';
import { styled } from '@mui/system';
import { type IDetail } from '../../Interfaces/IDetail';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { getArticleList } from '../../Services/GetArticleListService';
import { type ProductItem } from '../../Interfaces/ProductItem';
import { showErrorMessage } from '@/src/slices/snackbarSlice/snackbar.slice';
import { GetGeraetList } from '../../Services/GetGeraetList';
import { type GeraetGrupe } from '../../Interfaces/GeraetGrupe';
import { type GeraetItem } from '../../Interfaces/GeraetItem';
import ArticleSelection from './components/ItemListRow/components/ArticleSelection/ArticleSelection';
import GeraetSelection from './components/ItemListRow/components/GeraetSelection/GeraetSelection';
import { SaveGeraetList } from '../../Services/SaveGeraetList';
import { isRowIndexValid } from '../../Services/isRowIndexValid';
import { updateGrossExcl } from '../../Services/updateGrossExcl';
import { formatCurrency } from '@/src/helpers/formatCurrency';

interface Props {
  listData: GridEditControl[];
  manufacturers: Manufacturer[];
  geraetDetails: GeraetGrupe | null;
  samOfferProducts: SamOfferProduct[];
  detailItemsByCreation: [] | IDetail[];
  detailProducts: SamOfferProductDetail[] | null;
  samOfferOldDeviceTexts: SamOfferOldDeviceText[];
  samOfferNewDeviceTexts: SamOfferNewDeviceText[];
  setGeraetDetails: Dispatch<SetStateAction<GeraetGrupe | null>>;
  setListData: Dispatch<SetStateAction<GridEditControl[] | null>>;
  setDetailProducts: Dispatch<SetStateAction<SamOfferProductDetail[] | null>>;
  setActiveLoader: Dispatch<SetStateAction<boolean>>;
  activeLoader: boolean;
}

const ItemList = ({
  listData,
  setListData,
  manufacturers,
  geraetDetails,
  setGeraetDetails,
  samOfferOldDeviceTexts,
  samOfferNewDeviceTexts,
  detailProducts,
  samOfferProducts,
  detailItemsByCreation,
  setDetailProducts,
  setActiveLoader,
  activeLoader,
}: Props) => {
  const { t } = useTranslation('index');

  const [openItemSelection, setOpenItemSelection] = useState<boolean>(false);
  const [selectionType, setSelectionType] = useState<ButtonEvent>('None');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [itemList, setItemList] = useState<ProductItem[] | GeraetItem[]>([]);

  const dispatch = useDispatch();
  const serviceOrderId = useSelector((state) => state.serviceOrder.id);

  const mandantId = serviceOrderId % 10 !== 5 ? 1 : 2;

  const headCells: HeadCell[] = [
    {
      id: 'description',
      label: t('Description'),
      sortable: false,
    },
    {
      id: 'oldDevice',
      label: t('OLD_DEVICE'),
      sortable: false,
    },
    {
      id: 'newDevice',
      label: t('NEW_DEVICE'),
      sortable: false,
    },
    {
      id: 'article',
      label: t('ARTICLE'),
      sortable: false,
    },
    {
      id: 'grossExcl',
      label: t('GROSS_EXCL'),
      sortable: false,
    },
    {
      id: 'modifiedOn',
      label: t('MODIFIED_ON'),
      sortable: false,
    },
    {
      id: 'modifiedBy',
      label: t('MODIFIED_BY'),
      sortable: false,
    },
  ];

  const StyledPopper = styled(Popper)({
    '& .MuiAutocomplete-paper': {
      width: '200px',
    },
    '& .MuiAutocomplete-listbox': {
      fontSize: '14px',
      '& .MuiAutocomplete-option': {
        margin: 0,
      },
    },
  });

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    description: true,
    oldDevice: true,
    newDevice: true,
    article: true,
    grossExcl: true,
    modifiedOn: true,
    modifiedBy: true,
  });

  const OnGeraetListSelectionSave = async (updatedGeraetItems: GeraetItem[]) => {
    const indexValidation = isRowIndexValid(selectedIndex, listData);
    if (indexValidation) {
      dispatch(showErrorMessage(t(indexValidation)));
      return null;
    }

    const updatedGeraetItem = updatedGeraetItems.find((item) => item.Data.IsChecked) ?? null;

    if (selectedIndex) {
      const updatedListData = [...listData];

      SaveGeraetList({
        geraetItems: updatedGeraetItems,
        samOfferDetailId: updatedListData[selectedIndex].Article?.DataContext?.DetailId ?? 0,
        samOfferDetailUId: updatedListData[selectedIndex].Article?.DataContext?.UId ?? '',
        geraetItem: updatedGeraetItem,
        geraetDetails,
        setGeraetDetails,
        detailProducts: detailProducts ?? [],
        setDetailProducts,
        manufacturers,
      });

      const targetRow = updatedListData[selectedIndex];

      if (!updatedGeraetItem && targetRow.Article) {
        // targetRow.Article.Text = null;
        // setListData(updatedListData);

        setActiveLoader(true);
        const { grossError, result } = await updateGrossExcl(
          listData,
          targetRow.Article,
          selectedIndex,
          detailItemsByCreation,
          detailProducts
        );
        setActiveLoader(false);
        if (grossError) dispatch(showErrorMessage(grossError));
        if (result && !grossError) setListData(result);
      }

      handleItemSelectionModalClose();
    }
  };

  const updateListDataOnUpdateOfArticleList = async (
    updatedDetailProducts: SamOfferProductDetail[] | null,
    text: string | null
  ) => {
    setDetailProducts(updatedDetailProducts);

    const indexValidation = isRowIndexValid(selectedIndex, listData);
    if (indexValidation) {
      dispatch(showErrorMessage(t(indexValidation)));
      return null;
    }

    if (selectedIndex) {
      const updatedListData = [...listData];
      const targetRow = updatedListData[selectedIndex];
      const newDeviceAdditional = targetRow.NewDeviceAdditional;

      if (newDeviceAdditional) {
        newDeviceAdditional.Text = text;
        newDeviceAdditional.isEnabled = false;
      }
      setListData(updatedListData);

      if (targetRow.Article) {
        setActiveLoader(true);
        const { grossError, result } = await updateGrossExcl(
          listData,
          targetRow.Article,
          selectedIndex,
          detailItemsByCreation,
          updatedDetailProducts
        );
        setActiveLoader(false);
        if (grossError) dispatch(showErrorMessage(grossError));
        if (result && !grossError) setListData(result);
      }

      handleItemSelectionModalClose();
    }
  };

  const handleItemSelectionModalClose = () => {
    setOpenItemSelection(false);
    setSelectionType('None');
    setItemList([]);
    setSelectedIndex(null);
  };

  const renderSelectList = (
    data: EditControl,
    identifier: string,
    row: GridEditControl,
    index: number
  ) => {
    const handleChange = async (value: string | null, data: EditControl) => {
      const updatedRow = {
        ...row,
        [identifier]: {
          ...data,
          Text: value,
        },
      };

      if (identifier === 'OldDeviceAnswer') {
        setActiveLoader(true);
        const newDeviceData = await initCbo({
          mandantId,
          productGroupNumbers: geraetDetails?.ProductGroupNumbers ?? [],
          manufacturers,
          samOfferOldDeviceTexts,
          samOfferNewDeviceTexts,
          data,
          oldDeviceUpdatedText: value ?? '',
          row,
          tableData: listData,
        });
        setActiveLoader(false);

        if (updatedRow.Article) {
          updatedRow.Article.isEnabled = newDeviceData.Type === 'ComboBox';
        }

        const updatedListData = [...listData];
        updatedListData[index] = updatedRow;
        updatedListData[index].NewDeviceAdditional = newDeviceData;

        setListData(updatedListData);
      }
      if (identifier === 'NewDeviceAdditional') {
        setActiveLoader(true);

        const { error, validationError } = await newDeviceAdditionalTextSelectionChanged({
          data,
          mandantId,
          manufacturers,
          row: updatedRow, // might need to change later
          rowIndex: index,
          addedItem: value,
          setDetailProducts,
          tableData: listData,
          samOfferOldDeviceTexts,
          samOfferNewDeviceTexts,
          geraete: geraetDetails,
          setTableData: setListData,
          setGeraete: setGeraetDetails,
          detailItems: detailItemsByCreation,
          detailProducts: detailProducts ?? [],
          newDeviceAdditionalUpdatedText: value ?? '',
          removedItem: row.NewDeviceAdditional?.Text ?? '',
          productGroupNumbers: geraetDetails?.ProductGroupNumbers ?? [],
        });

        setActiveLoader(false);

        if (error) dispatch(showErrorMessage(error));
        if (validationError) dispatch(showErrorMessage(t(validationError)));
      }
    };
    return (
      <Autocomplete
        fullWidth
        size="small"
        options={data.DataSource && data.DataSource.length > 0 ? data.DataSource : []}
        value={data.Text ?? ''}
        disabled={data.isEnabled === null || data.isEnabled === undefined ? false : !data.isEnabled}
        getOptionLabel={(option) => option}
        onChange={(event, newValue) => {
          handleChange(newValue, data);
        }}
        PopperComponent={StyledPopper}
        renderInput={(params) => <TextField {...params} sx={{ minWidth: '116px' }} />}
      />
    );
  };

  const renderButton = (data: EditControl, rowIndex: number) => {
    const handleSelectionClick = async (type: ButtonEvent) => {
      setSelectedIndex(rowIndex);
      setSelectionType(type);

      if (type === 'Article') {
        setActiveLoader(true);
        const articleList: ProductItem[] = await getArticleList({
          data,
          samOfferProducts,
          detailProducts: detailProducts ?? [],
        });
        setActiveLoader(false);
        setItemList(articleList);
      }

      if (type === 'Geraet') {
        setActiveLoader(true);
        const geraetList = await GetGeraetList({
          mandantId,
          manufacturers,
          data,
          geraetDetails,
          detailProducts: detailProducts ?? [],
        });
        setActiveLoader(false);

        if (geraetList) {
          setItemList(geraetList);
        }
      }
    };
    return (
      <Button
        variant="outlined"
        fullWidth
        size="small"
        sx={{ pt: '17px', pb: '17px' }}
        startIcon={<AddTaskIcon />}
        disabled={data.isEnabled === false}
        onClick={() => {
          handleSelectionClick(data.buttonEventType ?? 'None');
        }}
      >
        {data.Text ?? ''}
      </Button>
    );
  };

  const renderTextField = (
    data: EditControl,
    identifier: string,
    rowIndex: number,
    rowData: GridEditControl,
    isReadOnly?: boolean | null
  ) => {
    const getDefaultValue = (text: string | number | null) => {
      if (identifier === 'GrossExcl') {
        return formatCurrency(Number(data.Text));
      }

      if (identifier === 'NewDeviceAdditional' && !text) {
        return '';
      }

      return sanitizeData(text);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedRow = {
        ...rowData,
        [identifier]: {
          ...data,
          Text: event.target.value,
        },
      };

      const updatedListData = [...listData];
      updatedListData[rowIndex] = updatedRow;

      setListData(updatedListData);
    };

    return (
      <TextField
        fullWidth
        hiddenLabel={true}
        disabled={identifier !== 'NewDeviceAdditional'}
        variant="filled"
        size="small"
        value={getDefaultValue(data.Text)}
        onChange={handleChange}
        sx={{ paddingTop: '-20px' }}
      />
    );
  };

  const getRowData = (
    data: EditControl | null,
    identifier: string,
    row: GridEditControl,
    index: number
  ): React.ReactNode => {
    if (data !== null) {
      switch (data.Type) {
        case 'TextBox':
          return renderTextField(data, identifier, index, row, data.isReadOnly);
        case 'ComboBox':
          return renderSelectList(data, identifier, row, index);
        case 'Button':
          return renderButton(data, index);
        default:
          return <></>;
      }
    }
    return <></>;
  };

  useEffect(() => {
    if (selectionType === 'Article' || selectionType === 'Geraet') setOpenItemSelection(true);
  }, [selectionType]);

  return (
    <>
      <Box>
        <TableContainer>
          <Scrollbar>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
              <CustomTableHead
                order={'asc'}
                orderBy={''}
                onRequestSort={() => {}}
                headCells={headCells}
                columnVisibility={columnVisibility}
              />
              <TableBody>
                {listData.map((row: GridEditControl, index: number) => {
                  return (
                    <ItemListRow
                      key={index}
                      article={getRowData(row.Article, 'Article', row, index)}
                      grossExcl={getRowData(row.GrossExcl, 'GrossExcl', row, index)}
                      modifiedOn={getRowData(row.ModifiedOn, 'ModifiedOn', row, index)}
                      modifiedBy={getRowData(row.ModifiedBy, 'ModifiedBy', row, index)}
                      oldDevice={getRowData(row.OldDeviceAnswer, 'OldDeviceAnswer', row, index)}
                      description={String(
                        row.RowDescription !== null ? row.RowDescription.Text : ''
                      )}
                      newDevice={getRowData(
                        row.NewDeviceAdditional,
                        'NewDeviceAdditional',
                        row,

                        index
                      )}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Box>

      {selectionType === 'Article' && (
        <ArticleSelection
          openArticleSelection={openItemSelection}
          itemList={itemList as ProductItem[]}
          detailProducts={detailProducts}
          onClose={handleItemSelectionModalClose}
          onSave={updateListDataOnUpdateOfArticleList}
        />
      )}

      {selectionType === 'Geraet' && (
        <GeraetSelection
          activeLoader={activeLoader}
          openGeraetSelection={openItemSelection}
          itemList={itemList as GeraetItem[]}
          onSave={OnGeraetListSelectionSave}
          onClose={handleItemSelectionModalClose}
          hasBinding={geraetDetails?.HasBinding ?? false}
        />
      )}
    </>
  );
};

export default ItemList;
