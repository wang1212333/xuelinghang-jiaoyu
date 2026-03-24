import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (userError) throw userError;
    
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', id)
      .single();
    
    if (profileError) throw profileError;
    
    res.json({ ...user, ...profile });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, grade, phone, email, wechat, city, district, address, avatar_url, role_label } = req.body;
    
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        name,
        gender,
        grade,
        avatar_url,
        role_label,
        city,
        district,
        address,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', id)
      .select()
      .single();
    
    if (profileError) throw profileError;
    
    if (phone || email || wechat) {
      await supabaseAdmin
        .from('users')
        .update({ phone, wechat, updated_at: new Date().toISOString() })
        .eq('id', id);
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { email, phone, name, wechat } = req.body;
    
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const userId = uuidv4();
    
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email,
        phone,
        wechat
      });
    
    if (userError) throw userError;
    
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id: userId,
        name: name || email.split('@')[0],
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
      })
      .select()
      .single();
    
    if (profileError) throw profileError;
    
    res.status(201).json({ id: userId, ...profile });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

export default router;