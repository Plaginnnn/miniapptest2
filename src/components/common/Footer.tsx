'use client';

import { TabsList } from '@telegram-apps/telegram-ui';
import { usePathname, useRouter } from 'next/navigation';
import { FaCalendarAlt, FaCar, FaPlus } from 'react-icons/fa';

const navigation = [
  { label: 'Авто', path: '/cars', icon: FaCar },
  { label: 'Бронь', path: '/booking', icon: FaCalendarAlt },
  { label: 'Создать', path: '/create', icon: FaPlus }
];

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[var(--tg-theme-bg-color)] z-50">
      <TabsList className="max-w-screen-md mx-auto grid grid-cols-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <TabsList.Item
              key={item.path}
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center justify-center h-[52px]"
            >
              <div className="flex flex-col items-center gap-[2px]">
                <Icon className="text-lg mb-[2px]" />
                <span className="text-[10px] leading-none text-center">
                  {item.label}
                </span>
              </div>
            </TabsList.Item>
          );
        })}
      </TabsList>
    </footer>
  );
}
