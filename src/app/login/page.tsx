import React from 'react';
import LoginForm from '@/componentes/login-form/loginForm';

export default function LoginPage() {
  return (
    <div className="login-page min-h-screen relative">
      <video
        autoPlay
        muted
        loop
        className="fumacaFundo fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/video/fumaca.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}