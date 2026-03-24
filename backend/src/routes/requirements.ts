import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { user_id, status } = req.query;
    
    let query = supabaseAdmin.from('requirements').select('*');
    
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching requirements:', error);
    res.status(500).json({ error: 'Failed to fetch requirements' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, grade, subjects, gender, school_bg, time_slot, budget, details } = req.body;
    
    const { data, error } = await supabaseAdmin
      .from('requirements')
      .insert({
        user_id,
        grade,
        subjects,
        gender: gender || '不限',
        school_bg: school_bg || '不限',
        time_slot,
        budget,
        details
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating requirement:', error);
    res.status(500).json({ error: 'Failed to create requirement' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, subjects, gender, school_bg, time_slot, budget, details, status } = req.body;
    
    const { data, error } = await supabaseAdmin
      .from('requirements')
      .update({
        grade,
        subjects,
        gender,
        school_bg,
        time_slot,
        budget,
        details,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error updating requirement:', error);
    res.status(500).json({ error: 'Failed to update requirement' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabaseAdmin
      .from('requirements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting requirement:', error);
    res.status(500).json({ error: 'Failed to delete requirement' });
  }
});

export default router;