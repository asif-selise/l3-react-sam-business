import { screen } from '@testing-library/react';
import { type NightDeliveryData } from '@/src/hooks/useGetPostOrderOrGoodsReceiptData/types';
import EditNightDelivery from './EditNightDelivery';
import { renderRootProvider } from '@/src/components/RootProviderTest/RootProviderTest';
import React from 'react';

const mockData: NightDeliveryData = {
  isNightOrder: false,
  OrderedDate: '2024-02-06',
  SamOrderId: 12345,
  OrderId: 67890,
  AppointmentDate: '2024-02-07',
  IsWga: true,
  ManufacturerId: 98765,
  ManufacturerName: 'Sample Manufacturer',
  ManufacturerArticleNumber: 'ABC-123',
  ProductId: 54321,
  ProductDescription: 'Sample Product',
  IsPartialDelivery: null,
  ListPriceExclTax: 49.99,
  DeliveryNumber: 'DEL-001',
  OrderedQuantity: 10,
  ReceivedQuantity: 5,
  DeliveredNumber: 5,
  SamOrderDetailId: null,
};

describe('EditNightDelivery Component', () => {
  test('renders the component with the correct data', () => {
    renderRootProvider(<EditNightDelivery data={mockData} onSave={jest.fn()} ref={null} />);

    const soNrTextField = screen.getByLabelText('SO NR');
    const soNrInputElement = soNrTextField.querySelector('input');
    expect(soNrInputElement).toHaveValue('67890');

    const anzArrivedTextField = screen.getByLabelText('Anz Arrived');
    const anzInputElement = anzArrivedTextField.querySelector('input');
    expect(anzInputElement).toHaveValue(mockData.DeliveredNumber);
  });

  // test('calls onSave when form is submitted', () => {
  //   const onSaveMock = jest.fn();
  //   const ref = { current: { handleSubmitForm: jest.fn() } };
  //   renderRootProvider(<EditNightDelivery data={mockData} onSave={onSaveMock} ref={ref} />);

  //   fireEvent.change(screen.getByLabelText('SO NR'), { target: { value: '8' } });

  //   ref.current.handleSubmitForm();

  //   expect(onSaveMock).toHaveBeenCalledWith(
  //     expect.objectContaining({ DeliveredNumber: 8})
  //   );
  // });

  test('renders the checkbox checked if IsWga is true', () => {
    renderRootProvider(<EditNightDelivery data={mockData} onSave={jest.fn()} ref={null} />);

    const checkbox = screen.getByLabelText('SWGA');
    const checkboxInputElement = checkbox.querySelector('input');
    expect(checkboxInputElement).toBeChecked();
  });
});
