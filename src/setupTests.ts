import '@testing-library/jest-dom/extend-expect';
import { mockIonicReact } from '@ionic/react-test-utils';

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };
mockIonicReact();
