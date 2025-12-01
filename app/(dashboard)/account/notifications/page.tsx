'use client'

import { useState } from 'react';
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Mail, Smartphone } from 'lucide-react';

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  email: boolean;
  app: boolean;
};

export default function NotificationsPage() {
  const [dailyDigest, setDailyDigest] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'mentions',
      title: 'Mentions',
      description: 'Notify me when someone cites me with an @mention in notes or comments.',
      email: false,
      app: false,
    },
    {
      id: 'replies',
      title: 'Replies',
      description: 'Notify me when someone replies to my comments.',
      email: false,
      app: false,
    },
    {
      id: 'email-grants',
      title: 'Email Grants',
      description: 'Notify me of email access requested or when my requests are accepted or denied.',
      email: false,
      app: false,
    },
    {
      id: 'task-assignments',
      title: 'Task Assignments',
      description: 'Notify me when I\'m assigned a task.',
      email: false,
      app: false,
    },
    {
      id: 'shared-resources',
      title: 'Shared Resources',
      description: 'Notify me when someone shares a resource, such as an email, with me.',
      email: false,
      app: false,
    },
    {
      id: 'sequence-invites',
      title: 'Sequence delegated sender invites',
      description: 'Notify me when someone invites me to be a sequence delegated sender.',
      email: false,
      app: false,
    },
  ]);

  const handleNotificationToggle = (id: string, type: 'email' | 'app') => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, [type]: !notification[type] }
          : notification
      )
    );
  };

  return (
    <>
      <SiteHeader title="Notifications" />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
          {/* Centered Content Container */}
          <div className="max-w-5xl mx-auto w-full px-20">
            {/* Page Title and Description */}
            <div className="space-y-2 mt-12 mb-8">
              <h1 className="text-2xl font-bold font-geist">Notifications</h1>
              <p className="text-muted-foreground font-geist text-sm">
                Customize your notification settings to stay informed without being overwhelmed
              </p>
            </div>
            
            {/* Daily Digest Section */}
            <div className="flex items-center justify-between py-4 mb-6">
              <div className="space-y-1">
                <Label htmlFor="daily-digest" className="text-base font-medium">
                  Enable daily digest
                </Label>
                <p className="text-sm text-muted-foreground">
                  Includes tasks overdue and due today. Sent every morning if any tasks are due or overdue.
                </p>
              </div>
              <Switch
                id="daily-digest"
                checked={dailyDigest}
                onCheckedChange={setDailyDigest}
              />
            </div>

            {/* Notify Me About Section */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Notify me about</h2>
                
                {/* Column Headers */}
                <div className="flex items-center justify-end gap-8 mb-4 pb-2 border-b">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Smartphone className="h-4 w-4" />
                    <span>App</span>
                  </div>
                </div>

                {/* Notification Items */}
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start justify-between py-3">
                      <div className="flex-1 space-y-1 pr-8">
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {notification.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <Checkbox
                          id={`${notification.id}-email`}
                          checked={notification.email}
                          onCheckedChange={() => handleNotificationToggle(notification.id, 'email')}
                          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <Checkbox
                          id={`${notification.id}-app`}
                          checked={notification.app}
                          onCheckedChange={() => handleNotificationToggle(notification.id, 'app')}
                          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}