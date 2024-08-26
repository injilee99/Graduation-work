import React, { useState } from 'react';

function SignUp() {
  const [email, setEmail] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCheckEmail = async () => {
    try {
      const response = await fetch('http://43.203.198.147:8080/api/auth/email-authentication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        alert('인증번호가 전송되었습니다.');
        setVerificationSent(true);
      } else {
        alert('이메일 중복 또는 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버가 연결이 되어있지 않습니다..');
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <div>
        <label>이메일</label>
        <input type="email" value={email} onChange={handleEmailChange} required />
        <button type="button" onClick={handleCheckEmail}>중복 확인</button>
      </div>
      {verificationSent && (
        <div>
          <label>인증번호</label>
          <input type="text" placeholder="인증번호 입력" />
          <button type="button">인증 확인</button>
        </div>
      )}
    </div>
  );
}

export default SignUp;
