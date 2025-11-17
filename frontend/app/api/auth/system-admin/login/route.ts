import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('=== System Admin Login Attempt ===');
    console.log('Username:', username);
    console.log('Password provided:', password ? '***' : 'missing');

    if (!username || !password) {
      console.error('Missing username or password');
      return NextResponse.json(
        { error: 'ユーザー名とパスワードが必要です' },
        { status: 400 }
      );
    }

    // 環境変数の確認
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('Service Role Key:', serviceRoleKey ? 'Set' : 'Missing');

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'サーバー設定エラー: Supabase環境変数が設定されていません', details: '環境変数を確認してください' },
        { status: 500 }
      );
    }

    const supabase = createServerClient();
    
    console.log('Querying system_admins table for username:', username);
    const { data: admin, error } = await supabase
      .from('system_admins')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Supabase query error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // テーブルが存在しない場合のエラー
      if (error.code === 'PGRST116' || error.message?.includes('does not exist') || error.message?.includes('relation') || error.message?.includes('table')) {
        return NextResponse.json(
          { 
            error: 'システム管理者テーブルが存在しません。データベースマイグレーションを実行してください。',
            details: error.message,
            code: error.code,
            solution: 'Supabase SQL Editorで migration_add_system_admin_complete.sql を実行してください'
          },
          { status: 500 }
        );
      }
      
      // レコードが見つからない場合（PGRST116は「not found」を意味する）
      if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
        return NextResponse.json(
          { 
            error: 'ユーザー名が見つかりません。データベースにシステム管理者が作成されているか確認してください。',
            details: `ユーザー名: ${username}`,
            code: error.code,
            solution: 'Supabase SQL Editorで QUICK_FIX_SYSTEM_ADMIN.sql を実行してください'
          },
          { status: 404 }
        );
      }
      
      // その他のエラーは汎用的なエラーメッセージを返す
      return NextResponse.json(
        { 
          error: 'データベースエラーが発生しました',
          details: error.message,
          code: error.code,
          solution: 'Supabase SQL Editorで COMPLETE_FIX.sql を実行してください'
        },
        { status: 500 }
      );
    }

    if (!admin) {
      console.error('Admin not found for username:', username);
      return NextResponse.json(
        { 
          error: 'ユーザー名が見つかりません。データベースにシステム管理者が作成されているか確認してください。',
          details: `ユーザー名: ${username}`,
          solution: 'Supabase SQL Editorで COMPLETE_FIX.sql を実行してください'
        },
        { status: 404 }
      );
    }

    console.log('Admin found:', admin.username, admin.name);
    console.log('Admin ID:', admin.id);
    console.log('Password hash (first 30 chars):', admin.password_hash?.substring(0, 30));
    console.log('Password hash length:', admin.password_hash?.length);
    console.log('Password hash full:', admin.password_hash);
    console.log('Comparing password...');
    console.log('Input username:', username);
    console.log('Input password:', password);
    console.log('Input password length:', password?.length);

    // パスワードハッシュが正しい形式か確認
    if (!admin.password_hash) {
      console.error('Password hash is null or undefined');
      return NextResponse.json(
        { 
          error: 'パスワードハッシュが設定されていません',
          details: 'Supabase SQL Editorで COMPLETE_RESET.sql を実行してください。'
        },
        { status: 500 }
      );
    }

    if (admin.password_hash.length < 50 || admin.password_hash.length > 100) {
      console.error('Invalid password hash length:', admin.password_hash.length);
      return NextResponse.json(
        { 
          error: 'パスワードハッシュの長さが正しくありません',
          details: `ハッシュの長さ: ${admin.password_hash.length}文字（60文字である必要があります）。Supabase SQL Editorで COMPLETE_RESET.sql を実行してください。`
        },
        { status: 500 }
      );
    }

    if (!admin.password_hash.startsWith('$2a$') && !admin.password_hash.startsWith('$2b$')) {
      console.error('Invalid password hash format:', admin.password_hash.substring(0, 10));
      return NextResponse.json(
        { 
          error: 'パスワードハッシュの形式が正しくありません',
          details: `ハッシュの形式: ${admin.password_hash.substring(0, 10)}...（$2a$10$...で始まる必要があります）。Supabase SQL Editorで COMPLETE_RESET.sql を実行してください。`
        },
        { status: 500 }
      );
    }

    // パスワード比較
    console.log('Starting bcrypt.compare...');
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    console.log('Password comparison result:', isValidPassword);
    
    // テスト用: 正しいハッシュで比較してみる
    const correctHash = '$2a$10$TfL2YgEWStCa.70GOP75Se2cAq24kzyP6vMBgycEnxgDs/D8cx8l.';
    const testCompareWithCorrectHash = await bcrypt.compare('admin123', correctHash);
    console.log('Test: Comparing "admin123" with correct hash:', testCompareWithCorrectHash);
    
    const testCompareWithStoredHash = await bcrypt.compare('admin123', admin.password_hash);
    console.log('Test: Comparing "admin123" with stored hash:', testCompareWithStoredHash);
    
    const testCompareInputPassword = await bcrypt.compare(password, admin.password_hash);
    console.log('Test: Comparing input password with stored hash:', testCompareInputPassword);
    
    if (!isValidPassword) {
      console.error('=== Password Validation Failed ===');
      console.error('Username:', username);
      console.error('Input password:', password);
      console.error('Stored hash:', admin.password_hash);
      console.error('Hash length:', admin.password_hash.length);
      console.error('Hash starts with:', admin.password_hash.substring(0, 7));
      console.error('Test with "admin123":', testCompareWithStoredHash);
      console.error('Test with input password:', testCompareInputPassword);
      
      return NextResponse.json(
        { 
          error: 'パスワードが正しくありません',
          details: `ユーザー名: ${username}, パスワードハッシュの長さ: ${admin.password_hash.length}文字。デフォルトのパスワードは "admin123" です。Supabase SQL Editorで VERIFY_PASSWORD_HASH.sql を実行してパスワードをリセットしてください。`,
          debug: {
            hashLength: admin.password_hash.length,
            hashStart: admin.password_hash.substring(0, 10),
            testWithAdmin123: testCompareWithStoredHash
          }
        },
        { status: 401 }
      );
    }

    console.log('Login successful for username:', username);

    // システム管理者トークンを生成
    const token = Buffer.from(JSON.stringify({ 
      role: 'system_admin',
      adminId: admin.id,
      username: admin.username 
    })).toString('base64');

    return NextResponse.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error: any) {
    console.error('System admin login error:', error);
    return NextResponse.json(
      { error: 'ログインに失敗しました' },
      { status: 500 }
    );
  }
}

