import { supabase, isSupabaseConfigured } from './supabaseClient';
import { ProblemModel } from '../types/problemTypes';

interface StoredProblemRow {
  id: string;
  problem_data: ProblemModel;
  title: string;
  category: string;
  created_at: string;
}

const LOCAL_STORAGE_KEY = 'math_custom_problems_v1';

function getLocalProblems(): ProblemModel[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed to read from localStorage:', err);
    return [];
  }
}

function saveLocalProblems(problems: ProblemModel[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(problems));
    }
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}

export async function loadCustomProblems(): Promise<ProblemModel[]> {
  const localList = getLocalProblems();

  if (!isSupabaseConfigured || !supabase) {
    return localList;
  }

  try {
    const { data, error } = await supabase
      .from('custom_problems')
      .select('problem_data')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Failed to load custom problems from Supabase, using local:', error.message);
      return localList;
    }

    if (!data || data.length === 0) return localList;

    const remoteProblems = data
      .map((row) => (row as { problem_data: ProblemModel }).problem_data)
      .filter(Boolean);

    const remoteIds = new Set(remoteProblems.map((p) => p.id));
    const merged = [...remoteProblems, ...localList.filter((p) => !remoteIds.has(p.id))];
    saveLocalProblems(merged);
    return merged;
  } catch (err) {
    console.warn('Supabase fetch failed, fallback to local:', err);
    return localList;
  }
}

export async function saveCustomProblem(problem: ProblemModel): Promise<{ success: boolean; error?: string }> {
  const localList = getLocalProblems();
  const index = localList.findIndex((p) => p.id === problem.id);
  if (index >= 0) {
    localList[index] = problem;
  } else {
    localList.unshift(problem);
  }
  saveLocalProblems(localList);

  if (!isSupabaseConfigured || !supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase.from('custom_problems').upsert({
      id: problem.id,
      problem_data: problem,
      title: problem.title,
      category: problem.category,
    });

    if (error) {
      console.warn('Failed to sync to Supabase (saved locally):', error.message);
      return { success: true };
    }
    return { success: true };
  } catch (err: unknown) {
    console.warn('Supabase save error (saved locally):', err);
    return { success: true };
  }
}

export async function deleteCustomProblem(id: string): Promise<{ success: boolean; error?: string }> {
  const localList = getLocalProblems().filter((p) => p.id !== id);
  saveLocalProblems(localList);

  if (!isSupabaseConfigured || !supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase.from('custom_problems').delete().eq('id', id);
    if (error) {
      console.warn('Failed to delete from Supabase (deleted locally):', error.message);
      return { success: true };
    }
    return { success: true };
  } catch (err: unknown) {
    console.warn('Supabase delete error (deleted locally):', err);
    return { success: true };
  }
}

export type { StoredProblemRow };
