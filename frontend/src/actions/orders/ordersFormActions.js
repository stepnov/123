import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { toast } from 'react-toastify';

const actions = {
  doNew: () => {
    return {
      type: 'ORDERS_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'ORDERS_FORM_FIND_STARTED',
      });

      axios.get(`/orders/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'ORDERS_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ORDERS_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/orders'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'ORDERS_FORM_CREATE_STARTED',
      });

      axios.post('/orders', { data: values }).then((res) => {
        dispatch({
          type: 'ORDERS_FORM_CREATE_SUCCESS',
        });

        toast.success('Orders created');
        dispatch(push('/admin/orders'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ORDERS_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'ORDERS_FORM_UPDATE_STARTED',
      });

      await axios.put(`/orders/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'ORDERS_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        toast.success('Profile updated');
      } else {
        toast.success('Orders updated');
        dispatch(push('/admin/orders'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'ORDERS_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
