import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import React from 'react';

function TicketHistoryEmpty() {
  return (
    <div className='pt-[63px] px-[96px] relative h-[100vh]'>
        <div>
      <p className='font-[700] text-[32px] leading-[132%] font-[display] text-[#191B23]'>Ticket History</p>
      <p className='w-[565px] font-[400] text-[18px] font-[display] leading-[132%] text-[#404145]'>View all your submitted support tickets in one place. Track responses, monitor progress, and follow up on any ongoing or resolved issues with our team.</p>
        </div>
        <div className='w-[326px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center'>
            <img src="/images/nosupport.svg" alt="" />
            <p className='font-[500] font-[display] text-[16px] leading-[160%] text-[#000000]'>No Support Tickets Yet</p>
            <p className='w-[326px] font-[500] mt-[5px] font-[display] text-[16px] leading-[100%] text-[#75777C]'>Need help? Create a support ticket and our team will assist you with any questions about your account.</p>
            <button className=" cursor-pointer bg-[#005AFF] mt-[15px] tracking-[0.2px] gap-[6px] flex border-[0.8px] border-[#00266B] items-center px-[13px] rounded-[9.85px] h-[28px] font-[display] font-[500] text-[16px] leading-[160%] text-[#FFFFFF]">
            <img src="/images/ticketicon.svg" alt="" />
            Create Ticket
          </button>
        </div>
    </div>
  );
}

export default TicketHistoryEmpty;
