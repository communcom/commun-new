import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getBuyPrice } from 'store/actions/gate';
import { useIsMountedRef } from 'utils/hooks';
import { displayError } from 'utils/toastsMessages';

export default function useGetPoints({ symbol }) {
  const dispatch = useDispatch();
  const [price, setPrice] = useState(0);

  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    async function getPrice() {
      try {
        const result = await dispatch(getBuyPrice(symbol, '1 CMN'));

        if (isMountedRef.current) {
          setPrice(result.price.split(' ')[0]);
        }
      } catch (err) {
        displayError(err);
      }
    }

    getPrice();
  }, [symbol, isMountedRef, dispatch]);

  return price;
}
