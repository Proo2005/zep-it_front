"use client";

import { useEffect } from "react";


export default function LoginSuccess ({
  onDone,
}: {
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => {
      onDone();
    }, 2200); // total animation time

    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="overlay">
      <div className="card">
        <div className="check" />
        <div className="title">Login Successful</div>
        <div className="sub">Welcome on Board</div>
      </div>
      <style jsx>{`
        .overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  width: 320px;
  text-align: center;
  animation: pop 0.35s ease-out;
}

@keyframes pop {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.check {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px solid #0c831f;
  margin: 0 auto 16px;
  position: relative;
  animation: scaleIn 0.4s ease forwards;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.check::after {
  content: "";
  position: absolute;
  width: 28px;
  height: 14px;
  border-left: 4px solid #0c831f;
  border-bottom: 4px solid #0c831f;
  transform: rotate(-45deg);
  left: 26px;
  top: 36px;
  animation: draw 0.3s ease 0.4s forwards;
  opacity: 0;
}

@keyframes draw {
  to {
    opacity: 1;
  }
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: #000;
}

.sub {
  font-size: 14px;
  color: #666;
  margin-top: 6px;
}

      `}</style>
    </div>
  );
}
