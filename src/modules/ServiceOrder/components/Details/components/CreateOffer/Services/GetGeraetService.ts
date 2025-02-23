import { createNew } from './CreateNewService';
import { createOld } from './CreateOldService';

export const getGeraet = (samOfferType: number) => {
  let geraet;
  switch (samOfferType) {
    case 1:
    case 2:
    case 6:
      geraet = createOld([20, 21, 22, 23], false);
      break;
    case 3:
      geraet = createOld([32], true);
      break;
    case 4:
      geraet = createOld([24], false);
      break;
    case 5:
      geraet = createOld([33], false);
      break;
    case 7:
      geraet = createOld([25], true);
      break;
    case 8:
      geraet = createOld([45], true);
      break;
    case 9:
      geraet = createOld([46], false);
      break;
    case 10:
      geraet = createOld([60], false);
      break;
    case 11:
      geraet = createNew([32], 37, 38);
      break;
    case 12:
      geraet = createNew([20, 21, 22, 23], 43, -1);
      break;
    case 13:
      geraet = createNew([24], 49, -1);
      break;
    case 14:
      geraet = createNew([33], 59, -1);
      break;
    case 15:
      geraet = createNew([25], 65, 66);
      break;
    case 16:
    default:
      geraet = createNew([45], 76, 77);
      break;

    // throw new WrongEnumException(idSamNoTyp);
  }

  return geraet;
};
