import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import React from 'react';

function TicketHistory() {
    return (
        <div className='pt-[63px] px-[96px]'>
            <div>
                <p className='font-[700] text-[32px] leading-[132%] font-[display] text-[#191B23]'>Ticket History</p>
                <p className='w-[565px] font-[400] text-[18px] font-[display] leading-[132%] text-[#404145]'>View all your submitted support tickets in one place. Track responses, monitor progress, and follow up on any ongoing or resolved issues with our team.</p>
            </div>
            <div className='inline-flex items-center mt-[40px] pb-[-5px] gap-[12px] border-b border-b-[2px] border-b-[#F1F1F1]'>
                <div className="inline-flex items-center gap-[10px] border-b-2 border-[#266DF0] pb-[-5px] relative translate-y-[2px]">
                    <p className="text-[#000000] font-[500] text-[20px] leading-tight font-[display]">
                        All Tickets
                    </p>
                    <button className="bg-[#266DF0] flex items-center justify-center px-[3px] w-[22px] h-[18px] rounded-[6px] font-[500] font-[display] leading-none text-[15px] text-white">
                        35
                    </button>
                </div>
                <div className="inline-flex items-center gap-[10px] border-b-2 border-[#F1F1F1] pb-[-5px] relative translate-y-[2px]">
                    <p className="text-black/60 font-[500] text-[20px] leading-tight font-[display]">
                        Solved
                    </p>
                    <button className="bg-[#266DF0] flex items-center justify-center px-[3px] w-[22px] h-[18px] rounded-[6px] font-[500] font-[display] leading-none text-[15px] text-white">
                        35
                    </button>
                </div>
                <div className="inline-flex items-center gap-[10px] border-b-2 border-[#F1F1F1] pb-[-5px] relative translate-y-[2px]">
                    <p className="text-black/60 font-[500] text-[20px] leading-tight font-[display]">
                        Unsolved
                    </p>
                    <button className="bg-[#266DF0] flex items-center justify-center px-[3px] w-[22px] h-[18px] rounded-[6px] font-[500] font-[display] leading-none text-[15px] text-white">
                        35
                    </button>
                </div>
            </div>
            <div className=''>
                <div className='mt-[25px] flex items-center justify-between'>
                    <div className='flex items-center'>
                        <div className='flex px-[12.25px] w-[275px] h-[28px] rounded-[9.18px] outline-none border-[0.81px] border-black/60'>
                            <img className='w-[11px]' src="/images/search.svg" alt="" />
                            <input className='border-none outline-none w-full placeholder-[#696969] text-[#696969] ml-[12px] font-[display] font-[500] text-[16px] leading-[160%]' type="text" placeholder='Search' />
                        </div>
                        <div className='h-[20px] w-[1px] opacity-[0.1] bg-[#000000] mx-[20px]'></div>
                        <div className='flex items-center gap-[15px] tracking-[0.5px]'>
                            <div className='w-[73px] flex items-center justify-center gap-[2px] h-[28px] rounded-[8.95px] border-[0.8px] border border-[rgba(105,105,105,0.6)]'>
                                <img src="/images/calendar.svg" alt="" />
                                <p className='font-[display] font-[600] text-[16px] leading-[160%]'>Today</p>
                            </div>
                            <div className='w-[73px] flex items-center justify-center gap-[2px] h-[28px] rounded-[8.95px] border-[0.8px] border border-[rgba(105,105,105,0.6)]'>
                                <p className='font-[display] font-[600] text-[16px] leading-[160%]'>Priority</p>
                                <img className='ml-[3px] mt-[2px]' src="/images/downarrow.svg" alt="" />
                            </div>
                            <div className='w-[73px] flex items-center justify-center gap-[2px] h-[28px] rounded-[8.95px] border-[0.8px] border border-[rgba(105,105,105,0.6)]'>
                                <p className='font-[display] font-[600] text-[16px] leading-[160%]'>Priority</p>
                                <img className='ml-[3px] mt-[2px]' src="/images/downarrow.svg" alt="" />
                            </div>
                        </div>
                        <div className='h-[20px] w-[1px] opacity-[0.1] bg-[#000000] ml-[70px] mr-[20px]'></div>
                        <p className='font-[display] font-[600] text-[14px] underline underline-offset-[3px] tracking-[0.5px] decoration-[1px]'>Hide</p>
                    </div>
                    <button className=" cursor-pointer tracking-[0.2px] gap-[6px] flex border-[0.8px] border border-[rgba(105,105,105,0.6)] items-center px-[13px] rounded-[9.85px] h-[28px] font-[display] tracking-[0.7px] font-[600] text-[16px] leading-[160%] text-[#040404]">
                        <img src="/images/ticketicon2.svg" alt="" />
                        Create Ticket
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto rounded-[12px] border border-[#F1F1F1] mt-[20px]">
  <table className="w-full border-collapse">
    
    {/* TABLE HEAD */}
    <thead className="bg-[#FAFAFA] ">
      <tr className="text-[12px] h-[56px] font-[500] text-[#6B6B6B] ">
        
        <th className="px-[20px] text-[16px] font-[500] font-[display] leading-[160%] text-[#535455] text-left">
          Ticket Number
        </th>

        <th className="px-[20px] text-[16px] font-[500] font-[display] leading-[160%] text-[#535455] text-left">
          Subject
        </th>

        <th className="px-[20px] text-[16px] font-[500] font-[display] leading-[160%] text-[#535455] text-left">
          <div className="flex items-center gap-[10px]">
            Priority
            <span className="translate-y-[1px]"><img src="/images/tablearrow.svg" alt="" /></span>
          </div>
        </th>

        <th className="px-[20px] text-[16px] font-[500] font-[display] leading-[160%] text-[#535455] text-left">
          Type
        </th>

        <th className="px-[20px] text-[16px] font-[500] font-[display] leading-[160%] text-[#535455] text-left">
          Assigned Support
        </th>

        <th className="px-[20px] text-[16px] font-[500] font-[display] leading-[160%] text-[#535455] text-left">
          <div className="flex items-center gap-[10px]">
            Requested Date
            <span className="translate-y-[1px]"><img src="/images/tablearrow.svg" alt="" /></span>
          </div>
        </th>

        <th className="px-[20px] text-[16px] font-[500] font-[display] leading-[160%] text-[#535455] text-left">
          <div className="flex items-center gap-[10px]">
            Status
            <span className="translate-y-[1px]"><img src="/images/tablearrow.svg" alt="" /></span>
          </div>
        </th>

        <th className="px-[20px] text-[16px] font-[500] font-[display] leading-[160%] text-[#535455] text-center">
          View Ticket
        </th>

      </tr>
    </thead>

    {/* TABLE BODY */}
    <tbody className="text-[13px] text-[#242529]">
      <tr className="border-t border-[#ECF0F3]">

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
          07032025
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px] max-w-[260px] truncate">
        Issue with Recent Order #12345...
        </td>

        <td className="px-[20px] font-[600] font-[display] text-[16px] leading-[160%] text-[#DB0D0A] py-[16px]">
          <div className="inline-flex items-center tracking-[0.7px] gap-[6px] px-[10px] py-[4px] max-h-[24px] rounded-[80px] bg-[rgba(255,47,47,0.1)] text-[#DB0D0A] text-[12px]">
            <span className="w-[9px] h-[9px] border border-[1px] border-[#65150C] rounded-full bg-[#DB0D0A]"></span>
            High Priority
          </div>
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
          General Inquiry
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
          <div className="flex items-center gap-[5px]">
            <span className="w-[24px] h-[24px] rounded-full bg-[#E5E5E5]">
            <img className='' src="/images/tableprofile.svg" alt="" />
            </span>
            Jack Dorsey
          </div>
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
          Aug 27, 2025 11:00 AM
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
          Solved
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px] text-center">
          <span className="inline-flex ">
            <img className='translate-y-[2px]' src="/images/tableeye.svg" alt="" />
          </span>
        </td>

      </tr>
      <tr className="border-t border-[#ECF0F3]">

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
          07032025
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px] max-w-[260px] truncate">
        Issue with Recent Order #12345...
        </td>

        <td className="px-[20px] font-[600] font-[display] text-[16px] leading-[160%] text-[#0D4F15] py-[16px]">
          <div className="inline-flex items-center tracking-[0.7px] gap-[6px] px-[10px] py-[4px] max-h-[24px] rounded-[80px] bg-[#D4FDD7] text-[#0D4F15] text-[12px]">
            <span className="w-[9px] h-[9px] border border-[1px] border-[#0D4F15] rounded-full bg-[#04C902]"></span>
            Low Priority
          </div>
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
        Brand Issues
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
          <div className="flex items-center gap-[5px]">
            <span className="w-[24px] h-[24px] rounded-full bg-[#E5E5E5]">
            <img className='' src="/images/tableprofile.svg" alt="" />
            </span>
            Jack Dorsey
          </div>
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
          Aug 27, 2025 11:00 AM
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
          Solved
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px] text-center">
          <span className="inline-flex ">
            <img className='translate-y-[2px]' src="/images/tableeye.svg" alt="" />
          </span>
        </td>

      </tr>
      <tr className="border-t border-[#ECF0F3]">

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
          07032025
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px] max-w-[260px] truncate">
        Issue with Recent Order #12345...
        </td>

        <td className="px-[20px] font-[600] font-[display] text-[16px] leading-[160%] text-[#E57E25] py-[16px]">
          <div className="inline-flex items-center tracking-[0.7px] gap-[6px] px-[10px] py-[4px] max-h-[24px] rounded-[80px] bg-[rgba(255,204,0,0.1)] text-[#E57E25] text-[12px]">
            <span className="w-[9px] h-[9px] border border-[1px] border-[#AD5A12] rounded-full bg-[#E57E25]"></span>
            Medium Priority
          </div>
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
        Subscription & Pricing
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
          <div className="flex items-center gap-[5px]">
            <span className="w-[24px] h-[24px] rounded-full bg-[#E5E5E5]">
            <img className='' src="/images/tableprofile.svg" alt="" />
            </span>
            Jack Dorsey
          </div>
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
          Aug 27, 2025 11:00 AM
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px]">
          Solved
        </td>

        <td className="px-[20px] font-[400] font-[display] text-[16px] leading-[160%] text-[#191B23] py-[16px] text-center">
          <span className="inline-flex ">
            <img className='translate-y-[2px]' src="/images/tableeye.svg" alt="" />
          </span>
        </td>

      </tr>
    </tbody>

  </table>
</div>



        </div>
    );
}

export default TicketHistory;
