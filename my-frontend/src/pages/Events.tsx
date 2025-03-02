import { Calendar, MapPin,  Music, Users, Mic, Filter, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Navbar } from "../components/Navbar";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  type: "concert" | "meetup" | "workshop";
  image: string;
  creator: string;
}

const events: Event[] = [
  {
    id: "1",
    title: "Digital Art Live Performance",
    description: "Join us for an incredible live digital art creation session with top creators showcasing their techniques and stories.",
    date: new Date("2024-04-15T19:00:00"),
    location: "Creative Hub, Downtown",
    type: "workshop",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800",
    creator: "Digital Art Collective"
  },
  {
    id: "2",
    title: "Creator Music Festival",
    description: "A unique music festival featuring independent artists and content creators performing their original tracks.",
    date: new Date("2024-04-20T18:30:00"),
    location: "Skyline Arena",
    type: "concert",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800",
    creator: "Sound Wave Productions"
  },
  {
    id: "3",
    title: "Content Creator Summit",
    description: "Network with fellow creators, share experiences, and learn from industry experts in this exclusive summit.",
    date: new Date("2024-04-25T10:00:00"),
    location: "Tech Convention Center",
    type: "meetup",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800",
    creator: "Creator Network"
  },
  {
    id: "4",
    title: "Virtual Reality Showcase",
    description: "Experience the future of digital content creation with VR technology demonstrations and hands-on sessions.",
    date: new Date("2024-05-05T14:00:00"),
    location: "Innovation Lab",
    type: "workshop",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800",
    creator: "Future Tech Collective"
  }
];

const EventCard = ({ event }: { event: Event }) => {
  const getEventIcon = (type: Event["type"]) => {
    switch (type) {
      case "concert":
        return <Music className="w-5 h-5" />;
      case "meetup":
        return <Users className="w-5 h-5" />;
      case "workshop":
        return <Mic className="w-5 h-5" />;
    }
  };

  const getGradientByType = (type: Event["type"]) => {
    switch (type) {
      case "concert":
        return ;
      case "meetup":
        return ;
      case "workshop":
        return ;
    }
  };

  const getEventTypeBg = (type: Event["type"]) => {
    switch (type) {
      case "concert":
        return ;
      case "meetup":
        return ;
      case "workshop":
        return ;
    }
  };

  return (
    
    
    <div className={`rounded-xl p-6 border border-border/5 hover:border-border/20 transition-all duration-300 animate-fade-up bg-gradient-to-b ${getGradientByType(event.type)} hover:translate-y-[-4px] group`}>
      <div className="aspect-video rounded-lg overflow-hidden mb-4 relative">
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 z-10">
          <button className="px-4 py-2 bg-black backdrop-blur-sm rounded-lg text-white border border-white/20 flex items-center gap-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            View Details <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm px-3 py-1 rounded-full flex items-center gap-1.5 ${getEventTypeBg(event.type)}`}>
            {getEventIcon(event.type)}
            <span className="capitalize">{event.type}</span>
          </span>
          <span className="text-xs text-gray-400 px-2 py-1 bg-white/5 rounded-full ml-auto">
            {format(event.date, "MMM d")}
          </span>
        </div>
        <h3 className="text-xl font-semibold group-hover:text-white transition-colors duration-300">{event.title}</h3>
        <p className="text-gray-400 line-clamp-2">{event.description}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{format(event.date, "h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        <div className="pt-4 border-t border-border/5 flex items-center justify-between">
          <p className="text-sm text-gray-400">By <span className="text-foreground">{event.creator}</span></p>
          <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors cursor-pointer">
            +
          </div>
        </div>
      </div>
    </div>
    
  );
};

const FeaturedEvent = ({ event }: { event: Event }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-12 ">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background z-10"></div>
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 p-8 md:p-12 max-w-2xl">
        <div className="inline-block px-4 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-sm font-medium mb-6">
          Featured Event
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h2>
        <p className="text-gray-400 mb-8 text-lg">{event.description}</p>
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <div className="flex items-center gap-3 text-gray-300">
            <Calendar className="w-5 h-5" />
            <span>{format(event.date, "MMMM d, yyyy 'at' h:mm a")}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <MapPin className="w-5 h-5" />
            <span>{event.location}</span>
          </div>
        </div>
        <button className="px-6 py-3 rounded-lg bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90 transition-colors">
          Register Now
        </button>
      </div>
    </div>
  );
};

const FilterButton = ({ 
  children, 
  active, 
  onClick 
}: { 
  children: React.ReactNode; 
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        active 
          ? "bg-white/10 text-white" 
          : "bg-transparent text-gray-400 hover:bg-white/5"
      )}
    >
      {children}
    </button>
  );
};

const Events = () => {
  const [filter, setFilter] = useState<"all" | "concert" | "meetup" | "workshop">("all");
  
  const filteredEvents = events.filter(event => filter === "all" || event.type === filter);
  const featuredEvent = events[0]; // Using the first event as featured

  return (
    <>
    <Navbar />
    <div className="min-h-screen px-6 py-12 max-w-[1400px] mx-auto">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Upcoming Events</h1>
        <p className="text-gray-400">
          Discover the latest events from your favorite creators, from concerts to workshops
        </p>
      </div>

      <FeaturedEvent event={featuredEvent} />

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex items-center gap-2 mr-2 text-white/80">
          <Filter className="w-4 h-4" />
          <span>Filter:</span>
        </div>
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
          All Events
        </FilterButton>
        <FilterButton active={filter === "concert"} onClick={() => setFilter("concert")}>
          <Music className="w-4 h-4 inline mr-1" />
          Concerts
        </FilterButton>
        <FilterButton active={filter === "meetup"} onClick={() => setFilter("meetup")}>
          <Users className="w-4 h-4 inline mr-1" />
          Meetups
        </FilterButton>
        <FilterButton active={filter === "workshop"} onClick={() => setFilter("workshop")}>
          <Mic className="w-4 h-4 inline mr-1" />
          Workshops
        </FilterButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
    </>
  );
};

export default Events;