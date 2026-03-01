"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ProfileAvatarProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export default function ProfileAvatar({
  size = 96,
  className,
  priority = false,
}: ProfileAvatarProps) {
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  if (error) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] text-white font-bold select-none ${className ?? ""}`}
        style={{ width: size, height: size, fontSize: size * 0.3 }}
      >
        IK
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-zoom-in focus:outline-none"
        aria-label="Voir la photo de profil"
      >
        <Image
          src="/images/profile.jpg"
          alt="Issa KANE"
          width={size}
          height={size}
          priority={priority}
          className={`rounded-full object-cover transition-opacity hover:opacity-80 ${className ?? ""}`}
          onError={() => setError(true)}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="relative"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src="/images/profile.jpg"
                alt="Issa KANE"
                width={400}
                height={400}
                className="rounded-2xl object-cover shadow-2xl"
              />
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-3 -right-3 bg-white text-black rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
