// components/SportsWidget.tsx

import { useEffect } from 'react';

const SportsWidget: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widgets.api-sports.io/2.0.3/widgets.js';
    script.async = true;
    script.onload = () => {
      if (window && (window as any).apiSportsWidget) {
        (window as any).apiSportsWidget({
          widget: 'your-widget-type',
          // other widget parameters
        });
      }
    };
    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="widget-container"></div>;
};

export default SportsWidget;
