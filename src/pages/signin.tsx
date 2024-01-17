import React from 'react';
import BackToTop from '../components/back-to-top/back-to-top';
import ChangeTheme from '../components/change-theme/change-theme';
import Login from '../components/Login';

function LoginPage() {

  return (
    <>
      <BackToTop />
      <ChangeTheme />
      <Login />
    </>
  )
}

export default LoginPage
