import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastConfig = {
  autoClose: 3000
};

export default function ToastifyContainer() {
  return (
    <ToastContainer { ...toastConfig } />
  );
}
