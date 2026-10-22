import { supabase, isSupabaseConfigured } from './supabaseClient';
import { ProblemModel } from '../types/problemTypes';

interface StoredProblemRow {
  id: string;
  problem_data: ProblemModel;
  title: string;
  category: string;
  published: boolean;
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
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export async function publishCustomProblem(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Kết nối cơ sở dữ liệu chưa sẵn sàng.' };
  }
  try {
    const { error } = await supabase.from('custom_problems').update({ published: true }).eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export async function unpublishCustomProblem(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Kết nối cơ sở dữ liệu chưa sẵn sàng.' };
  }
  try {
    const { error } = await supabase.from('custom_problems').update({ published: false }).eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
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
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export type { StoredProblemRow };
