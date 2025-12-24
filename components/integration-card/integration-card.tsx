import React from 'react';

function IntegrationCard({icon, title, description, storeUrl, date, open2, setOpen2}) {
  return (
    <div className="h-[208px]  relative flex flex-col justify-between rounded-[7px] border border-[rgba(0,0,0,0.05)] px-[10px] pt-[18px]">

    {/* Delete Icon */}
    <img
      className="h-[14px] cursor-pointer absolute top-[10px] right-[10px]"
      src="/images/delete.svg"
      alt="delete"
      onClick={() => setOpen2(!open2)}
    />

    {/* Content */}
    <div>
      <img src={icon} alt="integration" />

      <p className="mt-[5px] font-[display] font-[500] text-[16px] leading-[150%] text-[#000000]">
        {title}
      </p>

      <p className="w-[282px] font-[display] font-[500] text-[14px] leading-[140%] text-[#75777C]">
        {description}
      </p>
    </div>

    {/* Bottom Section */}
    <div className="h-[20px] w-full flex justify-between items-center border-t border-t-[#D9D9D9]">
      <div className="flex items-center gap-[5px]">
        <img src="/images/integrationsign.svg" alt="link" />
        <p className="text-[#75777C] font-[display] font-[500] text-[12px]">
          {storeUrl}
        </p>
      </div>

      <p className="text-[#75777C] font-[display] font-[500] text-[12px]">
        {date}
      </p>
    </div>
  </div>
  );
}

export default IntegrationCard;
