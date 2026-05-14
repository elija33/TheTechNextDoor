import { carouselImagesApi } from '../services/api';

export interface CarouselImage {
  id: string;
  name: string;
  data: string;
}

export async function getCarouselImages(): Promise<CarouselImage[]> {
  try {
    const response = await carouselImagesApi.getAll();
    return response.data as CarouselImage[];
  } catch {
    return [];
  }
}

export async function saveCarouselImages(images: CarouselImage[]): Promise<void> {
  await carouselImagesApi.saveAll(images);
}
