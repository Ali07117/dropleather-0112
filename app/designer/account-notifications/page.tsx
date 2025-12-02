'use client'

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Mail, Smartphone } from 'lucide-react';

// Simple header for designer pages (no sidebar dependency)
const DesignerSiteHeader = ({ title = "Dashboard" }: { title?: string }) => (
  <header className="flex h-16 shrink-0 items-center gap-2 border-b">
    <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <h1 className="text-base font-medium font-sans">{title}</h1>
    </div>
  </header>
);

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  email: boolean;
  app: boolean;
};

// EXACT COPY of your original notifications page
export default function DesignerNotificationsPage() {
  const [dailyDigest, setDailyDigest] = useState(false);
  const [active, setActive] = useState(false);
  const [checked, setChecked] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'new-orders',
      title: 'New Orders',
      description: 'Get notified whenever a customer places a new order.',
      email: false,
      app: false,
    },
    {
      id: 'order-status',
      title: 'Order Status Changes',
      description: 'Receive alerts when an order moves to a new stage (processing, production, shipped).',
      email: false,
      app: false,
    },
    {
      id: 'moderator-updates',
      title: 'Moderator Updates',
      description: 'Be notified when moderators update order progress or add internal notes.',
      email: false,
      app: false,
    },
    {
      id: 'production-issues',
      title: 'Production Issues',
      description: 'Receive alerts when an issue is reported during manufacturing or quality checks.',
      email: false,
      app: false,
    },
    {
      id: 'shipping-updates',
      title: 'Shipping Updates',
      description: 'Get notified when an order is packaged, shipped, or delivered.',
      email: false,
      app: false,
    },
    {
      id: 'payment-billing',
      title: 'Payment & Billing',
      description: 'Receive alerts for successful payments, failed payments, or new invoices.',
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
  const [notificationsState, setNotificationsState] = useState(
    notifications.map(n => ({
      ...n,
      emailActive: false,
      smsActive: false,
    }))
  );
  
  // const toggleCheck = (id, type) => {
  //   setNotificationsState(prev =>
  //     prev.map(item =>
  //       item.id === id
  //         ? { ...item, [type]: !item[type] }
  //         : item
  //     )
  //   );
  // };
  const toggleCheck = (id: number | string, type: "emailActive" | "smsActive") => {
    setNotificationsState(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, [type]: !item[type] }
          : item
      )
    );
  };

  return (
    <>
      {/* DESIGN MODE BANNER */}
      <div className="bg-purple-500 text-white text-center py-2 font-bold">
        🎨 DESIGNER MODE - Notifications Page (No Auth)
      </div>

      <DesignerSiteHeader title="Notifications" />

      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
          {/* Centered Content Container */}
          <div className="max-w-5xl mx-auto w-full px-20">
            {/* Page Title and Description */}
            <div className="space-y-[2px] mt-[72px] border-b border-b-[#eeeff1]">
              <h1 className="text-[24px] leading-[28px] text-[#242529] font-[600] font-[Inter]">Notifications</h1>
              <p className="text-[#0000008C] font-[500] pb-[24px] font-[Inter] text-[14px]">
                Customize your notification settings to stay informed without being overwhelmedss
              </p>
            </div>

            {/* Daily Digest Section */}
            <p className='text-[#242529] text-[16px] mt-[40px] font-[Inter] font-[600] leading-[20px]'>Daily digest</p>
            <div className="flex flex-col gap-[40px]">
              <div className="py-[8px] px-[12px] mt-[16px] flex justify-between items-center gap-[4px] rounded-[16px] border border-[#eeeff1]">
                <div className='space-y-[4px]'>

                  <Label htmlFor="daily-digest" className="text-[#242529] text-[14px] font-[Inter] leading-[20px]">
                    Enable daily digest
                  </Label>
                  <p className="text-[#0000008C] text-[12px] font-[Inter] leading-[16px]">
                    Includes tasks overdue and due today. Sent every morning if any tasks are due or overdue.
                  </p>
                </div>
                {/* <Switch
                id="daily-digest"
                checked={dailyDigest}
                onCheckedChange={setDailyDigest}
              /> */}
                <label className="inline-flex items-center cursor-pointer">
                  <div
                    className={`w-[24px] h-[16px] rounded-full transition-colors duration-300
          ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}
                    onClick={() => setChecked(!checked)}
                  >
                    <div
                      className={`w-[14px] h-[14px] bg-white rounded-full mt-[1px] transform transition-transform duration-300
            ${checked ? 'translate-x-[9px]' : 'translate-x-[1px]'}`}
                    />
                  </div>
                </label>

              </div>
            </div>

            {/* Notify Me About Section */}
            <div className='mt-[40px] border-[#eeeff1] border-[1px] rounded-[12px]'>
              <CardContent className="p-[0px]">

                {/* Column Headers */}
                <div className="flex items-center justify-between py-[12px] px-[14px]">
                  <h2 className="text-[12px] text-[#0000008C] font-[500] font-[Inter] ">Notify me about</h2>
                  <div className='flex items-center gap-[20px]'>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className='text-[12px] text-[#0000008C] font-[500] font-[Inter]'>Email</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Smartphone className="h-4 w-4" />
                      <span className='text-[12px] text-[#0000008C] font-[500] font-[Inter]'>App</span>
                    </div>
                  </div>
                </div>

                {/* Notification Items */}
                {/* ==== */}
                <div className="">
  {notificationsState.map((notification) => (
    <div
      key={notification.id}
      className="flex items-start justify-between px-[14px] py-[8px] border-t border-t-[#eeeff1]"
    >
      <div className=" ">
        <div className="text-[#242529] text-[14px] font-[Inter] font-[500] leading-[20px]">
          {notification.title}
        </div>
        <div className="text-[12px] font-[500] text-[#00000066] font-[Inter] leading-[16px]">
          {notification.description}
        </div>
      </div>

      <div className="flex items-center py-[8px] gap-[px]">

        {/* EMAIL CHECKBOX */}
        <div className="w-[50px] mr-[20px] flex justify-center">
          <button
            onClick={() => toggleCheck(notification.id, "emailActive")}
            // onClick={() => toggleCheck(notification.id, "emailActive")}
            className={`w-4 h-4 rounded-[5px] border flex items-center justify-center cursor-pointer transition
              ${notification.emailActive ? "bg-[#0070FF] border-[#0070FF]" : "bg-white border-[#E6E7EA]"}`}
          >
            {notification.emailActive && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

        {/* SMS CHECKBOX */}
        <div className="w-[50px] flex justify-center">
          <button
            onClick={() => toggleCheck(notification.id, "smsActive")}
            // onClick={() => toggleCheck(notification.id, "smsActive")}
            className={`w-4 h-4 rounded-[5px] border flex items-center cursor-pointer justify-center transition
              ${notification.smsActive ? "bg-[#0070FF] border-[#0070FF]" : "bg-white border-[#E6E7EA]"}`}
          >
            {notification.smsActive && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </div>
  ))}
</div>

              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}