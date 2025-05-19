
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Users, ClipboardCheck } from 'lucide-react';

const HomePage = () => {
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-180px)] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="max-w-3xl"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
          Streamline Your Success with <span className="block md:inline">Work Flow</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl mx-auto">
          The ultimate Kanban solution designed to boost productivity and collaboration for your entire team. Manage tasks, track progress, and achieve your goals seamlessly.
        </p>
        <motion.div 
          initial={{ opacity:0, y: 20}} 
          animate={{ opacity:1, y: 0}} 
          transition={{ delay: 0.5, duration:0.5 }}
        >
          <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl px-10 py-7 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
            <Link to="/login">Get Started Now</Link>
          </Button>
        </motion.div>
      </motion.div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {[
          { icon: <Zap className="h-10 w-10 text-pink-400 mb-3" />, title: "Boost Productivity", description: "Visualize your workflow and identify bottlenecks to keep projects moving efficiently." },
          { icon: <Users className="h-10 w-10 text-purple-400 mb-3" />, title: "Enhance Collaboration", description: "Empower admins and employees with clear roles and task visibility for seamless teamwork." },
          { icon: <ClipboardCheck className="h-10 w-10 text-indigo-400 mb-3" />, title: "Track Progress", description: "Monitor task completion and overall project status with intuitive dashboards and reporting." }
        ].map((feature, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={featureVariants}
            initial="hidden"
            animate="visible"
            className="p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl text-left"
          >
            {feature.icon}
            <h3 className="text-2xl font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>
       <div className="mt-16 w-full max-w-5xl">
        <img  class="rounded-xl shadow-2xl object-cover w-full h-auto opacity-80" alt="Abstract Kanban board visualization" src="https://images.unsplash.com/photo-1676580674468-57a4e14b1fa1" />
      </div>
    </div>
  );
};

export default HomePage;

  