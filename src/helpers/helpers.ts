import {
  ResourcesType,
  type IFilmData,
  type IPeopleData,
  type IPlanetData,
  type ISpecieData,
  type IStarshipData,
  type IVehicleData,
} from '@/types';

interface IDataWithNumber {
  number: number;
}

type SwapiData = IFilmData | IPeopleData | IPlanetData | ISpecieData | IVehicleData | IStarshipData;

export function addNumberToItems<T extends SwapiData>(swapiData: T[]): (T & IDataWithNumber)[] {
  function addNumberToItem(index: number) {
    return (item: T): T & IDataWithNumber => ({
      ...item,
      number: index,
    });
  }

  let index = 1;
  const data: (T & IDataWithNumber)[] = [];
  swapiData.forEach((swapiItem) => {
    const item = addNumberToItem(index)(swapiItem);
    data.push(item);
    index++;
  });
  return data;
}
