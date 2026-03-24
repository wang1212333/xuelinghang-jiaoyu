import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { user_id, tutor_id, status } = req.query;
    
    let query = supabaseAdmin.from('appointments').select('*');
    
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    
    if (tutor_id) {
      query = query.eq('tutor_id', tutor_id);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('scheduled_time', { ascending: true });
    
    if (error) throw error;
    
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, tutor_id, subject, scheduled_time, duration, type, location } = req.body;
    
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        user_id,
        tutor_id,
        subject,
        scheduled_time,
        duration,
        type: type || 'online',
        location
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduled_time, type, location } = req.body;
    
    const { data, error } = await supabaseAdmin
      .from('appointments')
      .update({
        status,
        scheduled_time,
        type,
        location,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

export default router;