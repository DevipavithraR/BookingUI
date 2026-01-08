import { motion } from "framer-motion";
import PropTypes from "prop-types";

const NeonLoader = ({ text = "Loading", size = "medium" }) => {
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-16 h-16",
    large: "w-24 h-24"
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg"
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          className={`rounded-full border-2 border-transparent border-t-blue-500 ${sizeClasses[size]}`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Inner rotating ring - opposite direction */}
        <motion.div
          className={`absolute inset-0 rounded-full border-2 border-transparent border-b-purple-500 ${sizeClasses[size]}`}
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        </div>
      </div>
      
      {text && (
        <motion.p
          className={`mt-4 ${textSizes[size]} text-gray-600 font-medium`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

NeonLoader.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"])
};

export default NeonLoader;