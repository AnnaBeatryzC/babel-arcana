import React from 'react';
import LoginForm from '@/componentes/login-form/loginForm';
import GlassCard from '@/componentes/GlassCard/GlassCard';

export default function RegisterPage() {
  return (
    <div className="login-page min-h-screen relative flex items-center justify-center">
      <GlassCard>
        <LoginForm />
      </GlassCard>
    </div>
  );
}
