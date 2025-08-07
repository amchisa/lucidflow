import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  size: number;
  className?: string;
}

export default function LoadingSpinner({
  size,
  className,
}: LoadingSpinnerProps) {
  return <Loader size={size} className={`animate-spin ${className}`} />;
}
