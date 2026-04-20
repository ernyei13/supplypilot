'use client';

import { useState, FormEvent } from 'react';
import { X, Sparkles, CheckCircle } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export default function FakeDoorModal({ onClose }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    // In production: POST to /api/waitlist
    console.log('Waitlist signup:', email);
    setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface-card rounded-2xl overflow-hidden shadow-2xl border border-blue-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <div className="flex justify-end p-4 pb-0">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-7 pt-2 text-center">
          {!submitted ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-500/30">
                  <Sparkles size={32} className="text-white" />
                </div>
              </div>

              <h2 className="text-white font-extrabold text-xl mb-2 leading-tight">
                AI Copilot is in Closed Beta!
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                We are fine-tuning our AI to automatically contact backup suppliers and compare
                real-time pricing.{' '}
                <span className="text-white font-medium">
                  Join the waitlist to get 1 month free when we launch.
                </span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full bg-surface-input text-white placeholder-gray-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent text-center"
                />
                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3.5 rounded-xl transition-colors text-sm active:scale-95"
                >
                  Join Waitlist
                </button>
              </form>

              <p className="text-gray-600 text-xs mt-4">No credit card. No spam. Ever.</p>
            </>
          ) : (
            <div className="py-4">
              <div className="flex justify-center mb-4">
                <CheckCircle size={52} className="text-green-400" />
              </div>
              <h2 className="text-white font-extrabold text-xl mb-2">You&apos;re on the list! 🎉</h2>
              <p className="text-gray-400 text-sm">
                We&apos;ll reach out to{' '}
                <span className="text-blue-400 font-medium">{email}</span> as soon as AI Copilot is
                ready.
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
