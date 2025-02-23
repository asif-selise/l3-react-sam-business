import { useTranslation } from 'react-i18next';

export const usePrintHandler = (printContentRef: React.RefObject<HTMLDivElement>) => {
  const { t } = useTranslation('index');

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && printContentRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title></title>
            <style>
              /* Hide the default header and footer */
              @page {
                margin:0;
              }
              body {
                margin: 0;
                padding: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
              }
              th {
                padding-top: 12px;
                padding-bottom: 12px;
                text-align: left;
                background-color: #f2f2f2;
                color: black;
              }
            </style>
          </head>
          <body>
            <h1>${t('PRINT_SETUP_LISTS')}</h1>
            ${printContentRef.current.innerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.addEventListener(
        'load',
        () => {
          printWindow.print();
          printWindow.close();
        },
        { once: true }
      );
    }
  };

  return { handlePrint };
};
