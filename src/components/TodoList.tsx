import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Plus, Trash2, Check, Wand2, Calendar, Tag, AlertTriangle, Sparkles, ChevronDown, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TodoList({ user }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [rewritingId, setRewritingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');

  const categories = ['personal', 'work', 'shopping', 'health'];
  const priorities = ['low', 'medium', 'high'];

  useEffect(() => {
    fetchTodos();
  }, [user, selectedCategory]);

  const fetchTodos = async () => {
    try {
      let query = supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const { error } = await supabase.from('todos').insert([
        {
          user_id: user.id,
          content: newTodo.trim(),
          category,
          priority,
          due_date: dueDate || null,
        },
      ]);

      if (error) throw error;
      setNewTodo('');
      setDueDate('');
      setPriority('medium');
      setCategory('personal');
      fetchTodos();
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleTodo = async (id, is_completed) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_completed: !is_completed })
        .eq('id', id);

      if (error) throw error;
      fetchTodos();
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase.from('todos').delete().eq('id', id);
      if (error) throw error;
      fetchTodos();
    } catch (error) {
      alert(error.message);
    }
  };

  const rewriteTask = async (id, currentContent) => {
    setRewritingId(id);
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful assistant that rewrites todo tasks to be more clear and actionable. Keep the rewritten task concise but specific. Rewrite this todo task: "${currentContent}"`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const rewrittenTask = data.candidates[0].content.parts[0].text
        .trim()
        .replace(/^["']|["']$/g, '')
        .replace(/^Rewritten task: /, '');

      const { error } = await supabase
        .from('todos')
        .update({ content: rewrittenTask })
        .eq('id', id);

      if (error) throw error;
      fetchTodos();
    } catch (error) {
      console.error('Error in rewriteTask:', error);
      alert(`Error rewriting task: ${error.message}`);
    } finally {
      setRewritingId(null);
    }
  };

  const getSuggestion = async () => {
    setShowSuggestion(true);
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Based on these existing todos: "${todos.map(t => t.content).join(', ')}", suggest a new related task that would be helpful to add. Keep it concise and specific.`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 100,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to get suggestion');
      const data = await response.json();
      setAiSuggestion(data.candidates[0].content.parts[0].text.trim());
    } catch (error) {
      console.error('Error getting suggestion:', error);
      setAiSuggestion('Failed to get suggestion');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-gray-600 dark:text-white">Loading...</div>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-blue-50 text-blue-600 ring-blue-500/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20',
      medium: 'bg-yellow-50 text-yellow-600 ring-yellow-500/10 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/20',
      high: 'bg-red-50 text-red-600 ring-red-500/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20'
    };
    return colors[priority] || colors.medium;
  };

  const getCategoryColor = (category) => {
    const colors = {
      personal: 'bg-purple-50 text-purple-600 ring-purple-500/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/20',
      work: 'bg-indigo-50 text-indigo-600 ring-indigo-500/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/20',
      shopping: 'bg-emerald-50 text-emerald-600 ring-emerald-500/10 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20',
      health: 'bg-rose-50 text-rose-600 ring-rose-500/10 dark:bg-rose-400/10 dark:text-rose-400 dark:ring-rose-400/20'
    };
    return colors[category] || colors.personal;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl px-2 py-4"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-4 overflow-hidden rounded-lg bg-white p-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-gray-900/5 dark:bg-black dark:shadow-[0_4px_12px_rgba(255,255,255,0.06)] dark:ring-white/10"
      >
        <form onSubmit={addTodo} className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1 rounded-lg border-0 bg-gray-50 px-3 py-2 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-900 dark:bg-black dark:text-white dark:ring-white/10 dark:placeholder:text-gray-400 dark:focus:ring-white/30"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-white/90 dark:focus:ring-white sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </motion.button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="group relative rounded-lg bg-gray-50 px-3 py-2 ring-1 ring-inset ring-gray-200 transition-shadow hover:shadow-md dark:bg-black dark:ring-white/10"
            >
              <label className="block text-xs font-medium text-gray-500 dark:text-white/70">
                Due Date
              </label>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-gray-400 dark:text-white/50" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="block w-full border-0 bg-transparent p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:text-white dark:placeholder:text-white/50 sm:text-sm"
                />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="group relative rounded-lg bg-gray-50 px-3 py-2 ring-1 ring-inset ring-gray-200 transition-shadow hover:shadow-md dark:bg-black dark:ring-white/10"
            >
              <label className="block text-xs font-medium text-gray-500 dark:text-white/70">
                Priority
              </label>
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-gray-400 dark:text-white/50" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="block w-full border-0 bg-transparent p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:text-white dark:placeholder:text-white/50 sm:text-sm [&>option]:text-gray-900"
                >
                  {priorities.map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="group relative rounded-lg bg-gray-50 px-3 py-2 ring-1 ring-inset ring-gray-200 transition-shadow hover:shadow-md dark:bg-black dark:ring-white/10"
            >
              <label className="block text-xs font-medium text-gray-500 dark:text-white/70">
                Category
              </label>
              <div className="flex items-center">
                <Tag className="mr-2 h-4 w-4 text-gray-400 dark:text-white/50" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full border-0 bg-transparent p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:text-white dark:placeholder:text-white/50 sm:text-sm [&>option]:text-gray-900"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          </div>
        </form>
      </motion.div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-2"
        >
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border-0 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-inset ring-gray-200 transition-colors hover:bg-gray-50 dark:bg-black dark:text-white dark:shadow-[0_2px_8px_rgba(255,255,255,0.04)] dark:ring-white/10 dark:hover:bg-white/5 sm:w-auto [&>option]:text-gray-900"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={getSuggestion}
          className="inline-flex w-full items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-inset ring-gray-200 transition-colors hover:bg-gray-50 dark:bg-black dark:text-white dark:shadow-[0_2px_8px_rgba(255,255,255,0.04)] dark:ring-white/10 dark:hover:bg-white/5 sm:w-auto"
        >
          <Sparkles className="mr-2 h-4 w-4 text-gray-500 dark:text-white/70" />
          Get AI Suggestion
        </motion.button>
      </div>

      <AnimatePresence>
        {showSuggestion && aiSuggestion && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 overflow-hidden rounded-lg bg-gradient-to-r from-black via-black to-black shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.08)] dark:ring-1 dark:ring-white/10"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-white" />
                  <h3 className="text-base font-semibold leading-6 text-white">
                    AI Suggestion
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSuggestion(false)}
                  className="rounded-full p-1 text-white/70 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              <div className="mt-2 text-sm text-white/70">
                {aiSuggestion}
              </div>
              <div className="mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setNewTodo(aiSuggestion);
                    setShowSuggestion(false);
                  }}
                  className="inline-flex items-center text-sm font-semibold text-white hover:text-white/90"
                >
                  Use this suggestion
                  <ChevronDown className="ml-1 h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        layout
        className="space-y-2"
      >
        <AnimatePresence mode="popLayout">
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              whileHover={{ scale: 1.01 }}
              className="group relative overflow-hidden rounded-lg bg-white p-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-gray-900/5 transition-all hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] dark:bg-black dark:shadow-[0_4px_12px_rgba(255,255,255,0.06)] dark:ring-white/10 dark:hover:shadow-[0_6px_16px_rgba(255,255,255,0.08)]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleTodo(todo.id, todo.is_completed)}
                  className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
                    todo.is_completed
                      ? 'border-white bg-white text-black dark:border-white dark:bg-white dark:text-black'
                      : 'border-gray-300 dark:border-white/30'
                  }`}
                >
                  {todo.is_completed && <Check className="h-4 w-4" />}
                </motion.button>
                
                <div className="flex-1 space-y-1">
                  <p
                    className={`text-base text-gray-900 dark:text-white ${
                      todo.is_completed ? 'line-through opacity-50' : ''
                    }`}
                  >
                    {todo.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {todo.due_date && (
                      <span className="inline-flex items-center rounded-md bg-black/5 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 dark:bg-white/5 dark:text-white/70 dark:ring-white/10">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(todo.due_date).toLocaleDateString()}
                      </span>
                    )}
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityColor(todo.priority)}`}>
                      {todo.priority}
                    </span>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getCategoryColor(todo.category)}`}>
                      {todo.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => rewriteTask(todo.id, todo.content)}
                    disabled={rewritingId === todo.id}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-50 hover:text-black dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white disabled:opacity-50"
                    title="Rewrite with AI"
                  >
                    <Wand2 className={`h-4 w-4 ${rewritingId === todo.id ? 'animate-pulse' : ''}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTodo(todo.id)}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-50 hover:text-red-600 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {todos.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-lg bg-white py-8 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-gray-900/5 dark:bg-black dark:shadow-[0_4px_12px_rgba(255,255,255,0.06)] dark:ring-white/10"
          >
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                transition: { 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="rounded-full bg-gray-100 p-3 dark:bg-white/5"
            >
              <ChevronDown className="h-6 w-6 text-gray-400 dark:text-white/50" />
            </motion.div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-white/70">
              Get started by creating a new task above
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}