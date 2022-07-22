import { useEffect } from "react";
import { ADS_ID } from "../lib/constants";

export default function Banner({
  className,
  style,
  layout,
  format,
  client = ADS_ID,
  slot,
  responsive,
  layoutKey,
  auto,
}) {
  useEffect(() => {
    try {
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {
      console.error(`Adsense Error: `, e.messenge);
    }
  });
  return (
    <>
      <div className={className}>
        <ins
          className="adsbygoogle"
          style={style}
          data-ad-layout={layout}
          data-ad-format={format}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-layout-key={layoutKey}
          data-full-width-responsive={responsive}
        />
      </div>
    </>
  );
}
