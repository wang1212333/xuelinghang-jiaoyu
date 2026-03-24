import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { search, category, university, subject } = req.query;
    
    let query = supabaseAdmin.from('tutors').select('*').eq('is_active', true);
    
    if (university) {
      query = query.ilike('university', `%${university}%`);
    }
    
    if (subject) {
      query = query.contains('subjects', [subject]);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    let tutors = data || [];
    
    if (search) {
      const searchLower = (search as string).toLowerCase();
      tutors = tutors.filter(t => 
        t.name.toLowerCase().includes(searchLower) ||
        t.university.toLowerCase().includes(searchLower) ||
        t.subjects.some((s: string) => s.toLowerCase().includes(searchLower))
      );
    }
    
    if (category) {
      tutors = tutors.filter(t => t.categories.includes(category));
    }
    
    res.json(tutors);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabaseAdmin
      .from('tutors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching tutor:', error);
    res.status(500).json({ error: 'Failed to fetch tutor' });
  }
});

router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabaseAdmin
      .from('tutors')
      .select('parent_feedback')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json(data?.parent_feedback || []);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

export default router;