import { Button } from "components/ui/button";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-screen">
      <h1 className="text-4xl font-bold">Review slides effortlessly</h1>
      <p className="max-w-200px"> Our solution generates a Khan Academy style video using any pdf (such as your lecture notes, or slides), allowing you to easily review or learn content.</p>
      <Button onClick={() => {router.push("/application")}}>Start</Button>
    </div>
  );
}
