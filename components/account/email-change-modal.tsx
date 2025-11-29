'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onChangeEmail: (newEmail: string) => Promise<void>;
}

export function EmailChangeModal({ isOpen, onClose, currentEmail, onChangeEmail }: EmailChangeModalProps) {
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setNewEmail('');
    setError('');
    onClose();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'Enter' && !isLoading) {
        e.preventDefault();
        handleButtonClick();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, newEmail, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!newEmail || !newEmail.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }

    if (newEmail === currentEmail) {
      setError('New email must be different from current email');
      return;
    }

    setIsLoading(true);
    try {
      await onChangeEmail(newEmail);
      onClose();
      setNewEmail('');
    } catch (err) {
      setError((err as Error).message || 'Failed to change email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (!newEmail || !newEmail.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    const form = document.getElementById('email-change-form') as HTMLFormElement;
    if (form) form.requestSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-geist text-xl font-semibold">Change email address</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md hover:bg-gray-100 -mt-2 -mr-2"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form id="email-change-form" onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="new-email" className="font-geist text-[12px] font-medium" style={{ color: '#0000008c', fontWeight: 500 }}>
              New Email Address
            </Label>
            <Input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              className="font-geist"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500 font-geist">{error}</p>
            )}
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="font-geist flex items-center gap-2"
            >
              <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono">ESC</span>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleButtonClick}
              disabled={isLoading}
              className="font-geist bg-black text-white hover:bg-gray-800 flex items-center gap-2"
            >
              {isLoading ? 'Changing...' : (
                <>
                  Change email address
                  <span className="text-xs px-1.5 py-0.5 rounded bg-white/20 font-mono">↵</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}