import React from 'react';
import { Spinner } from "@heroui/spinner";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">
      <Spinner classNames={{label: "text-foreground mt-4"}} label="Loading" variant="gradient" />
    </div>
  );
};

export default LoadingSpinner;
