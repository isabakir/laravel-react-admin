import { Home } from '../views/__backoffice';
import * as Settings from '../views/__backoffice/settings';
import * as Users from '../views/__backoffice/users';
import * as TaskManager from '../views/__backoffice/TaskManager';

const resources = [
    {
        name: 'users.index',
        path: '/users',
        component: Users.List,
    },

    {
        name: 'users.create',
        path: '/users/create',
        component: Users.Create,
    },

    {
        name: 'users.edit',
        path: '/users/:id/edit',
        component: Users.Edit,
    },
].map(route => {
    route.name = `resources.${route.name}`;
    route.path = `/resources${route.path}`;

    return route;
});

//task manager
const taskManagerRoutes = [
    {
        name: 'taskManager.index',
        path: '/taskManager',
        component: TaskManager.List,
    },

        {
            name: 'taskManager.create',
            path: '/taskManager/create',
            component: TaskManager.Create,
        },

            {
                name: 'taskManager.edit',
                path: '/taskManager/:id/edit',
                component: TaskManager.Edit,
            },
].map(route => ({
    ...route,
    name: `${route.name}`,
    path: `/taskManager${route.path}`,
}));
console.log(taskManagerRoutes)

export default [
    {
        name: 'home',
        path: '/',
        component: Home,
    },

    {
        name: 'settings.profile',
        path: '/settings/profile',
        component: Settings.Profile,
    },

    {
        name: 'settings.account',
        path: '/settings/account',
        component: Settings.Account,
    },

    ...resources,
    ...taskManagerRoutes,
].map(route => {
    route.name = `backoffice.${route.name}`;
    route.auth = true;

    return route;
});
