import { SegmentedControl } from '@telegram-apps/telegram-ui';
import { FC } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MdRemoveRedEye, MdAdd, MdEventAvailable } from 'react-icons/md';

export const Header: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--tg-theme-bg-color)]">
      {/* Navigation */}
      <div className="w-full bg-[var(--tg-theme-bg-color)]">
        <SegmentedControl
          className="h-12 [&>*]:transition-all [&>*]:duration-300 [&>*]:ease-in-out bg-[var(--tg-theme-bg-color)]"
          style={{
            '--tg-segment-control-bg': 'var(--tg-theme-bg-color)',
            '--tg-segment-control-active-bg': 'var(--tg-theme-secondary-bg-color)'
          } as React.CSSProperties}
        >
          <SegmentedControl.Item
            selected={pathname === '/cars'}
            onClick={() => router.push('/cars')}
            className="transition-transform duration-300 ease-in-out bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)]"
          >
            <div className="flex items-center justify-center gap-1">
              <div className="flex-shrink-0 transition-transform duration-300 ease-in-out">
                <MdRemoveRedEye className="w-5 h-5" />
              </div>
              <span className="text-[13px] sm:text-[15px] transition-opacity duration-300">Просмотр</span>
            </div>
          </SegmentedControl.Item>

          <SegmentedControl.Item
            selected={pathname === '/booking'}
            onClick={() => router.push('/booking')}
            className="transition-transform duration-300 ease-in-out bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)]"
          >
            <div className="flex items-center justify-center gap-1">
              <div className="flex-shrink-0 transition-transform duration-300 ease-in-out">
                <MdEventAvailable className="w-5 h-5" />
              </div>
              <span className="text-[13px] sm:text-[15px] transition-opacity duration-300">Бронирование</span>
            </div>
          </SegmentedControl.Item>

          <SegmentedControl.Item
            selected={pathname === '/create'}
            onClick={() => router.push('/create')}
            className="transition-transform duration-300 ease-in-out bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)]"
          >
            <div className="flex items-center justify-center gap-1">
              <div className="flex-shrink-0 transition-transform duration-300 ease-in-out">
                <MdAdd className="w-5 h-5" />
              </div>
              <span className="text-[13px] sm:text-[15px] transition-opacity duration-300">Создание</span>
            </div>
          </SegmentedControl.Item>
        </SegmentedControl>
      </div>
    </div>
  );
};
