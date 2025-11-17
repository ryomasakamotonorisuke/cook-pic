import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function getStoreIdFromToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  try {
    const token = authHeader.substring(7);
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    return decoded.storeId || null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const storeId = getStoreIdFromToken(request);
    if (!storeId) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const menuType = searchParams.get('type'); // 'daily' | 'weekly' | 'monthly' | null (all)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100;

    const supabase = createServerClient();
    const allMenus: any[] = [];

    // 日間メニューを取得
    if (!menuType || menuType === 'daily') {
      const { data: dailyMenus, error: dailyError } = await supabase
        .from('menus')
        .select('*, menu_type')
        .eq('store_id', storeId)
        .eq('menu_type', 'daily')
        .order('date', { ascending: false })
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!dailyError && dailyMenus) {
        // menu_typeを追加して統一フォーマットに変換
        const formattedDailyMenus = dailyMenus.map(menu => ({
          ...menu,
          menu_type: 'daily',
        }));
        allMenus.push(...formattedDailyMenus);
      }
    }

    // 週間メニューを取得
    if (!menuType || menuType === 'weekly') {
      const { data: weeklyMenus, error: weeklyError } = await supabase
        .from('weekly_menus')
        .select('*')
        .eq('store_id', storeId)
        .order('week_start_date', { ascending: false })
        .order('day_of_week', { ascending: true })
        .limit(limit);

      if (!weeklyError && weeklyMenus) {
        // weekly_menusを統一フォーマットに変換
        const formattedWeeklyMenus = weeklyMenus.map(menu => ({
          id: menu.id,
          name: menu.menu_name,
          category: menu.category,
          price: menu.price || 0,
          image_url: menu.image_url || '',
          menu_type: 'weekly',
          date: menu.week_start_date,
          day_of_week: menu.day_of_week,
          week_start_date: menu.week_start_date,
          created_at: menu.created_at,
        }));
        allMenus.push(...formattedWeeklyMenus);
      }
    }

    // 月間メニューを取得
    if (!menuType || menuType === 'monthly') {
      const { data: monthlyMenus, error: monthlyError } = await supabase
        .from('monthly_menus')
        .select('*')
        .eq('store_id', storeId)
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .order('menu_name', { ascending: true })
        .limit(limit);

      if (!monthlyError && monthlyMenus) {
        // monthly_menusを統一フォーマットに変換
        const formattedMonthlyMenus = monthlyMenus.map(menu => ({
          id: menu.id,
          name: menu.menu_name,
          category: menu.category,
          price: menu.price || 0,
          image_url: menu.image_url || '',
          menu_type: 'monthly',
          date: `${menu.year}-${String(menu.month).padStart(2, '0')}-01`,
          year: menu.year,
          month: menu.month,
          created_at: menu.created_at,
        }));
        allMenus.push(...formattedMonthlyMenus);
      }
    }

    // 作成日時でソート（新しい順）
    allMenus.sort((a, b) => {
      const dateA = new Date(a.created_at || a.date).getTime();
      const dateB = new Date(b.created_at || b.date).getTime();
      return dateB - dateA;
    });

    return NextResponse.json(allMenus);
  } catch (error: any) {
    console.error('Get all menus error:', error);
    return NextResponse.json(
      { 
        error: 'メニューの取得に失敗しました',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

