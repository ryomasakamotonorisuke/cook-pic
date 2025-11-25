'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Menu {
  id: string;
  name: string;
  category?: string;
  price: number;
  image_url: string;
  is_pinned?: boolean;
  created_at: string;
}

interface Store {
  id: string;
  store_id: string;
  name: string;
  profile_image_url?: string;
}

export default function DailyMenuPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const [menus, setMenus] = useState<Menu[]>([]);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menusRes, storeRes] = await Promise.all([
          api.get(`/menus/daily/${storeId}?date=${selectedDate}`),
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
  }, [storeId, selectedDate, router]);

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
          
          {/* 日付選択 */}
          <div className="px-4 pb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="restaurant-input restaurant-input-menu w-full px-4 py-2 rounded-xl"
            />
          </div>
        </div>
      )}

      {/* メニューカードグリッド */}
      <div className="pb-20 px-4 py-6">
        {(() => {
          const pinnedMenus = menus.filter(m => m.is_pinned);
          const normalMenus = menus.filter(m => !m.is_pinned);
          const allMenus = [...pinnedMenus, ...normalMenus].slice(0, 10);
          const displayCount = Math.max(4, Math.min(allMenus.length, 10));
          const displayMenus: (Menu | null)[] = [...allMenus];
          while (displayMenus.length < displayCount) {
            displayMenus.push(null);
          }
          
          return (
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {displayMenus.map((menu, index) => (
                <div
                  key={menu?.id || `empty-${index}`}
                  className={`menu-item-card ${menu?.is_pinned ? 'border-2 border-orange-400' : ''} ${!menu ? 'opacity-50' : ''}`}
                >
                  {menu ? (
                    <>
                      {menu.is_pinned && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-xs rounded-full shadow-lg">
                            📌
                          </span>
                        </div>
                      )}
                      
                      <div className="menu-image-container">
                        <img
                          src={menu.image_url}
                          alt={menu.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-[#2C1810] mb-2 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {menu.name}
                        </h3>
                        {menu.category && (
                          <span className="inline-block px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-full mb-2 font-semibold" style={{ backgroundColor: 'rgba(255, 179, 167, 0.2)', color: '#FF6B35' }}>
                            {menu.category}
                          </span>
                        )}
                        <p className="text-lg font-bold gradient-text gradient-text-menu mt-2">
                          ¥{menu.price.toLocaleString()}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="menu-image-container flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-[#FFB3A7]/50 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="text-xs text-[#8B7355]">未登録</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })()}
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
              className="flex flex-col items-center space-y-1 py-2 px-4 text-orange-600 font-semibold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="text-xs">本日</span>
            </Link>
            <Link
              href={`/user/${storeId}/weekly`}
              className="flex flex-col items-center space-y-1 py-2 px-4 text-[#8B7355] hover:text-green-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
