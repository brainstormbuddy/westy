//https://stripe.com/docs/stripe-js/react
//The Elements provider wraps any subcomponents that render Stripe Elements. It expects a stripe prop and since we’re using the PaymentElement, we also need to pass an options prop.
import { loadStripe } from '@stripe/stripe-js';
import { Form, useActionData } from '@remix-run/react';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { createPaymentIntent } from '~/lib/stripePaymentIntent';
import { ActionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { useCartItems } from '~/context/useCart';
import { useState } from 'react';
import PlaySvg from '~/icons/PlaySvg';
import formatMoney from '~/lib/formatMoney';

const stripePromise = loadStripe('pk_test_CkfBPTwVc1IMB6BXSDsSytR8');

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();
  const cart = body.get('cart');
  invariant(
    typeof cart === 'string',
    'cart not submitted properly; must be a string'
  );

  return await createPaymentIntent(JSON.parse(cart));
};

export default function StripeElementsProvider() {
  const paymentIntent = useActionData<typeof action>();
  console.log('paymentIntent', paymentIntent);
  const [showSummary, toggleShowSummary] = useState(false);
  const cartItems = useCartItems();
  // The stripe prop wants either reference to a fully initialized instance of the Stripe.js client, or a promise that will eventually resolve to one. Luckily, @stripe/stripe-js has a helper for this called loadStripe where we pass in our publishable API key and get back a promise.
  // const options = {
  //   // passing the client secret obtained from the server
  //   clientSecret: '{{CLIENT_SECRET}}',
  // };

  return (
    <>
      <div className='flex p-2 w-full items-center '>
        <button
          className='self-start p-2'
          onClick={() => toggleShowSummary(!showSummary)}
        >
          <div className={`${showSummary ? 'rotate-90' : ''}`}>
            <PlaySvg />
          </div>
        </button>
        <p>{showSummary ? `Hide Summary` : `Show Summary`}</p>
        <p className='ml-auto'>T?.00</p>
      </div>
      <div>
        <p className='p-2'>
          {showSummary ? (
            <ul className='text-center '>
              {cartItems.map((cartItem) => (
                <li className='px-3' key={cartItem.coffeeName}>
                  <p className='flex'>
                    {`${cartItem.quantity} ${cartItem.coffeeName}, ${cartItem.grind}: `}
                    <span className='ml-auto'>
                      {`$${formatMoney(cartItem.price * cartItem.quantity)}`}
                    </span>
                  </p>
                </li>
              ))}
              <li className='px-3'>
                <p className='flex'>
                  Shipping:
                  <span className='ml-auto'>$?.00</span>
                </p>
              </li>
            </ul>
          ) : null}
        </p>
      </div>
      <Elements
        stripe={stripePromise}
        options={{ clientSecret: paymentIntent.client_secret }}
      >
        <Form>
          <PaymentElement />
          <button>Confirm Payment</button>
        </Form>
      </Elements>
    </>
  );
}
