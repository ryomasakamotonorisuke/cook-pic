'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import systemAdminApi from '@/lib/systemAdminApi';

interface SystemAdmin {
  id: string;
  username: string;
  name: string;
  email?: string;
}

export default function SystemAdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<SystemAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [storeCount, setStoreCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('system_admin_token');
    if (!token) {
      router.push('/system-admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        const adminData = localStorage.getItem('system_admin');
        if (adminData) {
          setAdmin(JSON.parse(adminData));
        }

        // 店舗数と管理者数を取得
        try {
          const [storesRes, adminsRes] = await Promise.all([
            systemAdminApi.get('/system-admin/stores/count'),
            systemAdminApi.get('/system-admin/admins/count'),
          ]);

          setStoreCount(storesRes.data.count || 0);
          setAdminCount(adminsRes.data.count || 0);
        } catch (error) {
          console.error('Failed to fetch counts:', error);
          // エラーが発生しても続行
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        router.push('/system-admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('system_admin_token');
    localStorage.removeItem('system_admin');
    router.push('/system-admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen particle-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-button mb-4 animate-float">
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
    <div className="min-h-screen particle-bg">
      {/* ヘッダー */}
      <div className="glass border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl gradient-button flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">システム管理</h1>
                <p className="text-sm text-[#8B7355] mt-0.5">
                  {admin?.name} <span className="text-[#8B7355]/60">({admin?.username})</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-red-400/30"
              style={{
                boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4), 0 2px 8px rgba(239, 68, 68, 0.3)'
              }}
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="restaurant-card p-8 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8B7355] text-sm font-medium mb-2">登録店舗数</p>
                <p className="text-5xl font-bold gradient-text">{storeCount}</p>
                <p className="text-xs text-[#8B7355]/60 mt-2">店舗</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="restaurant-card p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8B7355] text-sm font-medium mb-2">システム管理者数</p>
                <p className="text-5xl font-bold gradient-text">{adminCount}</p>
                <p className="text-xs text-[#8B7355]/60 mt-2">管理者</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* メニューカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 店舗管理 */}
          <Link
            href="/system-admin/stores"
            className="restaurant-card p-8 group animate-slide-up border-2 border-transparent hover:border-orange-300/50"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#2C1810] mb-2 group-hover:gradient-text transition-all">店舗管理</h3>
                <p className="text-sm text-[#8B7355] leading-relaxed">店舗の登録・編集・削除を行います</p>
              </div>
              <svg className="w-6 h-6 text-[#8B7355] group-hover:text-[#FF6B35] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* システム管理者管理 */}
          <Link
            href="/system-admin/admins"
            className="restaurant-card p-8 group animate-slide-up border-2 border-transparent hover:border-yellow-300/50"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#2C1810] mb-2 group-hover:gradient-text transition-all">システム管理者管理</h3>
                <p className="text-sm text-[#8B7355] leading-relaxed">システム管理者の追加・編集を行います</p>
              </div>
              <svg className="w-6 h-6 text-[#8B7355] group-hover:text-[#FF6B35] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* 利用統計 */}
          <Link
            href="/system-admin/analytics"
            className="restaurant-card p-8 group animate-slide-up border-2 border-transparent hover:border-red-300/50"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#2C1810] mb-2 group-hover:gradient-text transition-all">利用統計</h3>
                <p className="text-sm text-[#8B7355] leading-relaxed">アクセス数や利用状況を確認します</p>
              </div>
              <svg className="w-6 h-6 text-[#8B7355] group-hover:text-[#FF6B35] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
