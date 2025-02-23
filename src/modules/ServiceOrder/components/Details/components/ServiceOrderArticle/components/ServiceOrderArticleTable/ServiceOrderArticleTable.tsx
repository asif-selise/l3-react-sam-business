import CustomTable from '@/src/components/CustomTable/CustomTable';
import { type HeadCell, type TableData } from '@/src/components/CustomTable/types';
import OverflowTooltip from '@/src/components/OverflowTooltip/OverflowTooltip';
import { formatCurrency } from '@/src/helpers/formatCurrency';
import { sanitizeData } from '@/src/helpers/sanitizeData';
import { Checkbox, TableCell, TableRow } from '@mui/material';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  data: TableData[];
  isLoading: boolean;
}

const ServiceOrderArticleTable = ({ data, isLoading }: Props) => {
  const { t } = useTranslation('index');
  const tableHeaders: HeadCell[] = [
    {
      id: 'anz',
      label: t('ANZ'),
      sortable: true,
    },
    {
      id: 'itemNo',
      label: t('ITEM_NO'),
      sortable: true,
    },
    {
      id: 'articleDescription',
      label: t('ARTICLE_DESCRIPTION'),
      sortable: true,
    },
    {
      id: 'orderRemark',
      label: t('ORDER_REMARK'),
      sortable: false,
    },
    {
      id: 'flatRateExcl',
      label: t('FLAT_RATE_EXCL'),
      align: 'right',
      sortable: true,
    },
    {
      id: 'grossIncl',
      label: t('GROSS_INCL'),
      align: 'right',
      sortable: true,
    },
    {
      id: 'grossExcl',
      label: t('GROSS_EXCL'),
      align: 'right',
      sortable: true,
    },
    {
      id: 'rabAutomation',
      label: t('RAB_AUTOMATION'),
      sortable: false,
      align: 'center',
    },
    {
      id: 'rab1',
      label: 'Rab 1',
      sortable: true,
    },
    {
      id: 'rab2',
      label: 'Rab 2',
      sortable: true,
    },
    {
      id: 'fEASExcl',
      label: t('FEA_S_EXCL'),
      sortable: true,
      align: 'right',
    },
    {
      id: 'bestOn',
      label: t('BEST_ON'),
      sortable: true,
    },
    {
      id: 'productID',
      label: t('PRODUCT_ID'),
      sortable: true,
    },
  ];
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    anz: false,
    itemNo: true,
    articleDescription: true,
    orderRemark: true,
    flatRateExcl: true,
    grossIncl: true,
    grossExcl: true,
    rabAutomation: true,
    rab1: true,
    rab2: true,
    fEASExcl: false,
    bestOn: false,
    productID: false,
  });
  const [tableData, setTableData] = useState<TableData[]>([]);

  return (
    <CustomTable
      roundedHead={false}
      headCells={tableHeaders}
      setTableData={setTableData}
      rows={data}
      isLoading={isLoading}
      numberOfRowsPerPage={5}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      tableName="ServiceOrderArticleTable"
    >
      {!isLoading && !!data.length && (
        <>
          {tableData.map((row) => {
            return (
              <Fragment key={row.id as number}>
                <TableRow hover tabIndex={-1}>
                  {columnVisibility.anz && (
                    <TableCell align="left">{sanitizeData(row.Quantity)}</TableCell>
                  )}
                  {columnVisibility.itemNo && (
                    <TableCell align="left">
                      <OverflowTooltip text={sanitizeData(row.ArticleNumber)} variant="body2" />
                    </TableCell>
                  )}
                  {columnVisibility.articleDescription && (
                    <TableCell align="left">
                      <OverflowTooltip
                        text={sanitizeData(row.ArticleDescription)}
                        variant="body2"
                      />
                    </TableCell>
                  )}
                  {columnVisibility.orderRemark && (
                    <TableCell align="left">
                      <OverflowTooltip text={'-'} variant="body2" />
                    </TableCell>
                  )}
                  {columnVisibility.flatRateExcl && (
                    <TableCell align="right">{formatCurrency(row.FixedPrice as number)}</TableCell>
                  )}
                  {columnVisibility.grossIncl && (
                    <TableCell align="right">
                      {formatCurrency(row.FixedPriceExcl as number)}
                    </TableCell>
                  )}
                  {columnVisibility.grossExcl && (
                    <TableCell align="right">{formatCurrency(row.Gross as number)}</TableCell>
                  )}
                  {columnVisibility.rabAutomation && (
                    <TableCell align="center">
                      <Checkbox disabled defaultChecked={!!row.AutoDiscount} />
                    </TableCell>
                  )}
                  {columnVisibility.rab1 && (
                    <TableCell align="left">{formatCurrency(row.Discount1 as number)}</TableCell>
                  )}
                  {columnVisibility.rab2 && (
                    <TableCell align="left"> {formatCurrency(row.Discount2 as number)}</TableCell>
                  )}
                  {columnVisibility.fEASExcl && (
                    <TableCell align="right">{formatCurrency(row.Sensitivity as number)}</TableCell>
                  )}
                  {columnVisibility.bestOn && (
                    <TableCell align="left">{sanitizeData(row.OrderedOn)}</TableCell>
                  )}
                  {columnVisibility.productID && (
                    <TableCell align="left">{sanitizeData(row.ProductId)}</TableCell>
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
export default ServiceOrderArticleTable;
