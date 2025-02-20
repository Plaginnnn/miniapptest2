'use client';

import { useState, useEffect } from 'react';
import { Toast } from '@/components/cars/Toast/index';
import { Header } from '@/components/common/Header';
import { Page } from '@/components/Page';
import {
  Section,
  List,
  Input,
  Button,
  FileInput,
  Textarea,
  Select
} from '@telegram-apps/telegram-ui';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useToast } from '@/components/cars/Toast/index';
import {
  TransmissionType,
  TransmissionTypeLabels,
  RestrictionType,
  RestrictionTypeLabels
} from '@/types/car';

interface CarFormData {
  brand: string;
  model: string;
  registrationNumber: string;
  vinNumber: string;
  transmissionType: TransmissionType;
  restrictionType: RestrictionType | '';
  currentPrice: string;
  year: string;
  photos: File[];
  documents: File[];
  enginePower: string;
  engineVolume: string;
  ownerCount: string;
  retailPrice: string;
  minimalPrice: string;
  bitDate: string;
  additionalInfo: string[];
  problemInfo: string[];
}

const initialFormData: CarFormData = {
  brand: 'BMW',
  model: 'X5',
  registrationNumber: 'А123ВС777',
  vinNumber: 'WBAKV210200V12345',
  transmissionType: TransmissionType.AUTOMATIC,
  restrictionType: RestrictionType.NONE,
  currentPrice: '2500000',
  year: '2018',
  photos: [],
  documents: [],
  enginePower: '249',
  engineVolume: '3.0',
  ownerCount: '2',
  retailPrice: '3000000',
  minimalPrice: '2300000',
  bitDate: '01.12.2024',
  additionalInfo: [
    'Полный комплект ключей',
    'Сервисная книжка',
    'Зимняя резина в комплекте'
  ],
  problemInfo: [
    'Небольшая царапина на заднем бампере',
    'Требуется замена масла'
  ],
};

const restrictionOptions = [
  { value: 'none', label: 'Без ограничений' },
  { value: 'limited', label: 'Ограниченный' },
  { value: 'full', label: 'Полный' }
];

const transmissionOptions = Object.entries(TransmissionTypeLabels).map(([value, label]) => ({
  value,
  label
}));

const FormField = ({ children, error, label, className }: { children: React.ReactNode; error?: string; label?: string; className?: string }) => (
  <div className={`relative ${error ? 'mb-6' : 'mb-3'} ${className || ''}`}>
    {label && (
      <div className="text-sm font-medium text-[#3390EC] mb-1 px-1">
        {label}
      </div>
    )}
    {children}
    <div className={`absolute -bottom-5 text-[13px] transition-all duration-200 ${
      error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
    }`}>
      {error && (
        <div className="text-[#E53935] px-1">
          {error}
        </div>
      )}
    </div>
  </div>
);

const formatDate = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(4, 8)}`;
};

// Добавим тип для ошибок, включая поле submit
interface FormErrors extends Partial<Record<keyof CarFormData, string>> {
  submit?: string;
}

export default function CreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CarFormData>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('carFormData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return {
          ...parsedData,
          photos: [],
          documents: []
        };
      }
    }
    return initialFormData;
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { showToast, hideToast, isVisible, message, type } = useToast();

  useEffect(() => {
    const dataToSave = {
      ...formData,
      photos: [],
      documents: []
    };
    localStorage.setItem('carFormData', JSON.stringify(dataToSave));
  }, [formData]);

  const clearForm = () => {
    setFormData(initialFormData);
    localStorage.removeItem('carFormData');
  };

  const validateField = (name: keyof CarFormData, value: string): string | undefined => {
    switch (name) {
      case 'brand':
        return !value ? 'Укажите марку автомобиля' : undefined;
      case 'model':
        return !value ? 'Укажите модель автомобиля' : undefined;
      case 'registrationNumber':
        return !value.match(/^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/) ? 'Неверный формат. Используйте только русские буквы' : undefined;
      case 'vinNumber':
        return !value.match(/^[A-HJ-NPR-Z0-9]{17}$/) ? 'VIN должен содержать 17 символов' : undefined;
      case 'year':
        const yearNum = parseInt(value);
        const currentYear = new Date().getFullYear();
        return !yearNum || yearNum < 1900 || yearNum > currentYear ? `Год должен быть между 1900 и ${currentYear}` : undefined;
      case 'currentPrice':
        const price = parseFloat(value);
        return !price || price <= 0 ? 'Укажите корректную цену' : undefined;
      case 'enginePower':
        const power = parseInt(value);
        return !power || power < 0 ? 'Укажите корректную мощность двигателя' : undefined;
      case 'engineVolume':
        const volume = parseFloat(value);
        if (!volume || volume <= 0) {
          return 'Укажите корректный объем двигателя';
        }
        // Добавляем проверку на максимальное значение
        if (volume >= 100) {
          return 'Объем двигателя должен быть меньше 100 литров';
        }
        // Проверяем количество знаков после запятой
        if (value.includes('.') && value.split('.')[1].length > 1) {
          return 'Укажите не более одного знака после запятой';
        }
        return undefined;
      case 'ownerCount':
        const owners = parseInt(value);
        return !owners || owners < 0 ? 'Должно быть больше или равно 0' : undefined;
      case 'retailPrice':
        const retail = parseInt(value);
        return !retail || retail <= 0 ? 'Укажите корректную розничную цену' : undefined;
      case 'minimalPrice':
        const minimal = parseInt(value);
        return !minimal || minimal <= 0 ? 'Укажите корректную минимальную цену' : undefined;
      case 'bitDate':
        const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
        if (!value) return 'Укажите дату выкупа';
        if (!dateRegex.test(value)) return 'Неверный формат даты';
        const [, day, month, year] = value.match(dateRegex) || [];
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        const isValid = date.getDate() === Number(day) &&
                       date.getMonth() === Number(month) - 1 &&
                       date.getFullYear() === Number(year);
        return isValid ? undefined : 'Некорректная дата';
      case 'transmissionType':
        return value === TransmissionType.NONE ? 'Выберите тип трансмиссии' : undefined;
      case 'restrictionType':
        return value === RestrictionType.NONE ? 'Выберите тип ограничения' : undefined;
      default:
        return undefined;
    }
  };

  const handleInputChange = (name: keyof CarFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Если есть ошибка, проверяем, не исправлена ли она
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (name: keyof CarFormData) => {
    if (typeof formData[name] === 'string') {
      const error = validateField(name, formData[name] as string);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.brand) {
      newErrors.brand = 'Укажите марку автомобиля';
    }

    if (!formData.model) {
      newErrors.model = 'Укажите модель автомобиля';
    }

    // Гос. номер формата A123BB777
    if (!formData.registrationNumber.match(/^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/)) {
      newErrors.registrationNumber = 'Неверный формат';
    }

    // VIN validation
    if (!formData.vinNumber.match(/^[A-HJ-NPR-Z0-9]{17}$/)) {
      newErrors.vinNumber = 'VIN должен содержать 17 символов';
    }

    // Year validation
    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.year);
    if (!year || year < 1900 || year > currentYear) {
      newErrors.year = `Год должен быть между 1900 и ${currentYear}`;
    }

    // Price validation
    const price = parseFloat(formData.currentPrice);
    if (!price || price <= 0) {
      newErrors.currentPrice = 'Укажите корректную цену';
    }

    // Photos validation
    if (formData.photos.length > 10) {
      newErrors.photos = 'Максимум 10 фотографий';
    }

    // Documents validation
    if (formData.documents.length > 5) {
      newErrors.documents = 'Максимум 5 документов';
    }

    // Add missing validations
    const enginePower = parseInt(formData.enginePower);
    if (!enginePower || enginePower < 0) {
      newErrors.enginePower = 'Укажите корректную мощность двигателя';
    }

    const engineVolume = parseFloat(formData.engineVolume);
    if (!engineVolume || engineVolume <= 0) {
      newErrors.engineVolume = 'Укажите корректный объем двигателя';
    }

    const owners = parseInt(formData.ownerCount);
    if (!owners || owners < 0) {
      newErrors.ownerCount = 'Должно быть больше или равно 0';
    }

    const retail = parseInt(formData.retailPrice);
    if (!retail || retail <= 0) {
      newErrors.retailPrice = 'Укажите корректную розничную цену';
    }

    const minimal = parseInt(formData.minimalPrice);
    if (!minimal || minimal <= 0) {
      newErrors.minimalPrice = 'Укажите корректную минимальную цену';
    }

    // Validate bit date
    const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    if (!formData.bitDate) {
      newErrors.bitDate = 'Укажите дату выкупа';
    } else if (!dateRegex.test(formData.bitDate)) {
      newErrors.bitDate = 'Неверный формат даты';
    } else {
      const [, day, month, year] = formData.bitDate.match(dateRegex) || [];
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      const isValid = date.getDate() === Number(day) &&
                     date.getMonth() === Number(month) - 1 &&
                     date.getFullYear() === Number(year);
      if (!isValid) {
        newErrors.bitDate = 'Некорректная дата';
      }
    }

    if (formData.transmissionType === TransmissionType.NONE) {
      newErrors.transmissionType = 'Выберите тип трансмиссии';
    }

    if (formData.restrictionType === RestrictionType.NONE) {
      newErrors.restrictionType = 'Выберите тип ограничения';
    }

    // Добавляем проверку на обязательное наличие фотографий
    if (formData.photos.length === 0) {
      newErrors.photos = 'Добавьте хотя бы одну фотографию';
    }

    // Проверка наличия документов
    if (formData.documents.length === 0) {
      newErrors.documents = 'Добавьте хотя бы один документ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const formDataToSend = new FormData();

        const carData = {
          accidentCount: 0,
          enginePower: parseInt(formData.enginePower),
          vinNumber: formData.vinNumber,
          licencePlate: formData.registrationNumber,
          restrictionType: formData.restrictionType,
          retailPrice: parseInt(formData.retailPrice),
          brand: formData.brand,
          minimalPrice: parseInt(formData.minimalPrice),
          model: formData.model,
          problemInfo: formData.problemInfo.filter(info => info.trim() !== ''),
          hasNdc: false,
          additionalInfo: formData.additionalInfo.filter(info => info.trim() !== ''),
          productionYear: parseInt(formData.year),
          actualPrice: parseInt(formData.currentPrice),
          bitDate: formData.bitDate.split('.').reverse().join('-'),
          ownerCount: parseInt(formData.ownerCount),
          engineVolume: parseFloat(formData.engineVolume),
          transmissionType: formData.transmissionType
        };

        formDataToSend.append('car', new Blob([JSON.stringify(carData)], {
          type: 'application/json'
        }));

        // Проверяем и добавляем фотографии
        if (formData.photos.length === 0) {
          throw new Error('Добавьте хотя бы одну фотографию');
        }

        // Добавляем каждую фотографию отдельно с оригинальным именем и типом
        formData.photos.forEach((photo) => {
          // Генерируем уникальное имя файла, сохраняя оригинальное расширение
          const originalExt = photo.name.split('.').pop() || 'jpg';
          const uniqueFileName = `photo_${Date.now()}_${Math.random().toString(36).substring(7)}.${originalExt}`;

          // Создаем новый Blob с правильным типом контента
          const photoBlob = new Blob([photo], { type: photo.type });

          // Добавляем файл с уникальным именем и правильным типом
          formDataToSend.append('photos', photoBlob, uniqueFileName);
        });

        // Добавляем документы
        formData.documents.forEach((document) => {
          const originalExt = document.name.split('.').pop() || 'pdf';
          const uniqueFileName = `doc_${Date.now()}_${Math.random().toString(36).substring(7)}.${originalExt}`;

          const docBlob = new Blob([document], { type: document.type });
          formDataToSend.append('documents', docBlob, uniqueFileName);
        });

        const response = await axios.post(
          'https://admin-bot-develop.revup.trio-tech.online/api/cars',
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': 'application/json',
            },
            // Добавляем настройки для корректной отправки больших файлов
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );

        if (response.status === 201) {
          showToast('Автомобиль успешно добавлен', 'success');
          await new Promise(resolve => setTimeout(resolve, 500));
          clearForm();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

      } catch (error) {
        console.error('Submit error:', error);
        if (error instanceof Error) {
          showToast(error.message, 'error');
        } else {
          showToast('Произошла неизвестная ошибка при отправке формы', 'error');
        }
      }
    }
  };

  const handleCancel = () => {
    clearForm();
    router.back();
  };

  return (
    <Page>
      <Header />
      <List className="mt-[30px] px-0">
        <Section header="Добавление нового автомобиля" className="px-0 mb-2">
          <div className="px-3">
            <FormField error={errors.brand} label="Марка" className="mx-2">
              <Input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                onBlur={() => handleBlur('brand')}
                required
                status={errors.brand ? 'error' : 'default'}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.brand
                    ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                `}
                placeholder="Введите марку автомобиля"
              />
            </FormField>

            <FormField error={errors.model} label="Модель" className="mx-2">
              <Input
                type="text"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                onBlur={() => handleBlur('model')}
                required
                status={errors.model ? 'error' : 'default'}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.model
                    ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                `}
                placeholder="Введите модель автомобиля"
              />
            </FormField>

            <FormField error={errors.registrationNumber} label="Гос. номер" className="mx-2">
              <Input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value.toUpperCase())}
                onBlur={() => handleBlur('registrationNumber')}
                required
                status={errors.registrationNumber ? 'error' : 'default'}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.registrationNumber
                    ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                `}
                placeholder="Введите государственный номер"
              />
            </FormField>

            <FormField error={errors.vinNumber} label="VIN номер" className="mx-2">
              <Input
                type="text"
                value={formData.vinNumber}
                onChange={(e) => handleInputChange('vinNumber', e.target.value.toUpperCase())}
                onBlur={() => handleBlur('vinNumber')}
                required
                status={errors.vinNumber ? 'error' : 'default'}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.vinNumber
                    ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                `}
                placeholder="Введите VIN номер"
              />
            </FormField>

            <FormField error={errors.transmissionType} label="Тип трансмиссии" className="mx-2">
              <Select
                value={formData.transmissionType}
                onChange={(e) => {
                  setFormData({ ...formData, transmissionType: e.target.value as TransmissionType });
                  handleInputChange('transmissionType', e.target.value);
                }}
                onBlur={() => handleBlur('transmissionType')}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.transmissionType
                    ? 'border-[#E53935] border-[3px] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                  h-[52px]
                  pl-1
                `}
              >
                <option value="">Выберите тип трансмиссии</option>
                {Object.entries(TransmissionTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </FormField>

            <FormField error={errors.restrictionType} label="Тип ограничения" className="mx-2">
              <Select
                value={formData.restrictionType}
                onChange={(e) => {
                  setFormData({ ...formData, restrictionType: e.target.value as RestrictionType });
                  handleInputChange('restrictionType', e.target.value);
                }}
                onBlur={() => handleBlur('restrictionType')}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.restrictionType
                    ? 'border-[#E53935] border-[3px] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                  h-[52px]
                  pl-1
                `}
              >
                <option value="">Выберите тип ограничения</option>
                {Object.entries(RestrictionTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </FormField>

            <FormField error={errors.currentPrice} label="Текущая цена" className="mx-2">
              <Input
                type="number"
                value={formData.currentPrice}
                onChange={(e) => handleInputChange('currentPrice', e.target.value)}
                onBlur={() => handleBlur('currentPrice')}
                required
                status={errors.currentPrice ? 'error' : 'default'}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.currentPrice
                    ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                `}
                placeholder="Введите текущую цену"
              />
            </FormField>

            <FormField error={errors.year} label="Год производства" className="mx-2">
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                onBlur={() => handleBlur('year')}
                required
                status={errors.year ? 'error' : 'default'}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.year
                    ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                `}
                placeholder="Введите год производства"
              />
            </FormField>

            <FormField error={errors.enginePower} label="Мощность двигателя (л.с.)" className="mx-2">
              <Input
                type="number"
                value={formData.enginePower}
                onChange={(e) => handleInputChange('enginePower', e.target.value)}
                onBlur={() => handleBlur('enginePower')}
                required
                status={errors.enginePower ? 'error' : 'default'}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.enginePower
                    ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                `}
                placeholder="Введите мощность двигателя"
              />
            </FormField>

            <FormField error={errors.engineVolume} label="Объем двигателя (л)" className="mx-2">
              <Input
                type="number"
                step="0.1"
                min="0"
                max="99.9"
                value={formData.engineVolume}
                onChange={(e) => {
                  const value = e.target.value;
                  // Ограничиваем ввод до одного знака после запятой
                  const formatted = value.includes('.')
                    ? value.split('.')[0] + '.' + value.split('.')[1].slice(0, 1)
                    : value;
                  handleInputChange('engineVolume', formatted);
                }}
                onBlur={() => handleBlur('engineVolume')}
                required
                status={errors.engineVolume ? 'error' : 'default'}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.engineVolume
                    ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                `}

              />
            </FormField>

            <FormField error={errors.ownerCount} label="Количество владельцев" className="mx-2">
              <Input
                type="number"
                value={formData.ownerCount}
                onChange={(e) => handleInputChange('ownerCount', e.target.value)}
                onBlur={() => handleBlur('ownerCount')}
                required
                status={errors.ownerCount ? 'error' : 'default'}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.ownerCount
                    ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                `}
                placeholder="Введите количество владельцев"
              />
            </FormField>

            <FormField error={errors.retailPrice} label="Средняя цена по рынку" className="mx-2">
              <Input
                type="number"
                value={formData.retailPrice}
                onChange={(e) => handleInputChange('retailPrice', e.target.value)}
                onBlur={() => handleBlur('retailPrice')}
                required
                status={errors.retailPrice ? 'error' : 'default'}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.retailPrice
                    ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                `}
                placeholder="Введите среднюю цену по рынку"
              />
            </FormField>

            <FormField error={errors.minimalPrice} label="Минимальная цена" className="mx-2">
              <Input
                type="number"
                value={formData.minimalPrice}
                onChange={(e) => handleInputChange('minimalPrice', e.target.value)}
                onBlur={() => handleBlur('minimalPrice')}
                required
                status={errors.minimalPrice ? 'error' : 'default'}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.minimalPrice
                    ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                `}
                placeholder="Введите минимальную цену"
              />
            </FormField>

            <FormField error={errors.bitDate} label="Дата выкупа (ДД.ММ.ГГГГ)" className="mx-2">
              <Input
                type="text"
                value={formData.bitDate}
                onChange={(e) => {
                  const formatted = formatDate(e.target.value);
                  if (formatted.length <= 10) {
                    handleInputChange('bitDate', formatted);
                  }
                }}
                onBlur={() => handleBlur('bitDate')}
                required
                status={errors.bitDate ? 'error' : 'default'}
                className={`w-full px-4 py-3.5 border-2 rounded-2xl outline-none transition-all duration-200
                  ${errors.bitDate
                    ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                    : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                  }
                  focus:bg-[var(--tg-theme-bg-color)]
                  text-[var(--tg-theme-text-color)]
                  placeholder-[var(--tg-theme-hint-color)]
                  text-[15px]
                `}
                placeholder="Введите дату выкупа"
              />
            </FormField>
          </div>
        </Section>

        <Section header={
          <div className="flex justify-between items-center w-full px-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#3390EC] mb-2">Фотографии автомобиля</span>
              <span className="text-[13px] text-gray-500">
                Поддерживаются JPEG, PNG, WebP, GIF. Максимум 10 фото по 10MB каждое
              </span>
            </div>
            <span className="text-sm text-gray-500">{formData.photos.length}/10</span>
          </div>
        } className="px-0">
          <div className="px-3">
            <FormField error={errors.photos}>
              <div className="min-h-[100px] flex flex-col items-center" style={{ paddingTop: '20px' }}>
                {formData.photos.length > 0 && (
                  <div className="mb-4 grid grid-cols-4 gap-2 w-full">
                    {Array.from(formData.photos).map((file, index) => (
                      <div key={index} className="relative aspect-square w-[120px] h-[120px]">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Photo ${index + 1}`}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover rounded"
                          style={{ objectFit: 'cover' }}
                          unoptimized
                        />
                        <button
                          onClick={() => {
                            const newPhotos = Array.from(formData.photos);
                            newPhotos.splice(index, 1);
                            setFormData({ ...formData, photos: newPhotos });
                            setErrors({
                              ...errors,
                              photos: newPhotos.length >= 10 ? 'Достигнут лимит в 10 фотографий' : undefined
                            });
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {formData.photos.length < 10 && (
                  <div className="mb-6">
                    <FileInput
                      accept="image/*"
                      multiple
                      label="Выбрать фото"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const imageFiles = files.filter(file => {
                          // Проверяем, что файл действительно изображение
                          const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
                          return validTypes.includes(file.type);
                        });

                        if (imageFiles.length !== files.length) {
                          setErrors({
                            ...errors,
                            photos: 'Допустимы только файлы изображений (JPEG, PNG, WebP, GIF)'
                          });
                          return;
                        }

                        if (imageFiles.length + formData.photos.length > 10) {
                          setErrors({
                            ...errors,
                            photos: 'Достигнут лимит в 10 фотографий'
                          });
                          return;
                        }

                        // Проверяем размер каждого файла (максимум 10MB)
                        const oversizedFiles = imageFiles.filter(file => file.size > 10 * 1024 * 1024);
                        if (oversizedFiles.length > 0) {
                          setErrors({
                            ...errors,
                            photos: 'Размер каждого файла не должен превышать 10MB'
                          });
                          return;
                        }

                        setFormData({ ...formData, photos: [...formData.photos, ...imageFiles] });
                        if (errors.photos && formData.photos.length + imageFiles.length > 0) {
                          setErrors({ ...errors, photos: undefined });
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </FormField>
          </div>
        </Section>

        <Section header={
          <div className="flex justify-between items-center w-full px-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#3390EC] mb-2">Документы</span>
              <span className="text-[13px] text-gray-500">PDF, DOC или DOCX, максимум 5 файлов</span>
            </div>
            <span className="text-sm text-gray-500">{formData.documents.length}/5</span>
          </div>
        } className="px-0">
          <div className="px-3">
            <FormField error={errors.documents}>
              <div className="min-h-[100px] flex flex-col items-center" style={{ paddingTop: '20px' }}>
                {formData.documents.length > 0 && (
                  <div className="mb-4 space-y-2 w-full">
                    {Array.from(formData.documents).map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded border border-[#3390EC]/30">
                        <span className="text-sm truncate text-[var(--tg-theme-text-color)]">{file.name}</span>
                        <button
                          onClick={() => {
                            const newDocs = Array.from(formData.documents);
                            newDocs.splice(index, 1);
                            setFormData({ ...formData, documents: newDocs });
                            setErrors({
                              ...errors,
                              documents: newDocs.length >= 5 ? 'Достигнут лимит в 5 документов' : undefined
                            });
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          Удалить
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {formData.documents.length < 5 && (
                  <div className="mb-6">
                    <FileInput
                      accept="application/pdf"
                      multiple
                      label="Выбрать документ"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const docFiles = files.filter(file => file.type === 'application/pdf');
                        if (docFiles.length + formData.documents.length > 5) {
                          setErrors({
                            ...errors,
                            documents: 'Достигнут лимит в 5 документов'
                          });
                          return;
                        }
                        setFormData({ ...formData, documents: [...formData.documents, ...docFiles] });
                        // Очищаем ошибку, если документы были добавлены
                        if (errors.documents && formData.documents.length + docFiles.length > 0) {
                          setErrors({ ...errors, documents: undefined });
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </FormField>
          </div>
        </Section>

        <Section header="Дополнительная информация" className="px-0 bg-transparent">
          <div className="px-3">
            <div className="space-y-2">
              {formData.additionalInfo.map((info, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <div className="text-sm text-[#3390EC] mb-1 px-2">{`Пункт ${index + 1}`}</div>
                    <div className="flex gap-2">
                      <textarea
                        value={info}
                        onChange={(e) => {
                          const newInfo = [...formData.additionalInfo];
                          newInfo[index] = e.target.value;
                          setFormData({ ...formData, additionalInfo: newInfo });
                        }}
                        className={`w-full min-h-[80px] px-4 py-3.5 border-2 rounded-2xl resize-none outline-none transition-all duration-200
                          ${errors.additionalInfo
                            ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                            : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                          }
                          focus:bg-[var(--tg-theme-bg-color)]
                          text-[var(--tg-theme-text-color)]
                          placeholder-[var(--tg-theme-hint-color)]
                          text-[15px]
                        `}
                      />
                      <Button
                        onClick={() => {
                          const newInfo = [...formData.additionalInfo];
                          newInfo.splice(index, 1);
                          setFormData({ ...formData, additionalInfo: newInfo });
                        }}
                        className="bg-red-500 text-white w-[32px] h-[80px] flex items-center justify-center"
                      >
                        <FaTrash size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {formData.additionalInfo.length < 10 && (
                <Button
                  onClick={() => {
                    if (formData.additionalInfo.length < 10) {
                      setFormData({
                        ...formData,
                        additionalInfo: [...formData.additionalInfo, '']
                      });
                    }
                  }}
                  className="w-full px-4 py-3.5 rounded-2xl transition-all duration-200 bg-[var(--tg-theme-bg-color)] text-[#3390EC] font-medium text-[15px] text-center border border-[#3390EC] flex items-center justify-center gap-2 group"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 transition-transform group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Добавить информацию</span>
                  </div>
                </Button>
              )}
              {formData.additionalInfo.length >= 10 && (
                <div className="text-sm text-red-500">
                  Достигнут лимит в 10 пунктов
                </div>
              )}
            </div>
          </div>
        </Section>

        <Section header="Нюансы и возможные проблемы" className="px-0 bg-transparent">
          <div className="px-3">
            <div className="space-y-2">
              {formData.problemInfo.map((info, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <div className="text-sm text-[#3390EC] mb-1 px-2">{`Пункт ${index + 1}`}</div>
                    <div className="flex gap-2">
                      <textarea
                        value={info}
                        onChange={(e) => {
                          const newInfo = [...formData.problemInfo];
                          newInfo[index] = e.target.value;
                          setFormData({ ...formData, problemInfo: newInfo });
                        }}
                        className={`w-full min-h-[80px] px-4 py-3.5 border-2 rounded-2xl resize-none outline-none transition-all duration-200
                          ${errors.problemInfo
                            ? 'border-[#E53935] focus:border-[#E53935] bg-[#E53935]/5'
                            : 'border-[#3390EC]/30 focus:border-[#3390EC] bg-[var(--tg-theme-secondary-bg-color)]'
                          }
                          focus:bg-[var(--tg-theme-bg-color)]
                          text-[var(--tg-theme-text-color)]
                          placeholder-[var(--tg-theme-hint-color)]
                          text-[15px]
                        `}
                      />
                      <Button
                        onClick={() => {
                          const newInfo = [...formData.problemInfo];
                          newInfo.splice(index, 1);
                          setFormData({ ...formData, problemInfo: newInfo });
                        }}
                        className="bg-red-500 text-white w-[32px] h-[80px] flex items-center justify-center"
                      >
                        <FaTrash size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {formData.problemInfo.length < 10 && (
                <Button
                  onClick={() => {
                    if (formData.problemInfo.length < 10) {
                      setFormData({
                        ...formData,
                        problemInfo: [...formData.problemInfo, '']
                      });
                    }
                  }}
                  className="w-full px-4 py-3.5 rounded-2xl transition-all duration-200 bg-[var(--tg-theme-bg-color)] text-[#3390EC] font-medium text-[15px] text-center border border-[#3390EC] flex items-center justify-center gap-2 group"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 transition-transform group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-[#3390EC]">Добавить нюанс</span>
                  </div>
                </Button>
              )}
              {formData.problemInfo.length >= 10 && (
                <div className="text-sm text-red-500">
                  Достигнут лимит в 10 пунктов
                </div>
              )}
            </div>
          </div>
        </Section>

        {errors.submit && (
          <div className="mx-3 px-4 py-3 mb-4 bg-red-50 text-red-500 text-sm rounded-lg">
            {errors.submit}
          </div>
        )}

        <div className="flex gap-2.5 mt-5 mx-3 pb-4">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-[#3390EC] hover:bg-[#3390EC]/90 text-white font-medium"
          >
            Сохранить
          </Button>
          <Button
            onClick={handleCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium"
            type="secondary"
          >
            Отмена
          </Button>
        </div>
      </List>

      <Toast
        message={message}
        type={type}
        isVisible={isVisible}
        onClose={hideToast}
      />
    </Page>
  );
}
