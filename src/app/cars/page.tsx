'use client';

import { Header } from '@/components/common/Header';
import { Page } from '@/components/Page';
import { List, Button, Section, Pagination } from '@telegram-apps/telegram-ui';
import Image from 'next/image';
import { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Car, TransmissionType, RestrictionType } from '@/types/car';
import { Footer } from '@/components/common/Footer';

// Временные тестовые данные
const mockCars: Car[] = [
  {
    id: '1',
    brand: 'BMW',
    model: 'X5',
    registrationNumber: 'А123ВС777',
    vinNumber: 'WBAKJ21080J123456',
    transmissionType: TransmissionType.AUTOMATIC,
    restrictionType: RestrictionType.NONE,
    currentPrice: 3500000,
    year: 2019,
    photos: Array(10).fill('https://s3.cdn.lego-car.ru/nuxt/27e0af9e884e40de2760f5e7ccb58a73.jpg?url=https://storage.yandexcloud.net/cars-main/news/d6b18256-14a5-450e-a0a4-9e11babbcf1f.jpg&w=1720&h=1024&m=crop'),
    enginePower: 249,
    engineVolume: 3.0,
    ownerCount: 2,
    retailPrice: 3800000,
    minimalPrice: 3200000,
    bitDate: '2024-03-20',
    additionalInfo: ['Полный привод', 'Кожаный салон'],
    problemInfo: ['Небольшая вмятина на заднем бампере']
  },
  {
    id: '2',
    brand: 'Mercedes-Benz',
    model: 'E-Class',
    registrationNumber: 'В456АМ197',
    vinNumber: 'WDD2130421A123789',
    transmissionType: TransmissionType.AUTOMATIC,
    restrictionType: RestrictionType.PLEDGE,
    currentPrice: 2800000,
    year: 2018,
    photos: Array(4).fill('https://s3.cdn.lego-car.ru/nuxt/27e0af9e884e40de2760f5e7ccb58a73.jpg?url=https://storage.yandexcloud.net/cars-main/news/d6b18256-14a5-450e-a0a4-9e11babbcf1f.jpg&w=1720&h=1024&m=crop'),
    enginePower: 194,
    engineVolume: 2.0,
    ownerCount: 3,
    retailPrice: 3100000,
    minimalPrice: 2600000,
    bitDate: '2024-04-15',
    additionalInfo: ['Панорамная крыша', 'Подогрев всех сидений', 'Навигация'],
    problemInfo: ['Требуется замена масла', 'Царапина на левой двери']
  }
];

export default function CarsPage() {
  const [cars] = useState<Car[]>(mockCars);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentPhotos, setCurrentPhotos] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const openLightbox = (photos: string[], index: number) => {
    setCurrentPhotos(photos);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Page>
      <div className="pb-[0px]">
        <List>
          {cars.map((car) => (
            <Section key={car.id} className="mb-4">
              <div className="car-card bg-[var(--tg-theme-bg-color)] rounded-lg overflow-hidden">
                {/* Галерея фотографий */}
                <div className="relative">
                  {/* Основное изображение */}
                  <div className="relative w-full h-[150px] md:h-[250px] overflow-hidden">
                    <div className="flex overflow-x-auto snap-x snap-mandatory">
                      {car.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="shrink-0 w-full h-full snap-center cursor-pointer"
                          onClick={() => openLightbox(car.photos, index)}
                        >
                          <Image
                            src={photo}
                            alt={`${car.brand} ${car.model}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {`${car.photos.length} фото`}
                    </div>
                  </div>

                  {/* Миниатюры */}
                  <div className="flex gap-2 mt-2 px-2 overflow-x-auto">
                    {car.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative shrink-0 w-[60px] h-[60px] cursor-pointer rounded-md overflow-hidden"
                        onClick={() => openLightbox(car.photos, index)}
                      >
                        <Image
                          src={photo}
                          alt={`${car.brand} ${car.model} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Информация об автомобиле */}
                <div className="p-3">
                  <h2 className="text-lg font-bold text-[var(--tg-theme-text-color)] mb-3">
                    {`${car.brand} ${car.model}, ${car.year}`}
                  </h2>

                  <div className="grid grid-cols-2 gap-x-16 gap-y-2 mb-4">
                    <div className="space-y-1">
                      <p className="text-[#3390EC] text-sm">Текущая цена</p>
                      <p className="text-[var(--tg-theme-text-color)] font-medium text-lg">
                        {formatPrice(car.currentPrice)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#3390EC] text-sm">Гос. номер</p>
                      <p className="text-[var(--tg-theme-text-color)]">{car.registrationNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#3390EC] text-sm">VIN</p>
                      <p className="text-[var(--tg-theme-text-color)] font-mono">{car.vinNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#3390EC] text-sm">Двигатель</p>
                      <p className="text-[var(--tg-theme-text-color)]">
                        {`${car.engineVolume}л / ${car.enginePower}л.с.`}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#3390EC] text-sm">Владельцев</p>
                      <p className="text-[var(--tg-theme-text-color)]">{car.ownerCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#3390EC] text-sm">Дата торгов</p>
                      <p className="text-[var(--tg-theme-text-color)]">{formatDate(car.bitDate)}</p>
                    </div>
                  </div>

                  {car.additionalInfo.length > 0 && (
                    <div className="mb-3">
                      <h3 className="text-[#3390EC] text-sm mb-1">Дополнительно</h3>
                      <div className="space-y-1">
                        {car.additionalInfo.map((info, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#3390EC]" />
                            <span className="text-[var(--tg-theme-text-color)]">{info}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {car.problemInfo.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-[#3390EC] text-sm mb-1">Нюансы</h3>
                      <div className="space-y-1">
                        {car.problemInfo.map((info, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span className="text-[var(--tg-theme-text-color)]">{info}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)]"
                      onClick={() => {}}
                    >
                      Редактировать
                    </Button>
                    <Button
                      className="flex-1 bg-red-500 text-white"
                      onClick={() => {}}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              </div>
            </Section>
          ))}
        </List>

        {/* Pagination */}
        <div className="flex justify-center">
          <div className="w-full max-w-[600px] px-4 overflow-x-auto">
            <div className="flex justify-center">
              <Pagination
                count={100}
                page={page}
                onChange={handlePageChange}
                boundaryCount={1}
                siblingCount={1}
                disabled={false}
                hideNextButton={false}
                hidePrevButton={false}
                className="flex items-center gap-[1px] min-[360px]:gap-[2px] min-[400px]:gap-[3px] sm:gap-2 md:gap-3 [&>button]:min-w-[32px] [&>button]:h-[32px] sm:[&>button]:min-w-[36px] sm:[&>button]:h-[36px] md:[&>button]:min-w-[40px] md:[&>button]:h-[40px] [&>button]:p-0 [&>button]:text-xs sm:[&>button]:text-sm [&>button]:font-normal [&>button]:transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Lightbox gallery */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={currentPhotos.map(src => ({ src }))}
        plugins={[Zoom, Thumbnails]}
        carousel={{
          finite: true
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true
        }}
        thumbnails={{
          position: "bottom",
          width: 120,
          height: 80
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, .9)" }
        }}
      />
    </Page>
  );
}
