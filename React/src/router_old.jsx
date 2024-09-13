import {createBrowserRouter} from 'react-router-dom'
import Login from './views/login'
import Register from './views/register';
import Users from './views/users';
import UserForm from './views/userForm';
import DefaultLayout from './components/DefaultLayout';
import GuestLayout from './components/GuestLayout';
import Home from './components/Home';

const router = createBrowserRouter([
	{
	path: '/',
	element: <DefaultLayout />,
	children: [
	{
		path: '/users',
		element: <Users />
	},
	{
		path: '/users/new',
		element: <UserForm key="userCreate" />
	},
	{
		path: '/users/:id',
		element:<UserForm key="userUpdate" />
	}
	]
	},

	{
	path: '/',
	element: <GuestLayout />,
	children: [
	{
		path: '/login',
		element: <Login />
	},
	{
		path: '/register',
		element: <Register />
	}
	]
	},
	{
	path: '/home',
	element: <Home />
	}
]);

export default router;