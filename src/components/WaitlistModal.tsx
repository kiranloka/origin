import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { X, Loader2 } from "lucide-react";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

import logo from "../logo.svg";

export function WaitlistModal({
  open,
  onOpenChange,
  onSuccess,
}: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from("waitlist")
        .insert([{ email }]);

      if (supabaseError) {
        if (supabaseError.code === "23505") {
          setError("This email is already on the waitlist.");
        } else {
          setError(supabaseError.message);
        }
        return;
      }

      onSuccess();
      onOpenChange(false);
      setEmail("");
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Minimalist Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 transition-opacity duration-500" />

        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-[500px] translate-x-[-50%] translate-y-[-50%] bg-white p-12 border border-gray-100 shadow-[20px_20px_60px_rgba(0,0,0,0.05)] focus:outline-none duration-300 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="flex flex-col items-center">
            {/* The Logo */}
            <div className="mb-4">
              <img src={logo} alt="Origin Logo" className="h-[42px] w-auto" />
            </div>

            <span className="text-[#BE381C] font-serif tracking-[0.3em] text-xs uppercase mb-4">
              Origin
            </span>

            <Dialog.Title className="font-serif text-3xl text-gray-900 text-center leading-tight">
              Where intent becomes <br /> executable.
            </Dialog.Title>

            <Dialog.Description className="mt-6 text-gray-500 text-center font-serif italic text-sm max-w-[280px] leading-relaxed">
              Join the waitlist for early access to the future of software
              description.
            </Dialog.Description>
          </div>

          <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            <div className="relative group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full border-b border-gray-300 py-3 text-lg font-serif outline-none transition-colors focus:border-[#BE381C] placeholder:text-gray-300 bg-transparent disabled:opacity-50"
              />
              {error && (
                <p className="absolute -bottom-6 left-0 text-xs font-serif text-[#BE381C]">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-[#BE381C] py-4 text-white font-serif tracking-widest uppercase text-xs transition-all hover:bg-black active:bg-[#BE381C] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="mx-auto size-4 animate-spin" />
              ) : (
                "Request Access"
              )}
            </button>
          </form>

          {/* Minimalist Close */}
          <Dialog.Close asChild>
            <button
              className="absolute right-8 top-8 text-gray-300 transition-colors hover:text-[#BE381C]"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
