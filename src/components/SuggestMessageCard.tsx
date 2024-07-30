import { SVGProps, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Loader2, RefreshCcw } from 'lucide-react';
import { Card } from './ui/card';

async function fetchSuggestions() {
    console.log('Fetching suggestions...');
    try {
      const response = await fetch('/api/suggest-messages');
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      console.log('Fetched suggestions:', data.messages);
      return data.messages;
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    }
  }
  

export default function SuggestMessageCard() {
    const [messages, setMessages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadSuggestions = async () => {
        try {
          const newMessages = await fetchSuggestions();
          console.log('Fetched new messages:', newMessages); 
          setMessages(newMessages);
        } catch (error) {
          console.error("Failed to load suggestions:", error);
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
                    onClick={async () => {
                        console.log('Refreshing suggestions...');
                        setIsLoading(true);
                        await loadSuggestions();
                        setIsLoading(false);
                    }}
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