import { Tea } from '../../shared/models';

export const expectedTeas = [
  {
    id: 1,
    name: 'Green',
    image: require(`../../assets/images/green.jpg`).default,
    description: 'Green tea description.',
    rating: 0,
  },
  {
    id: 2,
    name: 'Black',
    image: require(`../../assets/images/black.jpg`).default,
    description: 'Black tea description.',
    rating: 1,
  },
  {
    id: 3,
    name: 'Herbal',
    image: require(`../../assets/images/herbal.jpg`).default,
    description: 'Herbal Infusion description.',
    rating: 2,
  },
  {
    id: 4,
    name: 'Oolong',
    image: require(`../../assets/images/oolong.jpg`).default,
    description: 'Oolong tea description.',
    rating: 3,
  },
  {
    id: 5,
    name: 'Dark',
    image: require(`../../assets/images/dark.jpg`).default,
    description: 'Dark tea description.',
    rating: 4,
  },
  {
    id: 6,
    name: 'Puer',
    image: require(`../../assets/images/puer.jpg`).default,
    description: 'Puer tea description.',
    rating: 5,
  },
  {
    id: 7,
    name: 'White',
    image: require(`../../assets/images/white.jpg`).default,
    description: 'White tea description.',
    rating: 0,
  },
  {
    id: 8,
    name: 'Yellow',
    image: require(`../../assets/images/yellow.jpg`).default,
    description: 'Yellow tea description.',
    rating: 0,
  },
];

export const resultTeas = () => {
  return expectedTeas.map((t: Tea) => {
    const tea = { ...t };
    // @ts-ignore
    delete tea.image;
    delete tea.rating;
    return tea;
  });
};
