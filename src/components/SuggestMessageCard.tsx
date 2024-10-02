import { SVGProps, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Card } from './ui/card';

async function fetchSuggestions() {
    console.log('Fetching suggestions...');
    try {
      const response = await fetch('/api/suggest-messages', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      
      return data.messages[0].split('||').map((msg: string) => msg.trim());
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      return [];
    }
}

export default function SuggestMessageCard() {
    const [messages, setMessages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadSuggestions = async () => {
        setIsLoading(true);
        try {
          const newMessages = await fetchSuggestions();
          console.log('Fetched new messages:', newMessages); 
          setMessages(newMessages);
        } catch (error) {
          console.error("Failed to load suggestions:", error);
        } finally {
          setIsLoading(false);
        }
      };

    const { toast } = useToast();

    const handleCopy = (message: string) => {
        navigator.clipboard.writeText(message);
        toast({
            title: 'Copied to clipboard ✅',
            description: 'Your text has been copied to clipboard',
        });
    };

    useEffect(() => {
        loadSuggestions();
    }, []);

    return (
        <Card className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mb-4 overflow-hidden">
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-center">Suggested Messages</h2>
                <p className="text-muted-foreground">Click the copy button to use one of these suggestions.</p>
            </div>
            <div className="flex justify-center p-4">
                <Button
                    className="border-gray-600 text-white bg-[#212121] rounded-full mb-4 self-center"
                    variant="outline"
                    onClick={loadSuggestions}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCcw className="h-4 w-4" />
                    )}
                </Button>
            </div>
            <div className="grid gap-4">
                {messages.map((message, index) => (
                    <div key={index} className="bg-card text-card-foreground rounded-md p-4 flex items-center justify-between">
                        <div className="prose">
                            <p>{message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => handleCopy(message)}>
                                            <CopyIcon className="w-4 h-4" />
                                            <span className="sr-only">Copy</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Copy to clipboard</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function CopyIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
    );
}

function RefreshCcwIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
        </svg>
    );
}

// import { SVGProps, useEffect, useState } from 'react';
// import { useToast } from '@/components/ui/use-toast';
// import { Button } from './ui/button';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
// import { Loader2, RefreshCcw } from 'lucide-react';
// import { Card } from './ui/card';

// const staticMessages = [
//     "What is something that made you smile today?",
//     "If you could have any superpower, what would it be and why?",
//     "What's a book or movie that has had a significant impact on your life?",
//     "Describe a moment when you felt truly accomplished.",
//     "What is a hobby or interest you have that might surprise others?",
//     "If you could travel anywhere in the world, where would you go and why?",
//     "What's a piece of advice you would give to your younger self?",
//     "What do you enjoy most about your favorite season?",
//     "What is a challenge you recently overcame, and how did you do it?",
//     "What's your favorite way to spend a weekend?",
//     "What is one goal you have for the next year?",
//     "Who is someone that inspires you and why?",
//     "What is your favorite memory from childhood?",
//     "If you could have dinner with any historical figure, who would it be and why?",
//     "What is a skill you would love to learn?",
//     "What's your favorite way to relax after a long day?",
//     "Describe a time when you felt proud of yourself.",
//     "What's your favorite quote and why?",
//     "If you could live in any time period, which would it be and why?",
//     "What is something new you tried recently?",
//     "What's the best piece of advice you've ever received?",
//     "What is your favorite thing about your best friend?",
//     "If you could have any animal as a pet, what would it be and why?",
//     "What is something you're looking forward to?",
//     "What's your favorite way to stay active?",
//     "What is a tradition that you cherish?",
//     "If you could switch lives with anyone for a day, who would it be and why?",
//     "What's a dream you've had since you were young?",
//     "What is your favorite way to express creativity?",
//     "What's the most interesting place you've ever visited?",
//     "If you could instantly become an expert in something, what would it be?",
//     "What's your favorite meal to cook and why?",
//     "What do you appreciate most about your family?",
//     "What's a memorable experience you've had with nature?",
//     "What is your favorite holiday and why?",
//     "If you could change one thing about the world, what would it be?",
//     "What's something you're passionate about?",
//     "What is your favorite time of day and why?",
//     "What's the best compliment you've ever received?",
//     "If you could invent something, what would it be?",
//     "What's your favorite way to start the day?",
// ];

// function getRandomMessages() {
//     const shuffled = staticMessages.sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, 3);
// }

// export default function SuggestMessageCard() {
//     const [messages, setMessages] = useState<string[]>([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const loadSuggestions = () => {
//         setIsLoading(true);
//         try {
//             const newMessages = getRandomMessages();
//             console.log('Fetched new messages:', newMessages); 
//             setMessages(newMessages);
//         } catch (error) {
//             console.error("Failed to load suggestions:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const { toast } = useToast();

//     const handleCopy = (message: string) => {
//         navigator.clipboard.writeText(message);
//         toast({
//             title: 'Copied to clipboard ✅',
//             description: 'Your text has been copied to clipboard',
//         });
//     };

//     useEffect(() => {
//         loadSuggestions();
//     }, []);

//     return (
//         <Card className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mb-4 overflow-hidden">
//             <div className="mt-8">
//                 <h2 className="text-2xl font-bold text-center">Suggested Messages</h2>
//                 <p className="text-muted-foreground">Click the copy button to use one of these suggestions.</p>
//             </div>
//             <div className="flex justify-center p-4">
//                 <Button
//                     className="border-gray-600 text-white bg-[#212121] rounded-full mb-4 self-center"
//                     variant="outline"
//                     onClick={() => {
//                         console.log('Refreshing suggestions...');
//                         loadSuggestions();
//                     }}
//                 >
//                     {isLoading ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                         <RefreshCcw className="h-4 w-4" />
//                     )}
//                 </Button>
//             </div>
//             <div className="grid gap-4">
//                 {messages.map((message, index) => (
//                     <div key={index} className="bg-card text-card-foreground rounded-md p-4 flex items-center justify-between">
//                         <div className="prose">
//                             <p>{message}</p>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <TooltipProvider>
//                                 <Tooltip>
//                                     <TooltipTrigger asChild>
//                                         <Button variant="ghost" size="icon" onClick={() => handleCopy(message)}>
//                                             <CopyIcon className="w-4 h-4" />
//                                             <span className="sr-only">Copy</span>
//                                         </Button>
//                                     </TooltipTrigger>
//                                     <TooltipContent>Copy to clipboard</TooltipContent>
//                                 </Tooltip>
//                             </TooltipProvider>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </Card>
//     );
// }

// function CopyIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
//     return (
//         <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
//             <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
//         </svg>
//     );
// }

// function RefreshCcwIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
//     return (
//         <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
//             <path d="M3 3v5h5" />
//             <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
//             <path d="M16 16h5v5" />
//         </svg>
//     );
// }