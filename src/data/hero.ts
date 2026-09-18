import { HeroBanner } from '@/types';

export const heroBanners: HeroBanner[] = [
  {
    id: 'hero-1',
    title: 'Welcome to BurgerFuel',
    subtitle: 'Premium burgers & more',
    image: '/images/banner-1.jpeg',
    mobileImage: '/images/m-banner-1.jpeg',
    link: '/?category=crispy-burger#menu',
  },
  {
    id: 'hero-2',
    title: 'Try Our New Pizzas',
    subtitle: 'Handcrafted with love',
    image: '/images/banner-2.jpeg',
    mobileImage: '/images/m-banner-2.jpeg',
    link: '/?category=midnight-deals#menu',
  },
  {
    id: 'hero-3',
    title: 'Special Deals',
    subtitle: 'Save big on your favorites',
    image: '/images/banner-3.jpeg',
    mobileImage: '/images/m-banner-3.jpeg',
    link: '/?category=deals#menu',
  },
];

export const heroData = {
  banners: heroBanners,
};
