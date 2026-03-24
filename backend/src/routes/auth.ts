import { Router } from 'express';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, wechat } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '密码至少需要6位' });
    }

    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const signUpResponse = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({
        email,
        password,
        data: {
          name: name || email.split('@')[0],
          phone: phone || '',
          wechat: wechat || ''
        }
      })
    });

    const signUpData = await signUpResponse.json();

    if (!signUpResponse.ok) {
      console.error('Supabase signup error:', signUpData);
      if (signUpData.msg?.includes('already') || signUpData.message?.includes('already') || signUpData.error_description?.includes('already')) {
        return res.status(400).json({ error: '该邮箱已被注册' });
      }
      return res.status(400).json({ error: signUpData.msg || signUpData.message || signUpData.error_description || '注册失败' });
    }

    const userId = signUpData.user?.id || signUpData.id;

    const usersResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        id: userId,
        email,
        phone: phone || '',
        wechat: wechat || '',
        role: 'user'
      })
    });

    if (!usersResponse.ok) {
      console.error('Users insert error:', await usersResponse.text());
    }

    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_id: userId,
        name: name || email.split('@')[0],
        phone: phone || '',
        wechat: wechat || '',
        role_label: '学领航员'
      })
    });

    if (!profileResponse.ok) {
      console.error('Profile insert error:', await profileResponse.text());
    }

    res.status(201).json({
      success: true,
      user: {
        id: userId,
        email,
        name: name || email.split('@')[0]
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message || '注册失败，请稍后重试' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }

    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const signInResponse = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const authData = await signInResponse.json();

    if (!signInResponse.ok || !authData.access_token) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?user_id=eq.${authData.user.id}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    });

    const profiles = await profileResponse.json();
    const profile = profiles && profiles.length > 0 ? profiles[0] : null;

    res.json({
      success: true,
      token: authData.access_token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        ...profile
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || '登录失败' });
  }
});

router.post('/logout', async (req, res) => {
  res.json({ success: true });
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未登录' });
    }

    const token = authHeader.split(' ')[1];
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const userData = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseServiceKey
      }
    });

    if (!userData.ok) {
      return res.status(401).json({ error: 'token无效或已过期' });
    }

    const userInfo = await userData.json();

    const profileResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?user_id=eq.${userInfo.id}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    });

    const profiles = await profileResponse.json();
    const profile = profiles && profiles.length > 0 ? profiles[0] : null;

    res.json({
      id: userInfo.id,
      email: userInfo.email,
      ...profile
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message || '获取用户信息失败' });
  }
});

export default router;