import Button from "./Button";
import { Users2, Zap } from "lucide-react";

function Hero() {
  return (
    <section className="container flex flex-col items-center text-center py-24">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold">
          Connect. Collaborate.{" "}
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent">
            Create.
          </span>
        </h1>
        <p className="max-w-[700px] text-muted-foreground">
          Find your perfect coding buddy, collaborate on projects, and grow together.
        </p>
      </div>
      <div className="flex gap-2 mt-4">
        <Button size="lg" className="gap-2">
          <Users2 className="h-4 w-4" />
          Find Buddies
        </Button>
        <Button size="lg" variant="outline" className="gap-2">
          <Zap className="h-4 w-4" />
          Explore Projects
        </Button>
      </div>
    </section>
  );
}

export default Hero;
