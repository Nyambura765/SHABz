import { Card, CardContent } from "../components/ui/card";

const steps = [
  {
    title: "Create Your Token",
    description: "Design and launch your custom token with just a few clicks.",
    forCreators: true,
  },
  {
    title: "Set Up Rewards",
    description: "Define exclusive benefits for your token holders.",
    forCreators: true,
  },
  {
    title: "Purchase Tokens",
    description: "Support your favorite creators by buying their tokens.",
    forCreators: false,
  },
  {
    title: "Access Benefits",
    description: "Enjoy exclusive content and experiences as a token holder.",
    forCreators: false,
  },
];

export const HowItWorks = () => {
  return (
    <div className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-shabz-purple/5" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-teal-700 bg-clip-text ">
            How SHABz Works
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Simple steps to start your tokenized creator journey
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-shabz-purple">For Creators</h3>
            {steps
              .filter((step) => step.forCreators)
              .map((step, index) => (
                <Card key={step.title} className="mb-4 bg-shabz-gray/30  backdrop-blur-sm  transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-shabz-purple text-white font-semibold">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                        <p className="mt-1 text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-shabz-purple">For Fans</h3>
            {steps
              .filter((step) => !step.forCreators)
              .map((step, index) => (
                <Card key={step.title} className="mb-4 bg-shabz-gray/30 border-shabz-purple/20 backdrop-blur-sm hover:border-shabz-purple/40 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-shabz-purple text-white font-semibold">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                        <p className="mt-1 text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};