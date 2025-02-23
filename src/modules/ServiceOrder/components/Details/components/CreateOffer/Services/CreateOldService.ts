import { type GeraetGrupe } from '../Interfaces/GeraetGrupe';

export const createOld = (productGroupNumbers: number[], hasBinding: boolean) => {
  const geraeteGrupe: GeraetGrupe = {
    ProductGroupNumbers: productGroupNumbers,
    Manufacture: 1,
    Model: 2,
    SerialNumber: 3,
    ProductionNumber: 4,
    Year: 5,
    Color: 7,
    HasBinding: hasBinding,
    Binding: hasBinding ? 8 : -1,
  };
  return geraeteGrupe;
};
