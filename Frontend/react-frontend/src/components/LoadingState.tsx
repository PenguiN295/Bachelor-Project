import { Loader2 } from "lucide-react";

const LoadingState = () => (
  <div className="flex justify-center items-center p-12 w-full h-full min-h-[200px]">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

export default LoadingState;