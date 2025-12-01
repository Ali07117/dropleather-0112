'use client'

import { SiteHeader } from "@/components/site-header";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Users } from 'lucide-react';

export default function BillingPage() {
  return (
    <>
      <SiteHeader title="Billing" />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
          {/* Centered Content Container */}
          <div className="max-w-5xl mx-auto w-full px-20">
            {/* Page Title and Description */}
            <div className="space-y-2 mt-12 mb-8">
              <h1 className="text-2xl font-bold font-geist">Billing</h1>
              <p className="text-muted-foreground font-geist text-sm">
                Update your payment information or switch plans according to your needs
              </p>
            </div>
            
            {/* Current Plan Section */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Starts December 13th, 2025</p>
                <h2 className="text-4xl font-bold mb-2">Pro</h2>
                <p className="text-base text-muted-foreground">86,00 €/mo per seat, billed monthly</p>
              </CardContent>
            </Card>

            {/* Usage Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Seats Box */}
              <Card>
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
              </Card>

              {/* AI Model Credits Box */}
              <Card>
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
              </Card>
            </div>

            {/* Billing Details Section */}
            <div className="space-y-4 mb-8">
              <div>
                <h2 className="text-lg font-semibold font-geist">Billing details</h2>
                <p className="text-sm text-muted-foreground font-geist">
                  Manage your payment methods and billing information.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Billing Address Box */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Billing Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm">Company</Label>
                      <Input id="company" placeholder="Company name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm">Address</Label>
                      <Input id="address" placeholder="Street address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vat" className="text-sm">VAT Number</Label>
                      <Input id="vat" placeholder="VAT number" />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method Box */}
                <Card>
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
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Add payment method
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* History Section */}
            <Card>
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
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}