import { supabase } from './supabaseClient';
import { ProblemModel } from '../types/problemTypes';

interface StoredProblemRow {
  id: string;
  problem_data: ProblemModel;
  title: string;
  category: string;
  created_at: string;
}

export async function loadCustomProblems(): Promise<ProblemModel[]> {
  const { data, error } = await supabase
    .from('custom_problems')
    .select('problem_data')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load custom problems:', error.message);
    return [];
  }

  if (!data || data.length === 0) return [];
  return data.map((row) => (row as { problem_data: ProblemModel }).problem_data).filter(Boolean);
}

export async function saveCustomProblem(problem: ProblemModel): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('custom_problems').upsert({
    id: problem.id,
    problem_data: problem,
    title: problem.title,
    category: problem.category,
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function deleteCustomProblem(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('custom_problems').delete().eq('id', id);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export type { StoredProblemRow };
