import { type GeraetGrupe } from '../Interfaces/GeraetGrupe';

export const createNew = (productGroupNumbers: number[], color: number, binding: number) => {
  const geraeteGrupe: GeraetGrupe = {
    ProductGroupNumbers: productGroupNumbers,
    Manufacture: 28,
    Model: 29,
    SerialNumber: 30,
    ProductionNumber: 31,
    Year: 32,
    Color: color,
    Binding: binding,
    HasBinding: binding !== -1,
  };
  return geraeteGrupe;
};
