'use client';

export default function HomePage() {
  return (
    <div className="min-h-screen theme-user flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl">
        {/* ヘッダー */}
        <div className="text-center mb-16 animate-fade-in spacing-section">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-lg bg-primary mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold text-text mb-4">料理写真共有システム</h1>
        </div>

        {/* メインカード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 spacing-section">
          {/* システム管理者カード */}
          <a
            href="/system-admin/login"
            className="restaurant-card restaurant-card-system-admin p-8 group animate-slide-up"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 bg-system-admin-primary">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text mb-3 group-hover:text-system-admin-primary transition-colors">システム管理者</h2>
              <p className="text-text-light text-sm leading-relaxed mb-6 font-normal">
                店舗管理・ユーザー管理ができます
              </p>
              <div className="flex items-center justify-center space-x-2 text-system-admin-primary font-medium group-hover:text-primary-dark transition-colors">
                <span>ログイン</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>

          {/* 店舗管理者カード */}
          <a
            href="/admin/login"
            className="restaurant-card restaurant-card-store-admin p-8 group animate-slide-up"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 bg-store-admin-primary">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text mb-3 group-hover:text-store-admin-primary transition-colors">店舗管理</h2>
              <p className="text-text-light text-sm leading-relaxed mb-6 font-normal">
                メニューの登録・編集・削除ができます
              </p>
              <div className="flex items-center justify-center space-x-2 text-store-admin-primary font-medium group-hover:text-secondary-dark transition-colors">
                <span>ログイン</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>

          {/* ユーザーカード */}
          <a
            href="/user/access"
            className="restaurant-card restaurant-card-user p-8 group animate-slide-up"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6 bg-user-primary">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-text mb-3 group-hover:text-user-primary transition-colors">利用者</h2>
              <p className="text-text-light text-sm leading-relaxed mb-6 font-normal">
                店舗メニューを閲覧できます
              </p>
              <div className="flex items-center justify-center space-x-2 text-user-primary font-medium group-hover:text-accent-dark transition-colors">
                <span>メニューを見る</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>
        </div>

        {/* フッター */}
        <div className="text-center animate-fade-in spacing-section">
          <p className="text-text mb-8 text-lg font-medium">
            店舗メニューを簡単に管理・閲覧できるシステム
          </p>
          
          {/* ログインページへの直接リンク */}
          <div className="glass-user restaurant-card restaurant-card-user p-6 inline-block">
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/system-admin/login"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium text-system-admin-primary hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>システム管理者</span>
              </a>
              <span className="text-text-lighter self-center">|</span>
              <a
                href="/admin/login"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium text-store-admin-primary hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>店舗管理</span>
              </a>
              <span className="text-text-lighter self-center">|</span>
              <a
                href="/user/access"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium text-user-primary hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>利用者アクセス</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
