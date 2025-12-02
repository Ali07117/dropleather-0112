'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CreditCard, Users } from 'lucide-react';

// Simple header for designer pages (no sidebar dependency)
const DesignerSiteHeader = ({ title = "Dashboard" }: { title?: string }) => (
  <header className="flex h-16 shrink-0 items-center gap-2 border-b">
    <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <h1 className="text-base font-medium font-sans">{title}</h1>
    </div>
  </header>
);

// EXACT COPY of your original billing page
export default function DesignerBillingPage() {
  return (
    <>
      {/* DESIGN MODE BANNER */}
      <div className="bg-blue-500 text-white text-center py-2 font-bold">
        🎨 DESIGNER MODE - Billing Page (No Auth)
      </div>
      
      <DesignerSiteHeader title="Billing" />
      
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 ">
          {/* Centered Content Container */}
          <div className="max-w-5xl mx-auto w-full px-20">
            {/* Page Title and Description */}
            <div className=" mt-[72px] border-b border-b-[#d5d5d5] mb-[40px] pb-[24px]">
              <h1 className="text-[24px] leading-[28px] font-[600] text-[#242529] font-[Inter]">Billing</h1>
              <p className="text-[rgba(0,0,0,0.55)] leading-[20px] text-[14px] font-[Inter] font-[500]">
                Update your payment information or switch plans according to your needs
              </p>
            </div>
            <div className='h-[46px] flex items-center justify-between mb-[20px] bg-[#F8F9FA] py-[8px] w-[100%] px-[12px] rounded-[12px] border border-[#eeeff1]'>
              <div className='flex items-center gap-[6px]'>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <p className='text-[#505154] text-[14px] font-[Inter] font-[500]'>There are 13 days left on your trial</p>
              </div>
              <button className='bg-[#266DF0] border border-[#2262d8] hover:bg-[#215BC4] gap-[6px] rounded-[8px] cursor-pointer px-[8px] py-[4px] text-[#FFFFFF] font-[Inter] text-[14px] font-[500] max-h-[28px] leading-[20px] outline-none tracking-[-0.02em] flex items-center'>Add billing details</button>
            </div>
            <p className='text-[#242529] text-[16px] font-[Inter] leading-[20px] font-[600]'>Current plan</p>
            <p className='text-[#0000008C] text-[14px] font-[Inter] font-[500]'>Starts December 16th, 2025</p>
            <div className='h-[56px] flex gap-[6px] rounded-[12px] p-[8px] border border-[#eeeff1] bg-[#FFFFFF] mt-[16px]'>
              <div className='h-[40px] w-[40px] rounded-[8px] border border-[#eeeff1]'></div>
              <div>
              <p className='text-[14px] font-[500] font-[Inter] text-[#242529] leading-[20px]'>Pro</p>
              <p className='text-[12px] font-[500] font-[Inter] text-[#0000008C] leading-[16px]'>$86.00/mo per seat, billed monthly</p>
              </div>
            </div>
            <p className='text-[#242529] text-[16px] font-[Inter] mt-[40px] leading-[20px] font-[600]'>Usage</p>
            <p className='text-[#0000008C] text-[14px] font-[Inter] font-[500]'>Manage your seats and credits</p>
            <div className='mt-[16px] grid grid:cols-1 md:grid-cols-3 space-x-[12px] sm:grid-cols-1'>
            <div className='h-[126px] p-[16px] rounded-[16px] border border-[#eeeff1]'>
                <div className='flex items-center gap-[6px]'>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <p className='text-[14px] font-[500] font-[Inter] text-[#242529] leading-[20px]'>Seats</p>
                </div>
                <div className='my-[6px] space-y-[4px]'>
                <p className='text-[#505154] text-[12px] font-[Inter] font-[500] leading-[16px]'>1 <span className='text-[#00000066] text-[12px] font-[Inter] font-[500] leading-[16px]'>/ 1</span></p>
                <div className='bg-[#F97514] h-[4px] rounded-[4px]'></div>
                </div>
                <button className='bg-[#FFFFFF] mt-[16px] hover:bg-[#F8F9FA] btn-shadow gap-[6px] rounded-[8px] cursor-pointer pl-[8px] pr-[6px] py-[4px] text-[#242529] font-[Inter] text-[14px] font-[500] max-h-[28px] leading-[20px] tracking-[-0.02em] flex items-center'>Manage seats</button>
              </div>
              <div className='h-[126px] p-[16px] rounded-[16px] border border-[#eeeff1]'>
                <div className='flex items-center gap-[6px]'>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <p className='text-[14px] font-[500] font-[Inter] text-[#242529] leading-[20px]'>Automation credits</p>
                </div>
                <div className='my-[6px] space-y-[4px]'>
                <p className='text-[#505154] text-[12px] font-[Inter] font-[500] leading-[16px]'>10 <span className='text-[#00000066] text-[12px] font-[Inter] font-[500] leading-[16px]'>/ 1,000,000</span></p>
                <div className='bg-[#eeeff1] h-[4px] rounded-[4px]'></div>
                </div>
                <button className='bg-[#FFFFFF] mt-[16px] hover:bg-[#F8F9FA] btn-shadow gap-[6px] rounded-[8px] cursor-pointer pl-[8px] pr-[6px] py-[4px] text-[#242529] font-[Inter] text-[14px] font-[500] max-h-[28px] leading-[20px] tracking-[-0.02em] flex items-center'>{"Usage >"}</button>
              </div>
              <div className='h-[126px] p-[16px] rounded-[16px] border border-[#eeeff1]'>
                <div className='flex items-center gap-[6px]'>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <p className='text-[14px] font-[500] font-[Inter] text-[#242529] leading-[20px]'>Records</p>
                </div>
                <div className='my-[6px] space-y-[4px]'>
                <p className='text-[#505154] text-[12px] font-[Inter] font-[500] leading-[16px]'>0 <span className='text-[#00000066] text-[12px] font-[Inter] font-[500] leading-[16px]'>/ 10,000</span></p>
                <div className='bg-[#eeeff1] h-[4px] rounded-[4px]'></div>
                </div>
                <button className='bg-[#FFFFFF] mt-[16px] hover:bg-[#F8F9FA] btn-shadow gap-[6px] rounded-[8px] cursor-pointer pl-[8px] pr-[6px] py-[4px] text-[#242529] font-[Inter] text-[14px] font-[500] max-h-[28px] leading-[20px] tracking-[-0.02em] flex items-center'>{"Usage >"}</button>
              </div>
            </div>
            <p className='text-[#242529] text-[16px] font-[Inter] mt-[40px] leading-[20px] font-[600]'>Billing details</p>
            <p className='text-[#0000008C] text-[14px] font-[Inter] font-[500]'>Manage your payment methods and billing information.</p>

            <div className='grid grid-cols-1 md:grid-cols-2 space-x-[16px] mt-[16px]'>

            <div className='py-[12px] px-[16px] rounded-[16px] border border-[#eeeff1] h-[261px]'>
              <div className='flex items-center justify-between'>

              <div className=''>
              <p className='text-[14px] font-[500] font-[Inter] text-[#242529] leading-[20px]'>Address</p>
              <p className='text-[12px] font-[500] font-[Inter] text-[#0000008C] leading-[16px]'>Update your billing address</p>
              </div>
              <div>
                <div className='h-[28px] w-[28px] p-[7px] rounded-[8px] border border-[#eeeff1]'></div>
              </div>
              </div>
              <div className='flex items-center justify-between py-[16px] border-b border-b-[#eeeff1]'>
                <p className='w-[50%] font-[500] font-[Inter] text-[14px] text-[#0000008C]'>Email</p>
                <p className='w-[50%] font-[500] font-[Inter] text-[14px] text-[#242529]'>hamakex798@cexch.com</p>
              </div>
              <div className='flex items-center justify-between py-[16px] border-b border-b-[#eeeff1]'>
                <p className='w-[50%] font-[500] font-[Inter] text-[14px] text-[#0000008C]'>Company name</p>
                <p className='w-[50%] font-[500] font-[Inter] text-[14px] text-[#242529]'>Bullzay</p>
              </div>
              <div className='flex items-center justify-between py-[16px] border-b border-b-[#eeeff1]'>
                <p className='w-[50%] font-[500] font-[Inter] text-[14px] text-[#0000008C]'>Address</p>
                <p className='w-[50%] font-[500] font-[Inter] text-[14px] text-[#242529]'>Pakistan</p>
              </div>
              <div className='flex items-center justify-between py-[16px]'>
                <p className='w-[50%] font-[500] font-[Inter] text-[14px] text-[#0000008C]'>VAT Number</p>
                <p className='w-[50%] font-[500] font-[Inter] text-[14px] text-[#0000008C]'>Not provided</p>
              </div>
            </div>
            <div className='py-[12px] px-[16px] rounded-[16px] border border-[#eeeff1] h-[261px]'>
              <div className='flex items-center justify-between'>

              <div className=''>
              <p className='text-[14px] font-[500] font-[Inter] text-[#242529] leading-[20px]'>Payment</p>
              <p className='text-[12px] font-[500] font-[Inter] text-[#0000008C] leading-[16px]'>Manage your payment methods</p>
              </div>
              <div>
                <div className='h-[28px] w-[28px] p-[7px] rounded-[8px] border border-[#eeeff1]'></div>
              </div>
              </div>
            </div>
            </div>
            <p className='text-[#242529] text-[16px] font-[Inter] mt-[40px] leading-[20px] font-[600]'>History</p>
            <p className='text-[#0000008C] text-[14px] font-[Inter] font-[500]'>View and track your past invoices and payment history</p>
            {/* ====== */}
            <div className="w-full border border-[#eeeff1] mt-[16px] rounded-[12px] overflow-hidden">
  <div className="grid grid-cols-5 px-[14px] py-[12px] text-[12px] font-[Inter] font-[500] text-[#0000008C]">
    <div>Reference</div>
    <div>Total incl. tax</div>
    <div>Date</div>
    {/* <div>Status</div> */}
    <div></div>
  </div>

  <div className="grid grid-cols-5 px-[14px] py-[12px] text-[#505154] text-[14px] font-[Inter] font-[500] items-center border-t">
    <div className="text-[#505154]">DQEMZWM1-0001</div>
    <div className="text-[#505154]">$0.00</div>
    <div className="text-[#505154]">2nd Dec 2025</div>

    <div>
      {/* <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
        Paid
      </span> */}
    </div>

    <div className="flex justify-end items-center gap-[4px]">
    <span className="px-[6px] py-[2px] text-[12px] font-[Inter] font-[500] bg-[#E0FCED] text-[#007D53] rounded-[6px] border border-[#eeeff1]">
        Paid
      </span>
      <button className="text-gray-500 hover:text-gray-700 m-[7px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021
             18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
      </button>
    </div>
  </div>
</div>
<button className='bg-[#FFFFFF] mb-[80px] mt-[40px] hover:bg-[#F8F9FA] btn-shadow gap-[6px] rounded-[8px] cursor-pointer px-[10px] py-[6px] text-[#242529] font-[Inter] text-[14px] mt-[] font-[500] max-h-[28px] leading-[20px] tracking-[-0.02em] flex items-center'>Cancel subscription</button>
            {/* ========================= */}
            {/* Current Plan Section */}
            {/* <Card className="mb-6">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Starts December 13th, 2025</p>
                <h2 className="text-4xl font-bold mb-2">Pro</h2>
                <p className="text-base text-muted-foreground">86,00 €/mo per seat, billed monthly</p>
              </CardContent>
            </Card> */}

            {/* Usage Section */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"> */}
              {/* Seats Box */}
              {/* <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-medium">Seats</CardTitle>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => alert('🎨 DESIGN MODE: Manage seats clicked!')}
                    >
                      Manage seats
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">1/1</span>
                    </div>
                    <Progress value={100} className="h-2 [&>div]:bg-orange-500" />
                  </div>
                </CardContent>
              </Card> */}

              {/* AI Model Credits Box */}
              {/* <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-medium">AI Model Credits</CardTitle>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => alert('🎨 DESIGN MODE: Usage clicked!')}
                    >
                      Usage
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <span className="text-2xl font-bold">0 / 100</span>
                  </div>
                </CardContent>
              </Card> */}
            {/* </div> */}

            {/* Billing Details Section */}
            {/* <div className="space-y-4 mb-8">
              <div>
                <h2 className="text-lg font-semibold font-geist">Billing details</h2>
                <p className="text-sm text-muted-foreground font-geist">
                  Manage your payment methods and billing information.
                </p>
              </div> */}
              
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
                {/* Billing Address Box */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Billing Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" defaultValue="john.smith@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm">Company</Label>
                      <Input id="company" placeholder="Company name" defaultValue="Smith Fashion Co." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm">Address</Label>
                      <Input id="address" placeholder="Street address" defaultValue="123 Fashion Street" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vat" className="text-sm">VAT Number</Label>
                      <Input id="vat" placeholder="VAT number" defaultValue="DE123456789" />
                    </div>
                  </CardContent>
                </Card> */}

                {/* Payment Method Box */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                          <p className="text-xs text-muted-foreground">Expires 12/24</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => alert('🎨 DESIGN MODE: Edit payment clicked!')}
                      >
                        Edit
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => alert('🎨 DESIGN MODE: Add payment method clicked!')}
                    >
                      Add payment method
                    </Button>
                  </CardContent>
                </Card> */}
              {/* </div> */}
            {/* </div> */}

            {/* History Section */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg">History</CardTitle>
                <CardDescription className="text-sm">
                  View and track your past invoices and payment history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Total incl. tax</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">VIXPMUBN-0001</TableCell>
                      <TableCell>0,00 €</TableCell>
                      <TableCell>29th Nov 2025</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Paid
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </>
  );
}