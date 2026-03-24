import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { user_id, is_read } = req.query;
    
    let query = supabaseAdmin.from('messages').select('*');
    
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    
    if (is_read !== undefined) {
      query = query.eq('is_read', is_read === 'true');
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, title, content, type, sender_name, sender_avatar } = req.body;
    
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert({
        user_id,
        title,
        content,
        type: type || 'system',
        sender_name,
        sender_avatar
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabaseAdmin
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

router.put('/read-all', async (req, res) => {
  try {
    const { user_id } = req.body;
    
    const { error } = await supabaseAdmin
      .from('messages')
      .update({ is_read: true })
      .eq('user_id', user_id)
      .eq('is_read', false);
    
    if (error) throw error;
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all messages as read:', error);
    res.status(500).json({ error: 'Failed to mark all messages as read' });
  }
});

export default router;