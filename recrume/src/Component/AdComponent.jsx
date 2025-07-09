import React from 'react';
import { useNavigate } from 'react-router-dom';
import ad1 from '../../public/ad1.jpeg';
import ad2 from '../../public/ad2.jpeg';
import ad3 from '../../public/ad3.jpeg';
import ad4 from '../../public/ad4.jpeg';
import ad5 from '../../public/ad5.jpeg';
const adBackgrounds = {
  1: ad1,
  2: ad2,
  3: ad3,
  4: ad4,
  5: ad5
};

const AdComponent = ({ count = 1 }) => {
  const navigate = useNavigate();
  const maxAds = Math.min(count, 5);
  const entries = Object.entries(adBackgrounds)
    .sort(() => 0.5 - Math.random())
    .slice(0, maxAds);

  return (
    <div className="flex flex-col md:flex-row gap-4 flex-wrap mt-4"
    onClick={()=>navigate("/ad")}>
      {entries.map(([key, src], index) => {
        const isWhiteText = key === '2' || key === '5'; // keys as string

        return (
          <div
            key={index}
            className="relative w-[250px] h-[250px] rounded-lg overflow-hidden shadow-md border border-gray-200 bg-cover bg-center mt-4"
            style={{ backgroundImage: `url(${src})` }}
          >
            <div className="absolute inset-0 bg-transparent bg-opacity-40 flex items-center justify-center rotate-[-35deg]">
              <span
                className={`text-3xl font-bold animate-pulse ${
                  isWhiteText ? 'text-white' : 'text-black'
                }`}
              >
                ADVERTISEMENT
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdComponent;
