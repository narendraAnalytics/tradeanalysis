"use client";

export function BannerEffects() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Moving Light Orbs */}
      <div className="moving-light light-1" />
      <div className="moving-light light-2" />
      <div className="moving-light light-3" />
      <div className="moving-light light-4" />
      <div className="moving-light light-5" />

      {/* Blinking Dots - Positioned across India map area */}
      <div className="blinking-dot dot-1" />
      <div className="blinking-dot dot-2" />
      <div className="blinking-dot dot-3" />
      <div className="blinking-dot dot-4" />
      <div className="blinking-dot dot-5" />
      <div className="blinking-dot dot-6" />
      <div className="blinking-dot dot-7" />
      <div className="blinking-dot dot-8" />
      <div className="blinking-dot dot-9" />
      <div className="blinking-dot dot-10" />

      <style jsx>{`
        /* Moving Light Orbs */
        .moving-light {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 215, 0, 0.4) 0%,
            rgba(255, 165, 0, 0.2) 30%,
            rgba(255, 140, 0, 0.1) 50%,
            transparent 70%
          );
          filter: blur(20px);
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }

        .light-1 {
          top: 15%;
          left: 35%;
          animation: float1 4s infinite;
        }

        .light-2 {
          top: 40%;
          left: 45%;
          animation: float2 5s infinite;
          animation-delay: 1s;
        }

        .light-3 {
          top: 60%;
          left: 40%;
          animation: float3 4.5s infinite;
          animation-delay: 2s;
        }

        .light-4 {
          top: 25%;
          left: 50%;
          animation: float4 5.5s infinite;
          animation-delay: 0.5s;
        }

        .light-5 {
          top: 50%;
          left: 52%;
          animation: float5 4.2s infinite;
          animation-delay: 1.5s;
        }

        /* Blinking Dots */
        .blinking-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 215, 0, 1) 0%,
            rgba(255, 165, 0, 0.8) 50%,
            rgba(255, 140, 0, 0.3) 100%
          );
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.8),
            0 0 20px rgba(255, 165, 0, 0.5);
          animation: blink 3s infinite;
        }

        /* Dot positions across India map */
        .dot-1 {
          top: 18%;
          left: 42%;
          animation-delay: 0s;
        }

        .dot-2 {
          top: 25%;
          left: 45%;
          animation-delay: 0.5s;
        }

        .dot-3 {
          top: 32%;
          left: 43%;
          animation-delay: 1s;
        }

        .dot-4 {
          top: 40%;
          left: 46%;
          animation-delay: 1.5s;
        }

        .dot-5 {
          top: 48%;
          left: 44%;
          animation-delay: 2s;
        }

        .dot-6 {
          top: 55%;
          left: 47%;
          animation-delay: 2.5s;
        }

        .dot-7 {
          top: 28%;
          left: 48%;
          animation-delay: 0.8s;
        }

        .dot-8 {
          top: 38%;
          left: 50%;
          animation-delay: 1.8s;
        }

        .dot-9 {
          top: 45%;
          left: 48%;
          animation-delay: 2.2s;
        }

        .dot-10 {
          top: 52%;
          left: 45%;
          animation-delay: 1.2s;
        }

        /* Animation Keyframes */
        @keyframes float1 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(30px, -20px) scale(1.1);
            opacity: 0.6;
          }
          100% {
            transform: translate(-20px, 30px) scale(0.9);
            opacity: 0.3;
          }
        }

        @keyframes float2 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-25px, 35px) scale(1.15);
            opacity: 0.5;
          }
          100% {
            transform: translate(25px, -25px) scale(0.95);
            opacity: 0.4;
          }
        }

        @keyframes float3 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.35;
          }
          50% {
            transform: translate(20px, 30px) scale(1.05);
            opacity: 0.55;
          }
          100% {
            transform: translate(-30px, -20px) scale(1);
            opacity: 0.35;
          }
        }

        @keyframes float4 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(-30px, -25px) scale(1.12);
            opacity: 0.6;
          }
          100% {
            transform: translate(35px, 20px) scale(0.92);
            opacity: 0.35;
          }
        }

        @keyframes float5 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.38;
          }
          50% {
            transform: translate(28px, -30px) scale(1.08);
            opacity: 0.58;
          }
          100% {
            transform: translate(-22px, 25px) scale(0.96);
            opacity: 0.32;
          }
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          20% {
            opacity: 1;
            transform: scale(1.2);
          }
          40% {
            opacity: 0.4;
            transform: scale(1);
          }
          60% {
            opacity: 0.8;
            transform: scale(1.1);
          }
          80% {
            opacity: 0.3;
            transform: scale(0.9);
          }
        }
      `}</style>
    </div>
  );
}
