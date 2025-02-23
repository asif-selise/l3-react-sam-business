import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { Checkbox, TableCell, TableRow } from '@mui/material';
import { type Dispatch, Fragment, type SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/src/helpers/formatCurrency';
import dayjs from 'dayjs';

interface Props {
  data: TableData[];
  isLoading: boolean;
  totalDataLength: number;
  onProductRowClick: (value: TableData) => void;
  onPageChange: Dispatch<SetStateAction<number>>;
}

const ProductsTable = ({
  data,
  isLoading,
  onProductRowClick,
  totalDataLength,
  onPageChange,
}: Props) => {
  const { t } = useTranslation('index');

  const headCells: HeadCell[] = [
    { id: 'sWGA', label: t('S_WGA'), sortable: false },
    { id: 'description', label: t('DESCRIPTION'), sortable: false },
    { id: 'listPriceExcl', label: t('LIST_PRICE_EXCL'), align: 'right', sortable: true },
    { id: 'manufacturer', label: t('MANUFACTURER'), sortable: false },
    { id: 'color', label: t('COLOR'), sortable: false },
    { id: 'bandung', label: t('BANDUNG'), sortable: false },
    { id: 'listPriceIncl', label: t('LIST_PRICE_INCL'), align: 'right', sortable: false },
    { id: 'recyclingFee', label: t('RECYCLING_FEE'), align: 'left', sortable: false },
    { id: 'type', label: t('TYPE'), sortable: false },
    { id: 'manufacturerNumber', label: t('MANUFACTURER_NUMBER'), align: 'left', sortable: false },
    { id: 'productGroupNo', label: t('PRODUCT_GROUP_NO'), align: 'left', sortable: false },
    { id: 'isBargain', label: t('IS_BARGAIN'), align: 'center', sortable: false },
    { id: 'modifiedAt', label: t('MODIFIED_AT'), sortable: false },
    { id: 'displayArticleNo', label: t('DISPLAY_ARTICLE_NO'), align: 'left', sortable: false },
    {
      id: 'articleNoWithoutSpecialChars',
      label: t('ARTICLE_NO_WITHOUT_SPECIAL_CHARS'),
      align: 'left',
      sortable: false,
    },
    { id: 'productID', label: t('PRODUCT_ID'), align: 'left', sortable: false },
    { id: 'productType', label: t('PRODUCT_TYPE'), align: 'left', sortable: false },
    { id: 'manufacturerId', label: t('MANUFACTURER_ID'), align: 'left', sortable: false },
    { id: 'productGroup', label: t('PRODUCT_GROUP'), align: 'left', sortable: false },
    { id: 'productGroupText', label: t('PRODUCT_GROUP_TEXT'), sortable: false },
    { id: 'isActive', label: t('IS_ACTIVE'), align: 'center', sortable: false },
  ];

  const [tableData, setTableData] = useState<TableData[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    sWGA: true,
    description: true,
    listPriceExcl: true,
    manufacturer: true,
    color: true,
    bandung: true,
    listPriceIncl: false,
    recyclingFee: false,
    type: true,
    manufacturerNumber: false,
    productGroupNo: false,
    isBargain: true,
    modifiedAt: false,
    displayArticleNo: false,
    articleNoWithoutSpecialChars: false,
    productID: false,
    productType: true,
    manufacturerId: false,
    productGroup: false,
    productGroupText: false,
    isActive: true,
  });

  return (
    <CustomTable
      tableName="ProductsTable"
      headCells={headCells}
      setTableData={setTableData}
      rows={data ?? []}
      isLoading={isLoading}
      numberOfRowsPerPage={5}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      totalDataLength={totalDataLength}
      onPageChange={onPageChange}
      serverPagination={true}
    >
      {data && data.length > 0 && (
        <>
          {tableData.map((row, index) => {
            return (
              <Fragment key={index}>
                <TableRow
                  hover
                  tabIndex={-1}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    onProductRowClick(row);
                  }}
                  aria-label="product-row"
                >
                  {columnVisibility.sWGA && (
                    <TableCell align="left">
                      <Checkbox disabled checked={!!row.sWGA} />
                    </TableCell>
                  )}
                  {columnVisibility.description && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.Description ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.listPriceExcl && (
                    <TableCell align="right">
                      {formatCurrency(row.ListPriceExcl as number)}
                    </TableCell>
                  )}
                  {columnVisibility.manufacturer && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.Manufacturer ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.color && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.Color ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.bandung && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.Binding ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.listPriceIncl && (
                    <TableCell align="right">
                      {formatCurrency(row.ListPriceIncl as number)}
                    </TableCell>
                  )}
                  {columnVisibility.recyclingFee && (
                    <TableCell align="left">{formatCurrency(row.RecyclingFee as number)}</TableCell>
                  )}
                  {columnVisibility.type && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.Type ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.manufacturerNumber && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.ManufacturerNumber ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.productGroupNo && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.ProductGroupNumber ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.isBargain && (
                    <TableCell align="center">
                      <Checkbox disabled checked={!!row.IsBargain} />
                    </TableCell>
                  )}
                  {columnVisibility.modifiedAt && (
                    <TableCell align="left">
                      <OverflowTooltip
                        text={`${dayjs(row.ModifiedAt as string).format('DD.MM.YYYY HH:mm')}`}
                      />
                    </TableCell>
                  )}
                  {columnVisibility.displayArticleNo && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.DisplayArticleNumber ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.articleNoWithoutSpecialChars && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.ArticleNumberWithoutSpecialChars ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.productID && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.ProductId ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.productType && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.ProductType ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.manufacturerId && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.ManufacturerId ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.productGroup && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.ProductGroup ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.productGroupText && (
                    <TableCell align="left">
                      <OverflowTooltip text={`${row.ProductGroupText ?? '-'}`} />
                    </TableCell>
                  )}
                  {columnVisibility.isActive && (
                    <TableCell align="center">
                      <Checkbox disabled checked={!!row.IsActive} />
                    </TableCell>
                  )}
                </TableRow>
              </Fragment>
            );
          })}
        </>
      )}
    </CustomTable>
  );
};
export default ProductsTable;
