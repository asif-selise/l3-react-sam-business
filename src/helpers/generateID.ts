import { v4 as uuidv4 } from 'uuid';
import { minuteToMilliseconds } from './formatDate';

export const getUniqueID = (): string => {
  return uuidv4();
};

export const getUniqueNumber = (): number => {
  const minutes = Math.floor(Date.now() / minuteToMilliseconds);
  const random = Number((Math.random() * 100000).toFixed());

  return minutes + random;
};

export const addUniqueIDs = <T extends object>(data: T[], key: string = 'Id'): T[] => {
  return data.map((item) => ({ ...item, [key]: uuidv4() }));
};

export const uniqueRandomNumberGenerator = () => {
  const generatedNumbers = new Set();

  return () => {
    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1;
    } while (generatedNumbers.has(randomNumber));

    generatedNumbers.add(randomNumber);
    return randomNumber;
  };
};
