export interface IFilmData {
  characters: string[] | IPeopleData[];
  created: Date;
  director: string;
  edited: Date;
  episode_id: string;
  opening_crawl: string;
  planets: string[] | IPlanetData[];
  producer: string;
  release_date: Date;
  species: string[] | ISpecieData[];
  starships: string[] | IStarshipData[];
  title: string;
  url: string;
  vehicles: string[] | IVehicleData[];
}

export interface IPeopleData {
  birth_year: string;
  eye_color: string;
  films: string[] | IFilmData[];
  gender: string;
  hair_color: string;
  height: string;
  homeworld: string | IPlanetData;
  mass: string;
  name: string;
  skin_color: string;
  created: Date;
  edited: Date;
  species: string[] | ISpecieData[];
  starships: string[] | IStarshipData[];
  url: string;
  vehicles: string[] | IVehicleData[];
}

export interface IPlanetData {
  climate: string;
  created: Date;
  diameter: string;
  edited: Date;
  films: string[] | IFilmData[];
  gravity: string;
  name: string;
  orbital_period: string;
  population: string;
  residents: string[] | IPeopleData[];
  rotation_period: string;
  surface_water: string;
  terrain: string;
  url: string;
}

export interface ISpecieData {
  average_height: string;
  average_lifespan: string;
  classification: string;
  created: Date;
  designation: string;
  edited: Date;
  eye_colors: string;
  hair_colors: string;
  homeworld: string | IPlanetData;
  language: string;
  name: string;
  people: string[] | IPeopleData[];
  films: string[] | IFilmData[];
  skin_colors: string;
  url: string;
}

export interface IStarshipData {
  MGLT: string;
  cargo_capacity: string;
  consumables: string;
  cost_in_credits: string;
  created: Date;
  crew: string;
  edited: Date;
  hyperdrive_rating: string;
  length: string;
  manufacturer: string;
  max_atmosphering_speed: string;
  model: string;
  name: string;
  passengers: string;
  films: string[] | IFilmData[];
  pilots: string[] | IPeopleData[];
  starship_class: string;
  url: string;
}

export interface IVehicleData {
  cargo_capacity: string;
  consumables: string;
  cost_in_credits: string;
  created: Date;
  crew: string;
  edited: Date;
  length: string;
  manufacturer: string;
  max_atmosphering_speed: string;
  model: string;
  name: string;
  passengers: string;
  pilots: string[] | IPeopleData[];
  films: string[] | IFilmData[];
  url: string;
  vehicle_class: string;
}

export interface IData {
  films?: string[] | IFilmData[];
  characters?: string[] | IPeopleData[];
  planets?: string[] | IPlanetData[];
  species?: string[] | ISpecieData[];
  starships?: string[] | IStarshipData[];
  vehicles?: string[] | IVehicleData[];
}

export enum ResourcesType {
  Films = 'films',
  People = 'people',
  Planets = 'planets',
  Species = 'species',
  Starships = 'starships',
  Vehicles = 'vehicles',
}

export enum ResourcesTypeFilm {
  Characters = 'characters',
  Planets = 'planets',
  Species = 'species',
  Starships = 'starships',
  Vehicles = 'vehicles',
}

export enum ResourcesTypePeople {
  Films = 'films',
  Species = 'species',
  Starships = 'starships',
  Vehicles = 'vehicles',
}

export enum ResourcesTypePlanets {
  Films = 'films',
  Residents = 'residents',
}

export enum ResourcesTypeSpecies {
  Films = 'films',
  People = 'people',
}

export enum ResourcesTypeStarships {
  Films = 'films',
  Pilots = 'pilots',
}

export interface IFilm extends IFilmData {
  number: number;
}
export interface IPeople extends IPeopleData {
  number: number;
}
