/**
 * Frame Your Moments — Supabase & Cloudinary Configuration
 */

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vhbspahnxahzilfgjlsg.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYnNwYWhueGFoemlsZmdqbHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDk2MDUsImV4cCI6MjEwMjUyNTYwNX0.Kedy_ltqJ6u-0MVaEhh8LJx3oaBLEcvTYpod-djxPjY';

export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'vyc9r3kd';
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'frameyourmoments';

/**
 * Lightweight, zero-dependency Supabase REST Client
 * Works flawlessly in all browsers without npm install issues.
 * Synchronous .from(table) returning async query execution methods.
 */
class SupabaseRestClient {
  constructor(url, anonKey) {
    this.url = url.replace(/\/$/, '');
    this.anonKey = anonKey;
    this.headers = {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  from(tableName) {
    const tableUrl = `${this.url}/rest/v1/${tableName}`;
    const headers = { ...this.headers };

    return {
      select: async (query = '*') => {
        try {
          const res = await fetch(`${tableUrl}?select=${query}&order=sort_order.asc,created_at.desc`, {
            headers
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({ status: res.status, text: res.statusText }));
            console.error(`Supabase SELECT error on ${tableName}:`, err);
            return { data: null, error: err };
          }
          const data = await res.json();
          return { data, error: null };
        } catch (error) {
          console.error(`Supabase SELECT network error on ${tableName}:`, error);
          return { data: null, error };
        }
      },

      insert: async (rows) => {
        try {
          const payload = Array.isArray(rows) ? rows : [rows];
          const res = await fetch(tableUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({ status: res.status, text: res.statusText }));
            console.error(`Supabase INSERT error on ${tableName}:`, err);
            return { data: null, error: err };
          }
          const data = await res.json();
          return { data, error: null };
        } catch (error) {
          console.error(`Supabase INSERT network error on ${tableName}:`, error);
          return { data: null, error };
        }
      },

      update: async (updates, matchCol, matchVal) => {
        try {
          const res = await fetch(`${tableUrl}?${matchCol}=eq.${encodeURIComponent(matchVal)}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(updates)
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({ status: res.status, text: res.statusText }));
            console.error(`Supabase UPDATE error on ${tableName}:`, err);
            return { data: null, error: err };
          }
          const data = await res.json();
          return { data, error: null };
        } catch (error) {
          console.error(`Supabase UPDATE network error on ${tableName}:`, error);
          return { data: null, error };
        }
      },

      delete: async (matchCol, matchVal) => {
        try {
          const res = await fetch(`${tableUrl}?${matchCol}=eq.${encodeURIComponent(matchVal)}`, {
            method: 'DELETE',
            headers
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({ status: res.status, text: res.statusText }));
            console.error(`Supabase DELETE error on ${tableName}:`, err);
            return { data: null, error: err };
          }
          return { data: true, error: null };
        } catch (error) {
          console.error(`Supabase DELETE network error on ${tableName}:`, error);
          return { data: null, error };
        }
      },

      upsert: async (row, { onConflict } = {}) => {
        try {
          const payload = Array.isArray(row) ? row : [row];
          const upsertHeaders = {
            ...headers,
            'Prefer': `return=representation,resolution=merge-duplicates`
          };
          let url = tableUrl;
          if (onConflict) {
            url += `?on_conflict=${encodeURIComponent(onConflict)}`;
          }
          const res = await fetch(url, {
            method: 'POST',
            headers: upsertHeaders,
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({ status: res.status, text: res.statusText }));
            console.error(`Supabase UPSERT error on ${tableName}:`, err);
            return { data: null, error: err };
          }
          const data = await res.json();
          return { data, error: null };
        } catch (error) {
          console.error(`Supabase UPSERT network error on ${tableName}:`, error);
          return { data: null, error };
        }
      }
    };
  }
}

export const supabase = new SupabaseRestClient(SUPABASE_URL, SUPABASE_ANON_KEY);
