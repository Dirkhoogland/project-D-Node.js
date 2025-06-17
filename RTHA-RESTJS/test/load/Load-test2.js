import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '20s', target: 100 },
    { duration: '1m30s', target: 100 },
    { duration: '20s', target: 0 },
  ],
};

export function setup() {
  const loginPayload = JSON.stringify({
    username: 'TestAccount',
    password: 'Testingrtha',
  });

  const loginHeaders = {
    'Content-Type': 'application/json',
  };

  const loginRes = http.post('https://api.project-d.nl/auth/login', loginPayload, {
    headers: loginHeaders,
  });

  console.log('Login response status:', loginRes.status);
  console.log('Login response body:', loginRes.body); 

  check(loginRes, {
    'logged in successfully': (res) => res.status === 201 && res.body.length > 0,
  });

  return { token: loginRes.body };
}

export default function (data) {
  const headers = {
    Authorization: `Bearer ${data.token}`,
  };

  console.log('Using token:', data.token);

  let res1 = http.get('https://api.project-d.nl/flightExport?Country=Spain', { headers });
  check(res1, {
    'flightExport status 200': (r) => r.status === 200,
    'flightExport < 800ms': (r) => r.timings.duration < 800,
  });
  console.log('FlightExport:', res1.status);

  let res2 = http.get('https://api.project-d.nl/touchpoints?Airport=Amsterdam', { headers });
  check(res2, {
    'touchpoints status 200': (r) => r.status === 200,
    'touchpoints < 800ms': (r) => r.timings.duration < 800,
  });
  console.log('TouchPoints:', res2.status);

  sleep(1);
}
