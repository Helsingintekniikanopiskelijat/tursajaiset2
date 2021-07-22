export interface MainNavigation {
    mainLinks: NavigationCategory[]
}

export interface NavigationCategory {
    categoryMainSite: SiteLink
    categorieSites?: SiteLink[]
}

export interface SiteLink {
    navigationName: string
    navigationUrl: string
}