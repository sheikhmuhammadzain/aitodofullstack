import React, { useState } from 'react';
import { supabase } from '../supabase';
import { LogIn, UserPlus, CheckSquare, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'AI-Powered Task Management',
    'Beautiful Dark Mode',
    'Real-time Updates',
    'Smart Task Categories'
  ];

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-2">
        {/* Left side - Hero Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-black p-3 shadow-[0_8px_16px_rgba(0,0,0,0.2)] dark:bg-white dark:shadow-[0_8px_16px_rgba(255,255,255,0.1)]"
            >
              <CheckSquare className="h-8 w-8 text-white dark:text-black" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-black via-gray-900 to-black bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:via-gray-100 dark:to-white sm:text-4xl"
            >
              TaskMaster
            </motion.h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            Experience the future of task management with AI-powered organization and elegant design.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 180 }}
                  className="rounded-full bg-black/5 p-1 dark:bg-white/5"
                >
                  <Sparkles className="h-4 w-4 text-black dark:text-white" />
                </motion.div>
                <span className="text-gray-600 dark:text-gray-300">{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - Auth Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:bg-black dark:shadow-[0_8px_24px_rgba(255,255,255,0.08)]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? 'signup' : 'signin'}
                initial={{ opacity: 0, x: isSignUp ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isSignUp ? -100 : 100 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {isSignUp ? 'Create your account' : 'Welcome back'}
                </h2>
                
                <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                  <div className="space-y-4">
                    <motion.div whileHover={{ scale: 1.01 }}>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email address
                      </label>
                      <div className="relative mt-1 rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          required
                          className="block w-full rounded-lg border-0 bg-gray-50 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-black dark:bg-black dark:text-white dark:ring-white/10 dark:placeholder:text-gray-500 dark:focus:ring-white/30"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.01 }}>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </label>
                      <div className="relative mt-1 rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          id="password"
                          type="password"
                          required
                          className="block w-full rounded-lg border-0 bg-gray-50 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-black dark:bg-black dark:text-white dark:ring-white/10 dark:placeholder:text-gray-500 dark:focus:ring-white/30"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </motion.div>
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all hover:bg-black/90 hover:shadow-xl hover:shadow-black/20 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 dark:bg-white dark:text-black dark:shadow-white/20 dark:hover:bg-white/90 dark:focus:ring-white"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 rounded-full border-2 border-white border-t-transparent dark:border-black dark:border-t-transparent"
                        />
                      ) : (
                        <>
                          {isSignUp ? (
                            <>
                              <UserPlus className="h-4 w-4" />
                              Create Account
                            </>
                          ) : (
                            <>
                              <LogIn className="h-4 w-4" />
                              Sign In
                            </>
                          )}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </motion.div>
                </form>
              </motion.div>
            </AnimatePresence>
            
            <motion.div 
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
              className="bg-gray-50 px-8 py-4 dark:bg-white/5"
            >
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-center text-sm font-medium text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}