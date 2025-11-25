'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface WeeklyMenu {
  id: string;
  day_of_week: number;
  menu_name: string;
  category?: string;
  price?: number;
  image_url?: string;
  week_start_date: string;
}

interface Store {
  id: string;
  store_id: string;
  name: string;
  profile_image_url?: string;
  menu_categories?: string[];
  business_days?: number[];
}

const DAYS_OF_WEEK = [
  { value: 0, label: '日', full: '日曜日', short: 'SUN' },
  { value: 1, label: '月', full: '月曜日', short: 'MON' },
  { value: 2, label: '火', full: '火曜日', short: 'TUE' },
  { value: 3, label: '水', full: '水曜日', short: 'WED' },
  { value: 4, label: '木', full: '木曜日', short: 'THU' },
  { value: 5, label: '金', full: '金曜日', short: 'FRI' },
  { value: 6, label: '土', full: '土曜日', short: 'SAT' },
];

const DEFAULT_BUSINESS_DAYS = [1, 2, 3, 4, 5];
const DEFAULT_CATEGORIES = [
  'LUNCH|ランチ',
  'BOWL / NOODLES|丼・麺',
  'SIDE DISH|小鉢',
  'DESSERT / SALAD|デザート / サラダ',
];

function getWeekStartDate(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}

export default function WeeklyMenuPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const [menus, setMenus] = useState<WeeklyMenu[]>([]);
  const [store, setStore] = useState<Store | null>(null);
  const [weekStartDate, setWeekStartDate] = useState(getWeekStartDate(new Date()));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menusRes, storeRes] = await Promise.all([
          api.get(`/weekly-menus/by-store/${storeId}?week_start_date=${weekStartDate}`),
          api.get(`/stores/${storeId}`),
        ]);
        setMenus(menusRes.data);
        setStore(storeRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        router.push('/user/access');
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchData();
    }
  }, [storeId, weekStartDate, router]);

  if (loading) {
    return (
      <div className="min-h-screen theme-menu particle-bg-menu flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-user-primary mb-4 shadow-lg">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-[#8B7355] font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  const categoryList = store?.menu_categories?.length ? store.menu_categories : DEFAULT_CATEGORIES;
  const daySelections = (store?.business_days?.length ? [...store.business_days] : [...DEFAULT_BUSINESS_DAYS]).sort(
    (a, b) => a - b
  );

  const getDayMeta = (value: number) => DAYS_OF_WEEK.find((d) => d.value === value) || { value, label: '', full: '', short: '' };

  const getDateForDay = (dayValue: number) => {
    const base = new Date(weekStartDate);
    const diff = ((dayValue - 1 + 7) % 7);
    const date = new Date(base);
    date.setDate(base.getDate() + diff);
    return date;
  };

  const formatDateLabel = (date: Date) => {
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    return `${month}.${day}`;
  };

  const normalizeCategory = (label: string) => label.split('|')[0].trim().toLowerCase();

  const findMenuForCell = (dayValue: number, categoryLabel: string) => {
    const key = normalizeCategory(categoryLabel);
    return menus.find(
      (menu) =>
        menu.day_of_week === dayValue &&
        (normalizeCategory(menu.category || '') === key)
    );
  };

  return (
    <div className="min-h-screen theme-menu particle-bg-menu pb-20">
      {/* 店舗プロフィールヘッダー */}
      {store && (
        <div className="glass-menu border-b border-white/20 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center space-x-4">
              {store.profile_image_url ? (
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-white/50">
                  <img
                    src={store.profile_image_url}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-user-primary flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🏪</span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-xl font-bold gradient-text gradient-text-menu">{store.name}</h1>
                <p className="text-sm text-[#8B7355]">@{store.store_id}</p>
              </div>
            </div>
          </div>
          
          {/* 週選択 */}
          <div className="px-4 pb-4">
            <input
              type="date"
              value={weekStartDate}
              onChange={(e) => setWeekStartDate(e.target.value)}
              className="restaurant-input restaurant-input-menu w-full px-4 py-2 rounded-xl"
            />
          </div>
        </div>
      )}

      {/* 週間メニュー表 */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white/90 rounded-3xl shadow-xl p-4 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="w-48 p-4 text-left text-sm font-semibold text-[#8B7355] uppercase tracking-wide">
                  WEEKLY MENU
                </th>
                {daySelections.map((day) => {
                  const meta = getDayMeta(day);
                  const date = formatDateLabel(getDateForDay(day));
                  return (
                    <th key={day} className="p-4 text-center border-l border-[#f0dcd0]">
                      <div className="text-xs font-semibold text-[#8B7355] uppercase">{meta.short}</div>
                      <div className="text-sm text-[#8B7355]">{meta.label} {date}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {categoryList.map((category) => {
                const [primary, secondary] = category.split('|').map((part) => part?.trim());
                return (
                  <tr key={category}>
                    <td className="align-top p-4 border-t border-[#f0dcd0] bg-[#FFF4EA]">
                      <div className="text-base font-bold text-[#4E2A10] uppercase">{primary}</div>
                      {secondary && <div className="text-xs text-[#8B7355]">{secondary}</div>}
                    </td>
                    {daySelections.map((day) => {
                      const menu = findMenuForCell(day, category);
                      return (
                        <td key={`${category}-${day}`} className="align-top p-4 border-t border-l border-[#f0dcd0] bg-white/90">
                          {menu ? (
                            <div>
                              <p className="text-sm font-semibold text-[#2C1810] leading-snug">{menu.menu_name}</p>
                              {menu.price && (
                                <p className="text-xs text-[#8B7355] mt-1">¥{menu.price.toLocaleString()}</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-[#C1B5A5]">準備中</p>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-center text-xs text-[#8B7355] space-y-1">
          <p>※ 日替わりデザートかサラダが付きます</p>
          <p>※ ランチの成分値にはご飯と汁物の成分値は含まれておりません</p>
          <p>※ 数値は仕入れ状況により変更になることがあります</p>
        </div>
      </div>

      {/* タブバー */}
      <div className="fixed bottom-0 left-0 right-0 glass-menu border-t border-white/20 backdrop-blur-xl safe-area-inset-bottom">
        <div className="max-w-2xl mx-auto px-4 py-2">
          <div className="flex items-center justify-around">
            <Link
              href={`/user/${storeId}`}
              className="flex flex-col items-center space-y-1 py-2 px-4 text-[#8B7355] hover:text-green-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs">ホーム</span>
            </Link>
            <Link
              href={`/user/${storeId}/daily`}
              className="flex flex-col items-center space-y-1 py-2 px-4 text-[#8B7355] hover:text-orange-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">本日</span>
            </Link>
            <Link
              href={`/user/${storeId}/weekly`}
              className="flex flex-col items-center space-y-1 py-2 px-4 text-orange-600 font-semibold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="text-xs">週間</span>
            </Link>
            <Link
              href={`/user/${storeId}/monthly`}
              className="flex flex-col items-center space-y-1 py-2 px-4 text-[#8B7355] hover:text-orange-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">月間</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
