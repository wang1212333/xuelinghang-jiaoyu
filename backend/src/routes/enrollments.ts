import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { user_id, course_id, status } = req.query;
    
    let query = supabaseAdmin.from('enrollments').select('*, courses(*)');
    
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    
    if (course_id) {
      query = query.eq('course_id', course_id);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, course_id } = req.body;
    
    const { data: existing } = await supabaseAdmin
      .from('enrollments')
      .select('id')
      .eq('user_id', user_id)
      .eq('course_id', course_id)
      .single();
    
    if (existing) {
      return res.status(400).json({ error: 'Already enrolled' });
    }
    
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .insert({
        user_id,
        course_id,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabaseAdmin
      .from('enrollments')
      .update({ status: 'cancelled' })
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    console.error('Error cancelling enrollment:', error);
    res.status(500).json({ error: 'Failed to cancel enrollment' });
  }
});

export default router;