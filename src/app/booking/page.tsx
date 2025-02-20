'use client';

import { useState } from 'react';
import { Header } from '@/components/common/Header';
import { Page } from '@/components/Page';
import {
  Section,
  List,
  Input,
  Button
} from '@telegram-apps/telegram-ui';
import { useRouter } from 'next/navigation';

interface BookingFormData {
  carId: string;
  userId: string;
}

const initialFormData: BookingFormData = {
  carId: '',
  userId: ''
};

export default function BookingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);

  const handleSubmit = () => {
    if (formData.carId && formData.userId) {
      console.log('Form submitted:', formData);
    }
  };

  const handleCancel = () => {
    if (formData.carId && formData.userId) {
      console.log('Booking cancelled:', formData);
    }
  };

  return (
    <Page>
      <Header />
      <List className="mt-[50px]">
        <Section header="Бронирование автомобиля">
          <div className="min-h-[100px] flex flex-col items-center" style={{ paddingTop: '20px' }}>
            <div className="flex flex-col items-center mb-6 text-center">
              <p className="text-[13px] text-gray-600 dark:text-gray-400">
                Введите ID автомобиля и пользователя для бронирования
              </p>
            </div>

            <div className="space-y-4 w-full px-4">
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-[15px] font-medium text-[#3390EC]">ID автомобиля</div>
                  {formData.carId && (
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, carId: '' }))}
                      className="text-[13px] text-gray-400 hover:text-gray-600"
                    >
                      Очистить
                    </button>
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="Введите ID автомобиля"
                  value={formData.carId}
                  onChange={(e) => setFormData(prev => ({ ...prev, carId: e.target.value }))}
                />
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-[15px] font-medium text-[#3390EC]">ID пользователя</div>
                  {formData.userId && (
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, userId: '' }))}
                      className="text-[13px] text-gray-400 hover:text-gray-600"
                    >
                      Очистить
                    </button>
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="Введите ID пользователя"
                  value={formData.userId}
                  onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex flex-row gap-3 mt-6 w-full px-4">
              <Button
                onClick={handleSubmit}
                disabled={!formData.carId || !formData.userId}
                className="w-full bg-[#3390EC] hover:bg-[#3390EC]/90 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Забронировать
              </Button>
              <Button
                onClick={handleCancel}
                disabled={!formData.carId || !formData.userId}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Отменить бронь
              </Button>
            </div>
          </div>
        </Section>
      </List>
    </Page>
  );
}
