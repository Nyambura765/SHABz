interface GameCardProps {
    name: string;
    reward: string;
    participants: number;
    endTime: string;
    description: string;
    image: string;
  }
  export const GameCard = ({
    name,
    reward,
    participants,
    endTime,
    description,
    image,
  }: GameCardProps) => {
    return (
      <div className="card-hover relative overflow-hidden rounded-xl bg-card/50 backdrop-blur-sm 
                      border border-gray-800 p-4">
        <div className="aspect-video overflow-hidden rounded-lg mb-4">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{name}</h3>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
            <span className="px-3 py-1 text-sm rounded-full bg-neon-cyan/10 text-neon-cyan">
              {reward}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{participants.toLocaleString()} participants</span>
            <span>Ends in {endTime}</span>
          </div>
          <button className="w-full px-4 py-2 rounded-lg bg-neon-cyan/20 text-neon-cyan 
                           border border-neon-cyan hover:bg-neon-cyan/30 transition-colors">
            Join Game
          </button>
        </div>
      </div>
    );
  };
  