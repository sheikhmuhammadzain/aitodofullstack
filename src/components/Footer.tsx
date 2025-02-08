import React from 'react';
import { Github, Linkedin, Globe, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/sheikhmuhammadzain',
      label: 'GitHub'
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/muhammad-zain-afzal-649209227/',
      label: 'LinkedIn'
    },
    {
      icon: Globe,
      href: 'https://zain-sheikh.vercel.app/',
      label: 'Website'
    }
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-auto border-t border-gray-200 bg-white py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-black dark:shadow-[0_-4px_12px_rgba(255,255,255,0.06)]"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center text-sm text-black dark:text-white"
          >
            Developed with 
            <motion.span
              animate={{ 
                scale: [1, 1.2, 1],
                color: ['#ef4444', '#ec4899', '#ef4444']
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mx-1 inline-block text-red-500"
            >
              <Heart className="h-4 w-4 fill-current" />
            </motion.span>
            by Zain Sheikh
          </motion.p>

          <div className="flex items-center space-x-2">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg p-1.5 text-black transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-white/5"
                >
                  <span className="sr-only">{link.label}</span>
                  <Icon className="h-5 w-5" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </motion.footer>
  );
} 