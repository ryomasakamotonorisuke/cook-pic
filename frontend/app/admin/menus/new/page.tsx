'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: string;
}

export default function NewMenuPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: Date.now().toString(),
      category: '',
      name: '',
      price: '',
    },
  ]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successCount, setSuccessCount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/stores/profile');
        setCategories(response.data.menu_categories || []);
      } catch (err) {
        console.error('Failed to fetch store profile:', err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;
    setMenuItems((prev) =>
      prev.map((item) =>
        item.category ? item : { ...item, category: categories[0] }
      )
    );
  }, [categories]);

  const addMenuItem = () => {
    setMenuItems([
      ...menuItems,
      {
        id: Date.now().toString(),
        category: categories[0] || '',
        name: '',
        price: '',
      },
    ]);
  };

  const removeMenuItem = (id: string) => {
    if (menuItems.length > 1) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
    }
  };

  const updateMenuItem = (id: string, field: keyof MenuItem, value: string) => {
    setMenuItems(
      menuItems.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessCount(0);

    // バリデーション
    const invalidItems = menuItems.filter(
      (item) => !item.name.trim() || !item.category
    );

    if (invalidItems.length > 0) {
      setError('すべてのメニュー項目で、カテゴリーとメニュー名を入力してください');
      return;
    }

    setLoading(true);

    try {
      const date = new Date().toISOString();
      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      // 各メニューを順番に登録
      for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        try {
          await api.post('/menus/daily', {
            category: item.category || null,
            name: item.name.trim(),
            price: item.price ? parseInt(item.price) : 0,
            image_url: null,
            date: date,
          });

          success++;
          setSuccessCount(success);
          
          // 複数リクエストの負荷を軽減するため、少し待機（最後のリクエスト以外）
          if (i < menuItems.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100)); // 100ms待機
          }
        } catch (err: any) {
          failed++;
          let errorMsg = '登録に失敗しました';
          
          if (err.response) {
            // サーバーからの応答がある場合
            const responseError = err.response.data?.error || err.response.data?.details || err.response.statusText;
            errorMsg = `HTTP ${err.response.status}: ${responseError}`;
            console.error(`メニュー${i + 1} 登録エラー:`, {
              status: err.response.status,
              error: err.response.data,
              menuName: item.name,
            });
          } else if (err.request) {
            // リクエストは送信されたが、応答がない場合（Network Error）
            errorMsg = 'ネットワークエラー: サーバーに接続できませんでした。';
            console.error('Network Error details:', {
              message: err.message,
              code: err.code,
              config: {
                url: err.config?.url,
                method: err.config?.method,
                baseURL: err.config?.baseURL,
              }
            });
          } else {
            // リクエスト設定中にエラーが発生した場合
            errorMsg = err.message || 'リクエストの送信に失敗しました';
            console.error('Request setup error:', err);
          }
          
          errors.push(`メニュー${i + 1} (${item.name || '無名'}): ${errorMsg}`);
        }
      }

      if (failed > 0) {
        setError(
          `${success}件の登録に成功しましたが、${failed}件の登録に失敗しました。\n${errors.join('\n')}`
        );
        setLoading(false);
      } else {
        // すべて成功した場合、ダッシュボードに遷移
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      console.error('Menu creation error:', err);
      setError('メニューの投稿に失敗しました');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center text-[#007AFF] hover:text-[#0051D5] transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ダッシュボードに戻る
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-[#1C1C1E]">日間メニューを投稿</h1>
            <button
              type="button"
              onClick={addMenuItem}
              className="apple-button-secondary text-sm px-4 py-2"
            >
              + メニューを追加
            </button>
          </div>
          <p className="text-[#8E8E93] mt-2">複数のメニューを一度に登録できます（最大10件）</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
          {menuItems.map((item, index) => (
            <div key={item.id} className="apple-card p-6 relative">
              {/* 削除ボタン */}
              {menuItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMenuItem(item.id)}
                  className="absolute top-4 right-4 text-[#8E8E93] hover:text-red-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              <div className="mb-4">
                <span className="text-lg font-bold text-[#1C1C1E]">メニュー {index + 1}</span>
              </div>

              {/* カテゴリー */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#8E8E93] mb-2 uppercase tracking-wide">
                  カテゴリー <span className="text-red-500">*</span>
                </label>
                {categories.length > 0 ? (
                  <select
                    value={item.category || ''}
                    onChange={(e) => updateMenuItem(item.id, 'category', e.target.value)}
                    className="apple-input"
                  >
                    <option value="">選択してください</option>
                    {categories.map((categoryOption) => (
                      <option key={categoryOption} value={categoryOption}>
                        {categoryOption}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-[#8E8E93]">
                    カテゴリーがありません。プロフィール設定から追加してください。
                  </p>
                )}
              </div>

              {/* メニュー名 */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#8E8E93] mb-2 uppercase tracking-wide">
                  メニュー名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateMenuItem(item.id, 'name', e.target.value)}
                  required
                  placeholder="例: 本日のランチセット"
                  className="apple-input"
                />
              </div>

              {/* 価格 */}
              <div>
                <label className="block text-sm font-semibold text-[#8E8E93] mb-2 uppercase tracking-wide">
                  価格（円） <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateMenuItem(item.id, 'price', e.target.value)}
                    required
                    min="0"
                    placeholder="例: 1200"
                    className="apple-input pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E8E93]">円</span>
                </div>
              </div>
            </div>
          ))}

          {/* メニュー追加ボタン（下部） */}
          {menuItems.length < 10 && (
            <button
              type="button"
              onClick={addMenuItem}
              className="w-full apple-button-secondary py-4"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                メニューを追加（{menuItems.length}/10）
              </span>
            </button>
          )}

          {error && (
            <div className="apple-card p-4 bg-red-50 border-2 border-red-300 animate-fade-in">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-700 text-sm font-semibold mb-1">エラーが発生しました</p>
                  <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && successCount > 0 && (
            <div className="apple-card p-4 bg-blue-50 border border-blue-200 animate-fade-in">
              <p className="text-blue-600 text-sm">
                {successCount}/{menuItems.length} 件の登録が完了しました...
              </p>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 apple-button-secondary"
              disabled={loading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 apple-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {successCount > 0 ? `投稿中... (${successCount}/${menuItems.length})` : '投稿中...'}
                </span>
              ) : (
                `すべて投稿する (${menuItems.length}件)`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
