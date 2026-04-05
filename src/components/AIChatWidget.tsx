import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/customer-chat`;

type Msg = { role: 'user' | 'assistant'; content: string };

async function streamChat({
    messages,
    onDelta,
    onDone,
    onError,
}: {
    messages: Msg[];
    onDelta: (text: string) => void;
    onDone: () => void;
    onError: (err: string) => void;
}) {
    const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        onError(data.error || 'Something went wrong. Please try again.');
        return;
    }

    if (!resp.body) {
        onError('No response received.');
        return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = '';
    let streamDone = false;

    while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith('\r')) line = line.slice(0, -1);
            if (line.startsWith(':') || line.trim() === '') continue;
            if (!line.startsWith('data: ')) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === '[DONE]') {
                streamDone = true;
                break;
            }

            try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content as string | undefined;
                if (content) onDelta(content);
            } catch {
                textBuffer = line + '\n' + textBuffer;
                break;
            }
        }
    }

    // Final flush
    if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
            if (!raw) continue;
            if (raw.endsWith('\r')) raw = raw.slice(0, -1);
            if (raw.startsWith(':') || raw.trim() === '') continue;
            if (!raw.startsWith('data: ')) continue;
            const jsonStr = raw.slice(6).trim();
            if (jsonStr === '[DONE]') continue;
            try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content as string | undefined;
                if (content) onDelta(content);
            } catch { /* ignore */ }
        }
    }

    onDone();
}

const QUICK_REPLIES = [
    { label: '📄 WAEC Certificate', message: 'I need help with WAEC certificate processing' },
    { label: '🆔 NIN Services', message: 'I need help with NIN registration or correction' },
    { label: '💰 Pricing', message: 'What are your prices?' },
    { label: '📞 Contact Us', message: 'How can I contact you?' },
];

export const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Msg[]>([
        {
            role: 'assistant',
            content: "👋 Welcome to Confidential Connect Ltd! I'm your AI assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleQuickReply = (message: string) => {
        setShowQuickReplies(false);
        setInput(message);
        setTimeout(() => {
            sendMessageWithText(message);
        }, 0);
    };

    const sendMessageWithText = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMsg: Msg = { role: 'user', content: text.trim() };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);
        setShowQuickReplies(false);

        let assistantSoFar = '';

        const upsertAssistant = (chunk: string) => {
            assistantSoFar += chunk;
            setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && prev.length === updatedMessages.length + 1) {
                    return prev.map((m, i) =>
                        i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
                    );
                }
                return [...prev, { role: 'assistant', content: assistantSoFar }];
            });
        };

        try {
            await streamChat({
                messages: updatedMessages.filter((m) => m.content !== messages[0]?.content || m.role !== 'assistant'),
                onDelta: upsertAssistant,
                onDone: () => setIsLoading(false),
                onError: (err) => {
                    setMessages((prev) => [
                        ...prev,
                        { role: 'assistant', content: `Sorry, ${err}` },
                    ]);
                    setIsLoading(false);
                },
            });
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, something went wrong. Please try again or contact us at confidentialconnectltd@gmail.com' },
            ]);
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <div className="fixed bottom-6 right-6 z-50">
                {!isOpen && (
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
                        size="lg"
                    >
                        <MessageCircle className="h-6 w-6" />
                    </Button>
                )}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-4rem)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground rounded-t-2xl">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            <div>
                                <p className="font-semibold text-sm">Confidential Connect</p>
                                <p className="text-xs opacity-80">AI Assistant • Online</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                                        msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                                            : 'bg-muted text-foreground rounded-bl-sm'
                                    }`}
                                >
                                    {msg.role === 'assistant' ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                                        <User className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && messages[messages.length - 1]?.role === 'user' && (
                            <div className="flex gap-2 justify-start">
                                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-4 w-4 text-primary" />
                                </div>
                                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
                                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
                                        <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {showQuickReplies && !isLoading && messages.length === 1 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {QUICK_REPLIES.map((qr) => (
                                    <button
                                        key={qr.label}
                                        onClick={() => handleQuickReply(qr.message)}
                                        className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                                    >
                                        {qr.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-border">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendMessage();
                            }}
                            className="flex gap-2"
                        >
                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your question..."
                                disabled={isLoading}
                                className="flex-1 rounded-full text-sm"
                            />
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isLoading || !input.trim()}
                                className="rounded-full h-10 w-10 p-0"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                        <p className="text-[10px] text-muted-foreground text-center mt-2">
                            Powered by AI • TikTok: @confidential.connect.ltd
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};
