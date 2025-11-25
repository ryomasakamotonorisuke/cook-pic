'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface Store {
  id: string;
  store_id: string;
  name: string;
  profile_image_url?: string;
  menu_categories?: string[];
  business_days?: number[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [store, setStore] = useState<Store | null>(null);
  const [name, setName] = useState('');
  const [menuCategories, setMenuCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [businessDays, setBusinessDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const fetchStore = async () => {
      try {
        const response = await api.get('/stores/profile');
        setStore(response.data);
        setName(response.data.name);
        setMenuCategories(response.data.menu_categories || []);
        const days = response.data.business_days?.length ? response.data.business_days : [1,2,3,4,5];
        setBusinessDays(days.sort((a: number, b: number) => a - b));
      } catch (error) {
        console.error('Failed to fetch store:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await api.put('/stores/profile', {
        name,
        menu_categories: menuCategories,
        business_days: businessDays,
      });
      setStore(response.data);
      alert('プロフィールを更新しました');
    } catch (err: any) {
      setError(err.response?.data?.error || 'プロフィールの更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (menuCategories.includes(trimmed)) {
      alert('同じカテゴリーが既に存在します');
      return;
    }
    setMenuCategories([...menuCategories, trimmed]);
    setNewCategory('');
  };

  const handleRemoveCategory = (category: string) => {
    setMenuCategories(menuCategories.filter((c) => c !== category));
  };

  const toggleBusinessDay = (day: number) => {
    setBusinessDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const DAY_OPTIONS = [
    { value: 0, label: '日' },
    { value: 1, label: '月' },
    { value: 2, label: '火' },
    { value: 3, label: '水' },
    { value: 4, label: '木' },
    { value: 5, label: '金' },
    { value: 6, label: '土' },
  ];

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
      <div className="glass-store-admin border-b border-white/20 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#1A1A1A]">プロフィール編集</h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white/80 border-2 border-blue-500/30 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 text-sm"
            >
              戻る
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="restaurant-card restaurant-card-store-admin p-6">
            <div>
              <label htmlFor="store_id" className="block text-sm font-semibold text-[#2C1810] mb-2">
                店舗ID
              </label>
              <input
                id="store_id"
                type="text"
                value={store?.store_id || ''}
                disabled
                className="restaurant-input restaurant-input-store-admin w-full bg-gray-50 text-[#2C1810]"
              />
              <p className="mt-1 text-sm text-[#2C1810]/70">店舗IDは変更できません</p>
            </div>
          </div>

          <div className="restaurant-card restaurant-card-store-admin p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#2C1810] mb-2">
                店舗名
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="restaurant-input restaurant-input-store-admin w-full text-[#2C1810]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-[#2C1810]">メニューカテゴリー</label>
                <Link href="/admin/menus/new" className="text-sm text-blue-600 hover:underline">
                  登録画面へ
                </Link>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {menuCategories.length === 0 && (
                  <span className="text-sm text-[#2C1810]/60">カテゴリーがありません</span>
                )}
                {menuCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center space-x-2 px-3 py-1 bg-white/80 border border-[#2C1810]/10 rounded-full text-sm text-[#2C1810]"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat)}
                      className="text-[#8E8E93] hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="例: LUNCH / ランチ"
                  className="restaurant-input restaurant-input-store-admin flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  追加
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C1810] mb-2">
                営業曜日
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DAY_OPTIONS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleBusinessDay(day.value)}
                    className={`px-3 py-2 rounded-xl border-2 text-sm transition ${
                      businessDays.includes(day.value)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-[#E5E5EA] text-[#2C1810]'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#2C1810]/60 mt-2">
                選択した曜日が週間メニュー表に表示されます。
              </p>
            </div>
          </div>

          {error && (
            <div className="restaurant-card restaurant-card-store-admin p-4 bg-red-50 border-2 border-red-300">
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border-2 border-[#2C1810]/20 text-[#2C1810] py-3 rounded-xl font-semibold hover:bg-white/80 transition-colors bg-white/60"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary btn-primary-store-admin flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}












