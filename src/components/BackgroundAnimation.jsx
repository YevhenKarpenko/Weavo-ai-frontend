// // BackgroundAnimation.js
// import React from 'react';
// import Wavify from 'react-wavify';

// const BackgroundAnimation = () => {
//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
//       <Wavify
//         fill="#9CBBD8"
//         paused={false}
//         options={{
//           height: 20,
//           amplitude: 40,
//           speed: 0.15,
//           points: 3
//         }}
//         style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', zIndex: -1 }}
//       />
//       <Wavify
//         fill="#B9E5E0"
//         paused={false}
//         options={{
//           height: 20,
//           amplitude: 40,
//           speed: 0.1,
//           points: 5
//         }}
//         style={{ position: 'absolute', top: '25%', left: 0, width: '100%', height: '50%', zIndex: -1 }}
//       />
//       <Wavify
//         fill="#FDE4CD"
//         paused={false}
//         options={{
//           height: 20,
//           amplitude: 40,
//           speed: 0.2,
//           points: 4
//         }}
//         style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '50%', zIndex: -1 }}
//       />
//     </div>
//   );
// };

// export default BackgroundAnimation;


// BackgroundAnimation.js
import React from 'react';
import Wavify from 'react-wavify';

const BackgroundAnimation = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      
      <Wavify
        fill="#B8E4E0"
        paused={false}
        options={{
          height: 20,
          amplitude: 40,
          speed: 0.2,
          points: 4
        }}
        style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '50%', zIndex: -1 }}
      />
      <Wavify
        fill="#FDE4CD"
        paused={false}
        options={{
          height: 20,
          amplitude: 40,
          speed: 0.2,
          points: 4
        }}
        style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '50%', zIndex: -1 }}
      />
    </div>
  );
};

export default BackgroundAnimation;
