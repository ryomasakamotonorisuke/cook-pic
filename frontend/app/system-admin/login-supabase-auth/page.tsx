'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function SystemAdminLoginSupabaseAuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/system-admin/login-supabase-auth', {
        email,
        password,
      });

      localStorage.setItem('system_admin_token', response.data.token);
      localStorage.setItem('system_admin', JSON.stringify(response.data.admin));
      if (response.data.session?.access_token) {
        localStorage.setItem('supabase_access_token', response.data.session.access_token);
      }
      router.push('/system-admin/dashboard');
    } catch (err: any) {
      console.error('=== Login Error ===');
      console.error('Full error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error message:', err.message);
      
      const errorMessage = err.response?.data?.error || err.response?.data?.details || 'ログインに失敗しました';
      const errorDetails = err.response?.data?.details;
      const errorSolution = err.response?.data?.solution;
      
      let fullError = errorMessage;
      if (errorDetails && errorDetails !== errorMessage) {
        fullError += '\n\n' + errorDetails;
      }
      if (errorSolution) {
        fullError += '\n\n解決方法: ' + errorSolution;
      }
      
      setError(fullError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1C1C1E] mb-2">システム管理者</h1>
          <p className="text-[#8E8E93]">Supabase Authでログインしてください</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg whitespace-pre-wrap">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1C1C1E] mb-2">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#C6C6C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
              placeholder="メールアドレスを入力"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1C1C1E] mb-2">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#C6C6C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
              placeholder="パスワードを入力"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#007AFF] text-white py-3 rounded-xl font-semibold hover:bg-[#0051D5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/admin/login"
            className="text-[#007AFF] hover:underline text-sm"
          >
            店舗管理者ログインへ
          </a>
        </div>
      </div>
    </div>
  );
}

