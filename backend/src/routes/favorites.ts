import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    
    let query = supabaseAdmin.from('favorites').select('*, tutors(*)');
    
    if (user_id) {
      query = query.eq('user_id', user_id);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json(data || []);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, tutor_id } = req.body;
    
    const { data, error } = await supabaseAdmin
      .from('favorites')
      .insert({
        user_id,
        tutor_id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

router.delete('/:tutor_id', async (req, res) => {
  try {
    const { tutor_id } = req.params;
    const { user_id } = req.query;
    
    const { error } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('tutor_id', tutor_id)
      .eq('user_id', user_id as string);
    
    if (error) throw error;
    
    res.status(204).send();
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

export default router;