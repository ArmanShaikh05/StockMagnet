"use client";

import { motion } from "framer-motion";
import { PackageX, Plus } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const EmptyInventory = () => {
  const onCreate = () => {
    console.log("Create button clicked");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center h-[70vh] text-center px-6"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
        className="bg-[#fff3ec] p-8 rounded-2xl shadow-xl border border-dashed border-[#ff895b] max-w-md"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
          className="text-[#ff895b] mb-4"
        >
          <PackageX className="sm:w-16 sm:h-16 w-12 h-12 mx-auto" />
        </motion.div>

        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-2">
          No Products Available
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Your inventory looks empty. Add your first product to start tracking
          items.
        </p>

        <Button onClick={onCreate}>
          <Plus className="w-5 h-5" />
          Add Product
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EmptyInventory;
