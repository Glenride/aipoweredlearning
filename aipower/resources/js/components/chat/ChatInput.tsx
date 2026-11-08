import { useRef, useState, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({
    onSend,
    disabled = false,
    placeholder = 'Type your response...',
}: ChatInputProps) {
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [value]);

    const handleSubmit = () => {
        if (value.trim() && !disabled) {
            onSend(value.trim());
            setValue('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="border-t border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mx-auto max-w-3xl">
                <div className="relative flex items-end gap-3 rounded-xl border border-zinc-700 bg-zinc-800/50 p-3 transition-colors focus-within:border-purple-500/50">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={1}
                        className="max-h-48 flex-1 resize-none bg-transparent font-[JetBrains_Mono] text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none disabled:opacity-50"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={disabled || !value.trim()}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white transition-all hover:from-purple-500 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {disabled ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </button>
                </div>
                <p className="mt-2 text-center font-[JetBrains_Mono] text-xs text-zinc-600">
                    Press <kbd className="rounded bg-zinc-800 px-1.5 py-0.5">Enter</kbd> to send,{' '}
                    <kbd className="rounded bg-zinc-800 px-1.5 py-0.5">Shift+Enter</kbd> for new line
                </p>
            </div>
        </div>
    );
}
