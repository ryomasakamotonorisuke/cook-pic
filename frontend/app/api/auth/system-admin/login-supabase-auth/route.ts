import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('=== System Admin Login with Supabase Auth ===');
    console.log('Endpoint: /api/auth/system-admin/login-supabase-auth');
    console.log('Email:', email);
    console.log('Password provided:', password ? '***' : 'missing');

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードが必要です' },
        { status: 400 }
      );
    }

    // 環境変数の確認
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Missing');

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'サーバー設定エラー: Supabase環境変数が設定されていません', details: '環境変数を確認してください' },
        { status: 500 }
      );
    }

    // Anon Keyを使用してSupabase Authにログイン
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('Attempting Supabase Auth login...');
    const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('=== Supabase Auth Error ===');
      console.error('Error code:', authError.status);
      console.error('Error message:', authError.message);
      console.error('Full error:', JSON.stringify(authError, null, 2));
      return NextResponse.json(
        { 
          error: 'メールアドレスまたはパスワードが正しくありません',
          details: authError.message,
          code: authError.status
        },
        { status: 401 }
      );
    }

    if (!authData.user) {
      console.error('No user returned from Supabase Auth');
      return NextResponse.json(
        { error: 'ログインに失敗しました' },
        { status: 401 }
      );
    }

    console.log('Supabase Auth login successful, User ID:', authData.user.id);

    // システム管理者かどうかを確認（Service Role Keyを使用）
    const supabase = createServerClient();
    
    // ユーザーIDで検索
    let admin = null;
    const { data: adminById, error: adminError } = await supabase
      .from('system_admins')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (!adminError && adminById) {
      admin = adminById;
      console.log('System admin found by user ID:', authData.user.id);
    } else {
      // ユーザーIDで見つからない場合、emailで検索
      console.log('System admin not found by user ID, searching by email...');
      const { data: adminByEmail, error: emailError } = await supabase
        .from('system_admins')
        .select('*')
        .eq('email', email)
        .single();

      if (!emailError && adminByEmail) {
        admin = adminByEmail;
        console.log('System admin found by email:', email);
        
        // emailで見つかった場合、ユーザーIDを更新
        const { error: updateError } = await supabase
          .from('system_admins')
          .update({ id: authData.user.id })
          .eq('email', email);

        if (updateError) {
          console.error('Failed to update system admin ID:', updateError);
        } else {
          admin.id = authData.user.id;
          console.log('Updated system admin ID to:', authData.user.id);
        }
      } else {
        console.error('System admin not found for email:', email);
        return NextResponse.json(
          { 
            error: 'システム管理者として登録されていません',
            details: 'このメールアドレスはシステム管理者として登録されていません。Supabase SQL Editorでシステム管理者を登録してください。'
          },
          { status: 403 }
        );
      }
    }

    console.log('Login successful for email:', email);

    // システム管理者トークンを生成
    const token = Buffer.from(JSON.stringify({ 
      role: 'system_admin',
      adminId: authData.user.id,
      email: authData.user.email,
      supabaseAccessToken: authData.session?.access_token
    })).toString('base64');

    return NextResponse.json({
      token,
      admin: {
        id: authData.user.id,
        email: authData.user.email,
        username: admin?.username || email.split('@')[0],
        name: admin?.name || 'システム管理者',
      },
      session: {
        access_token: authData.session?.access_token,
        refresh_token: authData.session?.refresh_token,
      }
    });
  } catch (error: any) {
    console.error('System admin login error:', error);
    return NextResponse.json(
      { error: 'ログインに失敗しました', details: error.message },
      { status: 500 }
    );
  }
}

