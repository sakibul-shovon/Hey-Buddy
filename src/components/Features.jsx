import { Users, Code2, MessageSquare, Rocket, Trophy, Calendar, Layout, Shield } from "lucide-react";

const features = [
  { title: "Find Teammates", description: "AI-powered matching", Icon: Users },
  { title: "Collaboration Hub", description: "Project coordination", Icon: Code2 },
  { title: "Help Forum", description: "Mentor access", Icon: MessageSquare },
  { title: "MicroProjects", description: "Instant chat", Icon: Rocket },
  { title: "Gamification", description: "Achievements", Icon: Trophy },
  { title: "Event Management", description: "Hackathons", Icon: Calendar },
  { title: "Personalized Dashboard", description: "Activity summaries", Icon: Layout },
  { title: "Security First", description: "Advanced security", Icon: Shield },
];

function Features() {
  return (
    <section id="features" className="container py-24">
      <h2 className="text-3xl font-bold text-center">Powerful Features</h2>
      <div className="grid gap-8 py-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {features.map(({ title, description, Icon }) => (
          <div key={title} className="rounded-lg border p-4 hover:shadow-lg">
            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
