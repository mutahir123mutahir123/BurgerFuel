import { heroBanners } from '@/data/hero';
import { HeroSlider } from './HeroSlider';

export function Hero() {
  return (
    <section className="w-full">
      <HeroSlider banners={heroBanners} />
    </section>
  );
}
