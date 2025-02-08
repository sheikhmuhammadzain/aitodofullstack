import React, { useState } from 'react';
import { supabase } from '../supabase';
import { ChevronDown, LogOut, User, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-black/80 dark:shadow-[0_4px_12px_rgba(255,255,255,0.06)]"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <div className="flex h-14 items-center justify-between">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <CheckSquare className="h-7 w-7 text-black dark:text-white" />
              </motion.div>
              <motion.span 
                className="ml-2 text-lg font-semibold text-black dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                TaskMaster
              </motion.span>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center rounded-lg bg-white px-2 py-1.5 text-sm font-medium text-black shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-inset ring-gray-200 transition-colors hover:bg-gray-50 dark:bg-black dark:text-white dark:shadow-[0_2px_8px_rgba(255,255,255,0.04)] dark:ring-white/10 dark:hover:bg-white/5"
              >
                <User className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{user.email}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="ml-2 h-4 w-4" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm dark:bg-black/40"
                      onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 z-20 mt-1 w-48 origin-top-right overflow-hidden rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:bg-black dark:shadow-[0_4px_12px_rgba(255,255,255,0.06)] dark:ring-white/10"
                    >
                      <motion.button
                        whileHover={{ x: 4 }}
                        onClick={handleSignOut}
                        className="flex w-full items-center px-3 py-2 text-sm text-black transition-colors hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </motion.button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}