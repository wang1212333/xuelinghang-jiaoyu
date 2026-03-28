#!/usr/bin/env node
// 创建管理员账号脚本
// 使用方法：node create-admin.js your-email@example.com your-password

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const SUPABASE_URL = 'https://mxciauwvqwcjkpjhznwu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_212yua6bkmJ77gYr4jTrLA_zETYakk_';

async function createAdmin(email, password) {
  try {
    console.log(`正在创建管理员账号：${email}`);
    
    // 1. 创建用户
    const signUpResponse = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email,
        password,
        options: {
          data: {
            role: 'admin'
          }
        }
      })
    });

    const signUpData = await signUpResponse.json();

    if (!signUpResponse.ok) {
      throw new Error(signUpData.error?.message || '创建失败');
    }

    console.log('✅ 用户创建成功！');
    console.log(`用户 ID: ${signUpData.user.id}`);
    console.log(`邮箱：${signUpData.user.email}`);

    // 2. 创建 profile
    const profileResponse = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        user_id: signUpData.user.id,
        name: email.split('@')[0],
        role_label: '管理员'
      })
    });

    if (profileResponse.ok) {
      console.log('✅ Profile 创建成功！');
    }

    console.log('\n==========================================');
    console.log('管理员账号创建完成！');
    console.log(`邮箱：${email}`);
    console.log(`密码：${password}`);
    console.log('==========================================');

  } catch (error) {
    console.error('❌ 创建失败:', error.message);
    process.exit(1);
  }
}

// 从命令行参数获取邮箱和密码
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('使用方法：node create-admin.js <邮箱> <密码>');
  console.log('示例：node create-admin.js admin@example.com admin123');
  process.exit(1);
}

createAdmin(email, password);
