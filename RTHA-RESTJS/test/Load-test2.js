import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '20s', target: 100 },
    { duration: '1m30s', target: 100 },
    { duration: '20s', target: 0 },
  ],
};

const headers = {
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRlc3RBY2NvdW50Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUwMTUxOTQ5LCJleHAiOjE3NTAxNTU1NDl9.pFysUlkjAABjLuKCuebbBIP4IwN9gL1ug2W1o3LAbTo'
};

export default function () {
  let res1 = http.get('https://api.project-d.nl/flightExport?Country=Spain', { headers });
  check(res1, {
    'flightExport status 200': (r) => r.status === 200,
    'flightExport < 800ms': (r) => r.timings.duration < 800,
  });
  console.log('FlightExport:', res1.status, res1.body);

  let res2 = http.get('https://api.project-d.nl/touchpoints?Airport=Amsterdam', { headers });
  check(res2, {
    'touchpoints status 200': (r) => r.status === 200,
    'touchpoints < 800ms': (r) => r.timings.duration < 800,
  });
  console.log('TouchPoints:', res2.status, res2.body);

  sleep(1);
}
