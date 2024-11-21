export async function login({ email, password }) {
  try {
    const response = await fetch('https://v2.api.noroff.dev/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.errors?.[0]?.message || errorData.message || 'Login failed';

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

export async function onLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const loginData = {
    email: email,
    password: password,
  };

  try {
    const response = await login(loginData);
    const userToken = response.data.accessToken;
    const name = response.data.name;

    if (userToken) {
      localStorage.setItem('userToken', userToken);
      localStorage.setItem('name', name);

      alert('Login successful!');
      window.location.href = '/index.html';
    } else {
      console.log('User Token not found in response:', response);
      alert('Login failed: Token not found.');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert(error.message);
  }
}
