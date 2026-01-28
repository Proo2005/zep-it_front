"use client";


export default function LoginSuccess() {
  return (
    <div className="login-success-overlay">
      <div className="success-box">
        <div className="checkmark" />
        <div className="success-title">Login Successful</div>
        <div className="success-sub">Redirecting to your account…</div>
      </div>
      <style jsx>{`
        /* Overlay */
.login-success-overlay {
  position: fixed;
  inset: 0;
  background: #0c831f;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}

/* Card */
.success-box {
  background: white;
  border-radius: 24px;
  padding: 40px 48px;
  text-align: center;
  animation: scaleIn 0.5s ease forwards;
}

@keyframes scaleIn {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Check animation */
.checkmark {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #0c831f;
  position: relative;
  margin: 0 auto 20px;
  animation: pop 0.4s ease forwards;
}

@keyframes pop {
  0% { transform: scale(0) }
  80% { transform: scale(1.1) }
  100% { transform: scale(1) }
}

.checkmark::after {
  content: "";
  position: absolute;
  left: 22px;
  top: 40px;
  width: 18px;
  height: 36px;
  border-right: 4px solid #0c831f;
  border-bottom: 4px solid #0c831f;
  transform: rotate(45deg);
  animation: draw 0.4s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
}

@keyframes draw {
  to {
    opacity: 1;
  }
}

/* Text */
.success-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}

.success-sub {
  font-size: 14px;
  color: #666;
}


      `}</style>
    </div>
  );
}
