import React from 'react';

function StoreIntegrationEmpty() {
    return (
        <div className='pt-[63px] px-[96px] relative h-[100vh]'>
            <div>
                <p className='font-[700] text-[32px] leading-[132%] font-[display] text-[#191B23]'>Store Integration</p>
                <p className='w-[565px] font-[400] text-[18px] font-[display] leading-[132%] text-[#404145]'>Sync your store to manage products and orders with ease, from one centralized dashboard.</p>
            </div>
            <div className='w-[326px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center'>
                <img src="/images/storeintegrationicon.svg" alt="" />
                <p className='font-[500] font-[display] text-[16px] leading-[160%] text-[#000000]'>No Store Connected Yet</p>
                <p className='w-[326px] font-[500] mt-[5px] font-[display] text-[16px] leading-[100%] text-[#75777C]'>Connect your store to start managing and selling your custom leather products with Dropleather.</p>
                <div className='flex items-center gap-[10px] mt-[15px]'>
                    <button className=" cursor-pointer bg-[#005AFF] tracking-[0.2px] gap-[6px] flex border-[0.8px] border-[#00266B] items-center px-[13px] rounded-[9.85px] h-[28px] font-[display] font-[500] text-[16px] leading-[160%] text-[#FFFFFF]">
                        <img src="/images/connecticon.svg" alt="" />
                        Connect Store
                    </button>
                    <button className='border-[1px] inline-flex items-center cursor-pointer flex gap-[6.57px] border-[#C03634] px-[13px] rounded-[9px] h-[28px] bg-[linear-gradient(88.49deg,#F65351_56.55%,#FF1D1A_110.12%)]'>
                        <img className='w-[16px] ' src="/images/playicon.svg" alt="" />
                        <p className='font-[display] font-[500] text-[16px] leading-[150%] text-[#FFFFFF]'>How to connect ?</p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StoreIntegrationEmpty;
