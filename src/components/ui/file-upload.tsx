import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { IconUpload, IconCamera } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange && onChange(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-bold text-foreground text-lg mb-2">
            Upload Your Photo
          </p>
          <p className="relative z-20 font-normal text-muted-foreground text-base mb-6">
            Drag & drop your photo here or click to upload / take a selfie
          </p>
          <div className="relative w-full mt-6 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-card flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-lg border border-border",
                    "shadow-festival"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-foreground truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm bg-primary text-primary-foreground"
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </motion.p>
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-muted-foreground">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-2 py-1 rounded-md bg-muted text-muted-foreground"
                    >
                      {file.type}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-xs"
                    >
                      uploaded {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-glow z-40 bg-card flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-lg border border-border",
                  "shadow-festival transition-all duration-300"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-primary flex flex-col items-center gap-2"
                  >
                    Drop it here!
                    <IconUpload className="h-6 w-6 text-primary" />
                  </motion.p>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <IconCamera className="h-6 w-6 text-primary" />
                    <IconUpload className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-primary inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-lg"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-muted shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-background/50"
                  : "bg-background/50 shadow-[0px_0px_1px_1px_rgba(255,255,255,0.1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}