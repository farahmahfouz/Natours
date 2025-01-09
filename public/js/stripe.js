import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe (
  'pk_test_51QfRj1FbvQUJDkwAXKKmNbOT4Kt1LWhred1KpHlFWvuQKxbTIkzyYsP0Du0G2WfNZYVLQmx2ewDEvspNfGlIBZz100bytAOgFW'
);

export const bookTour = async (tourId) => {
  try {
    // 1) get checkout session from API
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);
    console.log(session);
    // 2) Create checkout form + charge creidt card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};


// import { loadStripe } from '@stripe/stripe-js';
// import axios from 'axios';
// import { showAlert } from './alerts';

// const stripePromise = loadStripe('pk_test_51QfRj1FbvQUJDkwAXKKmNbOT4Kt1LWhred1KpHlFWvuQKxbTIkzyYsP0Du0G2WfNZYVLQmx2ewDEvspNfGlIBZz100bytAOgFW');

// export const bookTour = async (tourId) => {
//   try {
//     // 1) احصل على الجلسة من الـ API
//     const response = await axios(`/api/v1/booking/checkout-session/${tourId}`);
//     console.log(response);  // تأكد من وجود بيانات الجلسة هنا

//     // 2) إذا كانت الجلسة موجودة، قم بتمرير sessionId لـ Stripe
//     if (response.data && response.data.session && response.data.session.id) {
//       const stripe =  stripePromise;
//       await stripe.redirectToCheckout({
//         sessionId: response.data.session.id,
//       });
//     } else {
//       console.error("لم يتم العثور على sessionId في الاستجابة");
//     }
//   } catch (err) {
//     console.log("حدث خطأ:", err);
//     showAlert('error', err);
//   }
// };
