'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!newEmail) {
      setError('Please enter a new email address');
      return;
    }

    if (!newEmail.includes('@')) {
      setError('Please enter a valid email address');
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
    } catch (err: any) {
      setError(err.message || 'Failed to change email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNewEmail('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-geist text-xl font-semibold">Change email address</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md hover:bg-gray-100"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="font-geist text-sm text-gray-500 mt-2">
            Enter your new email address. We'll send a confirmation link to verify the change.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="new-email" className="font-geist text-sm font-medium text-gray-700">
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
              className="font-geist"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !newEmail}
              className="font-geist bg-black text-white hover:bg-gray-800"
            >
              {isLoading ? 'Changing...' : 'Change email address'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}