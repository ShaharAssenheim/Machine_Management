import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  status?: string;
  imageUrl?: string;
  scale?: number;
}

const MachineIllustration: React.FC<Props> = ({ scale = 1 }) => {
  return (
    <motion.img 
      src="/src/assets/ONYX-3000.png"
      alt="Machine Unit" 
      className="object-contain max-w-[70%] max-h-full mx-auto block"
      style={{ transform: `scale(${scale})` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: scale * 1.05 }}
    />
  );
};

export default MachineIllustration;