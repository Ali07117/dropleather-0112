'use client'
import IntegrationCard from '@/components/integration-card/integration-card';
import React, { useState } from 'react';

function StoreIntegration() {
    const [checkedItems, setCheckedItems] = useState({});
    const [open, setOpen] = useState(0)
    const [open2, setOpen2] = useState(0)
    const [value, setValue] = useState('');
    const [value2, setValue2] = useState('');
    
    const toggleCheck = (id) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    const stores = [
        { id: 1, name: 'Woocommerce', icon: '/images/wooicon.svg' },
        { id: 2, name: 'Amazon', icon: '/images/amazonicon.svg' },
        { id: 3, name: 'Shopify', icon: '/images/shopifyicon.svg' },
        { id: 4, name: 'Etsy', icon: '/images/etsyicon.svg' },
        { id: 5, name: 'Walmart', icon: '/images/walmarticon.svg' },
        { id: 6, name: 'Gumroad', icon: '/images/gumroadicon.svg' },
        { id: 7, name: 'Wix', icon: '/images/wixicon.svg' },
        { id: 8, name: 'Ebay', icon: '/images/ebayicon.svg' },
        { id: 9, name: 'TikTok Shop', icon: '/images/tiktokicon.svg' },
      ];
    return (
        <>
<div className={` ${open ? 'block': 'hidden'} w-[423px] border-[1px] bg-[#FFFFFF] border-[rgba(0,0,0,0.4)] px-[23.5px] py-[15px] rounded-[20px] absolute top-[50%] left-[50%] z-[10] translate-x-[-50%] translate-y-[-50%]`}>
    <img className='absolute top-[15px] cursor-pointer right-[18px]' src="/images/closeicon.svg" alt="" onClick={() => setOpen(!open)} />
    <p className='font-[display] font-[600] tracking-[0.7px] text-[18px] text-[#000000] leading-[100%]'>Already have a store?</p>
    <p className='w-[358px] font-[display]  mt-[8px] font-normal text-[15px] leading-[120%] text-[#000000]'>Connect DropLeather to your store to easily manage products and automate orders.</p>
    <div className='mt-[18px]'>

    <div className="flex flex-col gap-[10px]">
      {stores.map(store => (
        <div 
          key={store.id} 
          className='w-[100%] h-[45px] flex items-center justify-between border-[1px] border-[#E3E3E3] rounded-[7px] px-[10px]'
        >
          <div className='flex items-center' onClick={() => toggleCheck(store.id)}>
            {/* Clickable 15x15px circle */}
            <div className={`h-[15px] w-[15px] rounded-full cursor-pointer border-[1px] border-[#E3E3E3] flex items-center justify-center ${checkedItems[store.id] ? 'bg-[#005AFF]' : 'bg-white'}`}>
              {checkedItems[store.id] && (
                <svg className="w-[10px] h-[10px] translate-y-[1px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>

            <img className='ml-[10px]' src={store.icon} alt={store.name} />
            <p className='font-[display] ml-[8px] font-[500] text-[17px] leading-[100%] text-[#000000]'>{store.name}</p>
          </div>
          <img className='cursor-pointer' src="/images/iicon.svg" alt="" />
        </div>
      ))}
    </div>
    </div>
    <div className='flex gap-[10px] justify-end mt-[35px]'>
        <button className=' flex items-center justify-center cursor-pointer h-[28px] border-[1px] border-[#000000] px-[5px] py-[1px] rounded-[9.85px] text-[16px] font-[display] font-[600] leading-[160%] text-[#000000]' onClick={() => setOpen(!open)}>Cancel</button>
        <button className=' flex items-center justify-center cursor-pointer h-[28px] border-[1px] border-[#00266B] px-[5px] py-[1px] bg-[#005AFF] rounded-[9.85px] text-[16px] font-[display] font-[500] leading-[160%] text-[#FFFFFF]'>Connect</button>
    </div>
</div>


<div className={`  ${open2 ? 'block': 'hidden'} w-[423px] border-[1px] bg-[#FFFFFF] border-[rgba(0,0,0,0.4)] px-[23.5px] py-[15px] rounded-[20px] absolute top-[50%] left-[50%] z-[10] translate-x-[-50%] translate-y-[-50%]`}>
    <img className='absolute top-[15px] cursor-pointer right-[18px]' src="/images/closeicon.svg" alt="" onClick={() => setOpen2(!open2)}/>
    <p className='font-[display] font-[600] tracking-[0.7px] text-[18px] text-[#000000] leading-[100%]'>Are you sure you want to delete this store?</p>
    <p className='w-[358px] font-[display]  mt-[8px] font-300 text-[15px] leading-[140%] text-[#000000]'>This will permanently remove the store from your DropLeather account. Orders and product sync will stop immediately, and this action cannot be undone.</p>

    <p className='w-[358px] font-[display]  mt-[8px] font-normal text-[15px] leading-[120%] text-[#000000] mt-[20px]'>Enter <span className='font-[600] tracking-[0.5px]'>“delete”</span> to confirm (<span className='font-[600] tracking-[0.5px]'>required</span><span className='text-[#ff0000]'>*</span>)</p>
    {/* <input className='h-[34px] w-[100%] outline-none rounded-[7px] border-[1px] border-[#000000] mt-[10px]' type="text" placeholder='Please type “delete” to confirm this action' /> */}
    <div className="relative w-full mt-[10px]">
      {!value && (
        <span className="pointer-events-none absolute left-[12px] top-1/2 -translate-y-1/2  font-[display] text-[15px] leading-[120%] text-[#787878]">
          Please type <span className="font-bold tracking-[0.5px]">“delete”</span> to confirm this action
        </span>
      )}

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-[34px] w-full outline-none rounded-[7px] border-[1px] border-[#000000] px-[12px]"
        type="text"
      />
    </div>
    <p className='w-[358px] font-[display]  mt-[8px] font-normal text-[15px] leading-[120%] text-[#000000] '>Reason for deleting your store (<span className='font-[600] tracking-[0.5px]'>required</span><span className='text-[#ff0000]'>*</span>)</p>
    <div className="relative w-full mt-[10px]">
      {!value2 && (
        <span className="pointer-events-none inline-flex w-[94%] justify-between items-center absolute left-[12px] top-1/2 -translate-y-1/2  font-[display] text-[15px] leading-[120%] text-[#787878]">
          Select a reason <span><img className='translate-y-[2px]' src="/images/requiredarrow.svg" alt="" /></span>
        </span>
      )}

      <input
        value={value2}
        onChange={(e) => setValue2(e.target.value)}
        className="h-[34px] w-full outline-none rounded-[7px] border-[1px] border-[#000000] px-[12px]"
        type="text"
      />
    </div>
    
    <div className='mt-[18px]'>

    </div>
    <div className='flex gap-[10px] justify-end mt-[35px]'>
        <button className=' flex items-center justify-center cursor-pointer h-[28px] border-[1px] border-[#000000] px-[10px] py-[1px] rounded-[9.85px] text-[16px] font-[display] font-[600] leading-[160%] text-[#000000]' onClick={() => setOpen2(!open2)}>Cancel</button>
        <button className=' flex items-center justify-center cursor-pointer h-[28px] border-[1px] border-[#C03634] px-[10px] py-[1px] bg-[#F65351] rounded-[9.85px] text-[16px] font-[display] font-[500] leading-[160%] text-[#FFFFFF]'>Connect</button>
    </div>
</div>
        
 

        <div className='pt-[63px] px-[96px] relative h-[100vh]'>
            <div>
                <p className='font-[700] text-[32px] leading-[132%] font-[display] text-[#191B23]'>Store Integration</p>
                <p className='w-[565px] font-[400] text-[18px] font-[display] leading-[132%] text-[#404145]'>Sync your store to manage products and orders with ease, from one centralized dashboard.</p>
            </div>
            <div className='mt-[40px] flex justify-between items-center border-b border-b-[#F1F1F1] border-b-[2px] pb-[10px]'>
                <button className='border-[1px] inline-flex items-center cursor-pointer flex gap-[6.57px] border-[#C03634] px-[13px] rounded-[9px] h-[28px] bg-[linear-gradient(88.49deg,#F65351_56.55%,#FF1D1A_110.12%)]'>
                    <img className='w-[16px] ' src="/images/playicon.svg" alt="" />
                    <p className='font-[display] font-[500] text-[16px] leading-[150%] text-[#FFFFFF]'>How to connect ?</p>
                </button>
                <div className='flex items-center gap-[10px]'>
                    <div className='w-fit px-[10px] flex items-center justify-center gap-[2px] h-[28px] rounded-[8.95px] border-[0.8px] border border-[rgba(105,105,105,0.6)]'>
                        <p className='font-[display] font-[600] text-[16px] leading-[160%]'>Advanced Filters</p>
                        <img className='ml-[3px] mt-[2px]' src="/images/downarrow.svg" alt="" />
                    </div>
                    <button className=" cursor-pointer bg-[#005AFF] tracking-[0.2px] gap-[6px] flex border-[0.8px] border-[#00266B] items-center px-[13px] rounded-[9.85px] h-[28px] font-[display] font-[500] text-[16px] leading-[160%] text-[#FFFFFF]"  onClick={() => setOpen(!open)}>
                        <img src="/images/connecticon.svg" alt="" />
                        Connect Store
                    </button>
                </div>

            </div>
            <p className='text-[14px] leading-[150%] font-[500] font-[display] text-[#75777C] mt-[18px]'>Created over a month ago</p>
            <div className='mt-[10px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]'>
                <IntegrationCard open2={open2} setOpen2={setOpen2} icon="/images/shopify.svg"
                    title="Shopify Store Connected"
                    description="Integration successful. Your store is now synced with Dropleather."
                    storeUrl="your-store.myshopify.com"
                    date="March 17, 2025" />
                <IntegrationCard open2={open2} setOpen2={setOpen2} icon="/images/woocommerce.svg"
                    title="Woocommerce Store Connected"
                    description="Integration successful. Your store is now synced with Dropleather."
                    storeUrl="your-store.myshopify.com"
                    date="March 17, 2025" />
                <IntegrationCard open2={open2} setOpen2={setOpen2} icon="/images/etsy.svg"
                    title="Etsy Store Connected"
                    description="Integration successful. Your store is now synced with Dropleather."
                    storeUrl="shopname.etsy.com"
                    date="March 17, 2025" />
                <IntegrationCard open2={open2} setOpen2={setOpen2} icon="/images/amazon.svg"
                    title="Amazon Store Connected"
                    description="Integration successful. Your store is now synced with Dropleather."
                    storeUrl="your-store.myshopify.com"
                    date="March 17, 2025" />
            </div>

        </div>
        </>
    );
}

export default StoreIntegration;
