'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface Menu {
  id: string;
  name: string;
  category?: string;
  price: number;
  image_url: string;
  menu_type: 'daily' | 'weekly' | 'monthly';
  date: string;
  is_pinned?: boolean;
  created_at: string;
  day_of_week?: number;
  week_start_date?: string;
  year?: number;
  month?: number;
}

export default function MenuListPage() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchMenus();
  }, [router, filterType]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      // 認証トークンを使用して全てのメニューを取得
      const typeParam = filterType === 'all' ? '' : `?type=${filterType}`;
      const response = await api.get(`/menus/all${typeParam}`);
      setMenus(response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch menus:', error);
      if (error.response?.status === 401) {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePin = async (id: string, isPinned: boolean, menuType: string) => {
    try {
      // 日間メニューのみピン留め可能
      if (menuType !== 'daily') {
        alert('ピン留めは日間メニューのみ可能です');
        return;
      }
      await api.put(`/menus/${id}/pin`, { is_pinned: !isPinned });
      fetchMenus();
    } catch (error: any) {
      alert(error.response?.data?.error || 'ピン留めの更新に失敗しました');
    }
  };

  const handleDelete = async (id: string, menuType: string) => {
    if (!confirm('このメニューを削除しますか？')) {
      return;
    }

    try {
      if (menuType === 'daily') {
        await api.delete(`/menus/${id}`);
      } else if (menuType === 'weekly') {
        await api.delete(`/weekly-menus/${id}`);
      } else if (menuType === 'monthly') {
        await api.delete(`/monthly-menus/${id}`);
      }
      fetchMenus();
    } catch (error: any) {
      alert(error.response?.data?.error || '削除に失敗しました');
    }
  };

  const filteredMenus = filterType === 'all' 
    ? menus 
    : menus.filter(m => m.menu_type === filterType);

  if (loading) {
    return (
      <div className="min-h-screen theme-store-admin particle-bg-store-admin flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-store-admin-primary mb-4 shadow-lg">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-[#2C1810] font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-store-admin particle-bg-store-admin">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="glass-store-admin border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl mb-8">
          <div className="max-w-4xl mx-auto px-4 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center text-[#2C1810] hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  ダッシュボードに戻る
                </Link>
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-text gradient-text-store-admin mt-4">メニュー一覧・編集</h1>
          </div>
        </div>

        {/* フィルター */}
        <div className="mb-6 animate-slide-up">
          <div className="restaurant-card restaurant-card-store-admin p-4">
            <div className="flex space-x-2">
              {(['all', 'daily', 'weekly', 'monthly'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 font-semibold ${
                    filterType === type
                      ? 'btn-primary btn-primary-store-admin text-white'
                      : 'bg-white/80 text-[#2C1810] hover:bg-white border-2 border-blue-500/30'
                  }`}
                >
                  {type === 'all' ? 'すべて' : type === 'daily' ? '日間' : type === 'weekly' ? '週間' : '月間'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* メニュー一覧 */}
        <div className="space-y-3 animate-slide-up">
          {filteredMenus.length === 0 ? (
            <div className="restaurant-card restaurant-card-store-admin p-12 text-center">
              <p className="text-[#2C1810] text-lg font-semibold">メニューがありません</p>
            </div>
          ) : (
            filteredMenus.map((menu) => (
              <div
                key={menu.id}
                className={`restaurant-card restaurant-card-store-admin p-6 hover:shadow-lg transition-all duration-200 ${
                  menu.is_pinned ? 'border-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#F2F2F7]">
                    <img
                      src={menu.image_url}
                      alt={menu.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {menu.is_pinned && (
                            <span className="px-2 py-1 bg-[#007AFF] text-white text-xs rounded-full">
                              📌 ピン留め
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-[#2C1810]">{menu.name}</h3>
                          {menu.category && (
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">
                              {menu.category}
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                            menu.menu_type === 'daily' ? 'bg-orange-100 text-orange-700' :
                            menu.menu_type === 'weekly' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {menu.menu_type === 'daily' ? '日間' : menu.menu_type === 'weekly' ? '週間' : '月間'}
                          </span>
                        </div>
                        <p className="text-blue-600 font-bold mb-2 text-lg">
                          ¥{menu.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-[#2C1810] font-medium">
                          {menu.menu_type === 'daily' && new Date(menu.date).toLocaleDateString('ja-JP')}
                          {menu.menu_type === 'weekly' && menu.week_start_date && (
                            <>週間メニュー ({new Date(menu.week_start_date).toLocaleDateString('ja-JP')}開始)</>
                          )}
                          {menu.menu_type === 'monthly' && menu.year && menu.month && (
                            <>{menu.year}年{menu.month}月</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 mt-4">
                      {menu.menu_type === 'daily' && (
                        <button
                          onClick={() => handlePin(menu.id, menu.is_pinned || false, menu.menu_type)}
                          className={`px-4 py-2 rounded-xl transition-colors text-sm font-semibold ${
                            menu.is_pinned
                              ? 'btn-primary btn-primary-store-admin text-white'
                              : 'bg-white/80 text-[#2C1810] hover:bg-white border-2 border-blue-500/30'
                          }`}
                        >
                          {menu.is_pinned ? '📌 ピン留め解除' : '📌 ピン留め'}
                        </button>
                      )}
                      {menu.menu_type === 'daily' && (
                        <Link
                          href={`/admin/menus/edit/${menu.id}`}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-sm font-semibold border-2 border-blue-500/30"
                        >
                          編集
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(menu.id, menu.menu_type)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-semibold border-2 border-red-500/30"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
