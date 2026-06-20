import { useEffect, useState } from "react";

const InsertCoin = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((v) => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p
        className={`font-pixel text-electric-yellow text-lg md:text-2xl tracking-wider transition-opacity duration-100 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          textShadow:
            "0 0 10px hsl(61 100% 60% / 0.8), 0 0 20px hsl(61 100% 60% / 0.5), 0 0 30px hsl(61 100% 60% / 0.3)",
        }}
      >
        INSERT COIN
      </p>
      <p className="font-pixel text-foreground/60 text-xs md:text-sm">
        SCROLL TO START
      </p>
    </div>
  );
};

export default InsertCoin;
