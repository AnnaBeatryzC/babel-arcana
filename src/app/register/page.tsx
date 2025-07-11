import React from 'react';
import LoginForm from '@/componentes/login-form/loginForm';
import GlassCard from '@/componentes/GlassCard/GlassCard';

export default function RegisterPage() {
  return (
    <div className="login-page min-h-screen relative flex items-center justify-center">
      <video
        autoPlay
        muted
        loop
        className="fumacaFundo fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="/video/fumaca.mp4" type="video/mp4" />
      </video>

      <GlassCard>
        <LoginForm />
      </GlassCard>
    </div>
  );
}
