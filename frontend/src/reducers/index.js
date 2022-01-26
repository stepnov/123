import auth from 'reducers/auth';
import alerts from 'reducers/auth';
import navigation from 'reducers/navigation';
import layout from 'reducers/layout';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import users from 'reducers/users/usersReducers';

import products from 'reducers/products/productsReducers';

import categories from 'reducers/categories/categoriesReducers';

import orders from 'reducers/orders/ordersReducers';

import reviews from 'reducers/reviews/reviewsReducers';

import promocodes from 'reducers/promocodes/promocodesReducers';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    layout,
    alerts,
    auth,
    navigation,

    users,

    products,

    categories,

    orders,

    reviews,

    promocodes,
  });
