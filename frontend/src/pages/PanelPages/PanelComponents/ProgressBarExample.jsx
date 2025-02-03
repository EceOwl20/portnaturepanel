import React from 'react';

function ProgressBarExample({ currentValue, targetValue }) {
  // Örnek: currentValue = 24, targetValue = 100
  // progressPercent = (currentValue / targetValue) * 100
  // eğer negative vs. check edebilirsiniz

  // "left from target" değeri
  const difference = currentValue - targetValue; 
  // eğer 24 - 100 = -76 => "left from target" 

  const progressPercent = Math.min(Math.max((currentValue / targetValue) * 100, 0), 100);
  // Yukarıdaki min/max ile 0..100 aralığına sıkıştırıyoruz.
  // Arzu ederseniz eksi progress veya 100'den büyük değerleri de handle edebilirsiniz.

  return (
    <div className="flex flex-col w-full max-w-[300px] gap-2">
      {/* Progress Bar Container */}
      <div className="relative w-full h-[10px] bg-[#0e0c1b] rounded-full overflow-hidden">
        {/* Filled portion */}
        <div
          className="absolute left-0 top-0 h-full bg-[#6b78ad] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      
      {/* Aşağıdaki metin */}
      <div className="flex items-center gap-1 text-sm">
        {/* Fark negatifse kırmızı, pozitifse yeşil gibi */}
        {difference < 0 ? (
          <span className="text-white font-bold">
            {difference}%  {/* Örnek: -76% */}
          </span>
        ) : (
          <span className="text-green-500 font-bold">
            +{difference}%
          </span>
        )}
        
        <span className="text-gray-300">
          left from target
        </span>
      </div>
    </div>
  );
}

export default ProgressBarExample;
