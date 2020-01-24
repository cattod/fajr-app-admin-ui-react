
interface IRouteBase {
    name: string;
    sidebarVisible: boolean;
    breadcrumbVisible: boolean;
    icon?: string;
}

export interface IRoute extends IRouteBase {
    path: string; // href for app outside link
    // pageTitle?: string;
    pageTitleVisible: boolean;
    // permission: () => boolean;
}

export interface IRouteParent extends IRouteBase {
    children: Array<IRoute | IRouteParent>;
}

export type IAppRoute = Array<IRoute | IRouteParent>;

export class AppRoute {
    private static readonly routes: IAppRoute = [
        {
            path: '/dashboard',
            name: 'dashboard',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-dashboard'
        },
        {
            path: '/profile',
            name: 'profile',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-picture-o'
        },
        {
            name: 'tools',
            sidebarVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-link',
            children: [
                {
                    path: '/blank',
                    name: 'blank',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-file-o'
                },
                {
                    name: 'inner1',
                    sidebarVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-home',
                    children: [
                        {
                            path: '/test1',
                            name: 'test1',
                            sidebarVisible: false,
                            pageTitleVisible: true,
                            breadcrumbVisible: true,
                            icon: 'fa fa-file-o'
                        },
                        {
                            path: '/test2',
                            name: 'test2',
                            sidebarVisible: true,
                            pageTitleVisible: true,
                            breadcrumbVisible: true,
                            icon: 'fa fa-file-o'
                        },
                        {
                            name: 'inner2',
                            sidebarVisible: true,
                            breadcrumbVisible: true,
                            icon: 'fa fa-home',
                            children: [
                                {
                                    path: '/test12',
                                    name: 'test12',
                                    sidebarVisible: true,
                                    pageTitleVisible: true,
                                    breadcrumbVisible: true,
                                    icon: 'fa fa-file-o'
                                },
                                {
                                    path: '/test22',
                                    name: 'test22',
                                    sidebarVisible: true,
                                    pageTitleVisible: true,
                                    breadcrumbVisible: true,
                                    icon: 'fa fa-file-o'
                                },
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    static getRoutes(): IAppRoute {
        return this.routes;
    }

    static getAllChildrenPath(parentRoute: IRouteParent): Array<string> {
        const list: string[] = [];
        const getPath = (children: IRouteParent['children']) => {
            children.forEach(item => {
                if ((item as any).children) {
                    getPath((item as any).children);
                } else {
                    list.push((item as IRoute).path);
                }
            });
        };
        getPath(parentRoute.children);
        return list;
    }

}
