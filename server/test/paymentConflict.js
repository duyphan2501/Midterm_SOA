import axios from "axios";

const req1 = () =>
  axios.put("http://localhost:3000/api/payments/process", {
    otpCode: "111111",
    payment: {
      payment_id: 3,
      tuition_id: 2,
      payer_id: 1,
      amount: 4500000,
    },
  });

const req2 = () =>
  axios.put("http://localhost:3000/api/payments/process", {
    otpCode: "222222",
    payment: {
      payment_id: 4,
      tuition_id: 2,
      payer_id: 2,
      amount: 4500000,
    },
  });

const test = async () => {
  const results = await Promise.allSettled([
    (async () => {
      const start = Date.now();
      try {
        const res = await req1();
        console.log(`req1 started at ${start}, finished in ${Date.now() - start}ms`);
        return res;
      } catch (err) {
        console.log(`req1 started at ${start}, finished in ${Date.now() - start}ms`);
        throw err;
      }
    })(),
    (async () => {
      const start = Date.now();
      try {
        const res = await req2();
        console.log(`req2 started at ${start}, finished in ${Date.now() - start}ms`);
        return res;
      } catch (err) {
        console.log(`req2 started at ${start}, finished in ${Date.now() - start}ms`);
        throw err;
      }
    })(),
  ]);

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`Response ${index + 1}:`, result.value.data);
    } else {
      console.log(
        `Error in request ${index + 1}:`,
        result.reason.response ? result.reason.response.data : result.reason.message
      );
    }
  });
};

test();
