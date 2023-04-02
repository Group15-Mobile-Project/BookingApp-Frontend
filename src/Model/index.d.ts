export interface USER {
    id: number,
    username: string,
    email: string,
    roles: string[],
    hasHost: boolean,
    hostId: number | null,
    imgUrls: string | null,
    rating:  number | null,
    reviewNums: number

}

export interface declaredStateUser  {
    authUser: USER | {},
    otherUser: USER | {},
    users: USER[] | [],
    userSuccess: boolean,
    userError: boolean,
    userUpdateStatus: boolean,
    userUpdated: USER | {},
    message: string | null
}

export interface ACTION {
    type: string,
    payload?: any
}

export interface LoginForm {
    username: string,
    password: string
}

export interface UserRegisterForm {
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    imageurl?: string
}

export interface CHANGEPASSWORD {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
}

export interface ImageData {
    image: string
}

export interface COUNTRY {
    id: number,
    name: string
}

export interface CITY {
    id: number,
    name: string,
    country: Country
}
export interface HOMECATEGORY {
    id: number,
    name: string,
    imageUrl: string
}

export interface HOST {
    id: number,
    user: USER
}

export interface DISCOUNT {
    id: number,
    openDate: string,
    closeDate: string,
    discountRate: number,
    homeId: number
}

export interface DISCOUNTFORM {
    openDate: string,
    closeDate: string,
    discountRate: number,
    homeId: number
}

export interface DeclaredStateDiscount {
    discount: DISCOUNT | {},
    discounts: DISCOUNT[] | [],
    discountSuccess: boolean,
    discountError: boolean,
    message: string | null
}

export interface HOME {
    id: number,
    openBooking: string,
    closeBooking: string,
    title: string,
    price: number,
    address: string,
    city: CITY,
    country: COUNTRY,
    latitude: string,
    longtitude: string,
    zipcode: string,
    imgUrls: string[],
    beds: number,
    bedrooms: number,
    capacity: number,
    rating: number | null,
    reviewNums: number,
    homeCategory: HOMECATEGORY,
    owner: HOST,
    discount: DISCOUNT | null
}
export interface declaredStateHome  {
    home: HOME | {},
    homes: HOME[] | [],
    homeSuccess: boolean,
    homeError: boolean,  
    message: string | null
}

export interface HomePost {
    openBooking: string,
    closeBooking: string,
    title: string,
    price: number,
    address: string,
    city: string,
    country: string,
    zipcode: string,
    imgUrls: string[],
    beds: number,
    bedrooms: number,
    capacity: number,
    homeCategoryId: number
}

export interface HomeUpdate {
    closeBooking?: string,
    price?: number,
    imgUrls?: string[],
    beds?: number,
    bedrooms?: number,
    capacity?: number
}
export interface COUNTRY {
    id: number,
    name: string
}
export interface declaredStateCountry  {
    country: COUNTRY | {},
    countries: COUNTRY[] | [],
    countrySuccess: boolean,
    countryError: boolean,  
    message: string | null
}
export interface CITY {
    id: number,
    name: string,
    country: COUNTRY
}
export interface declaredStateCity  {
    city: CITY | {},
    cities: CITY[] | [],
    citySuccess: boolean,
    cityError: boolean,  
    message: string | null
}
export interface CATEGORY {
    id: number,
    name: string,
    imageUrl: string
}
export interface declaredStateCategory {
    category: CATEGORY | {},
    categories: CATEGORY[] | [],
    categorySuccess: boolean,
    categoryError: boolean,
    message: string |null
}
export interface CategoryPost {
    name: string,
    imageUrl: string
}

export interface HOST {
    id: number,
    user: USER
}

export interface declaredStateHost {
    authHost: HOST | {},
    host: HOST | {},
    hosts: HOST[] | [],
    hostSuccess: boolean,
    hostError: boolean,
    message: string | null
}

export interface HOMEREVIEW {
    id: number,
    content: string,
    rating: number,
    home: HOME,
    bookingId: number,
    user: USER,
    createDate: string,
    updateDate: string
}

export interface HOMEREVIEWFORM {
    content: string,
    rating: number,
    homeId: number,
    bookingId: number,
    userId: number
}

export interface declaredStateHomeReview {
    review: HOMEREVIEW | {},
    reviews: HOMEREVIEW[],
    reviewSuccess: boolean,
    reviewError: boolean,
    message: string | null
}

export interface WISHLIST {
    id: number,
    user: USER,
    homeResponse: HOME
}

export interface declaredStateWishlist {
    wishlist: WISHLIST | {},
    wishlists: WISHLIST[],
    wishlistSuccess: boolean,
    wishlistError: boolean,
    message: string | null
}

export interface BOOKDATE {
    id: number,
    homeId: number,
    date: string
}

export interface declaredStateBookDate {
    bookdate: BOOKDATE | {},
    bookdates: BOOKDATE[] | [],
    bookdateSuccess: boolean,
    bookdateError: boolean,
    message: string | null
}

export interface BOOKING {
    id: number,
    bookingCode: string,
    guests: number,
    days: number,
    totalPrice: number,
    checkInDate: string,
    checkOutDate: string,
    discountRate: number | null,
    home: HOME,
    tenant: USER,
    createDate: string,
    updateDate: string,
    priceAfterDiscount: number,
    status: string,
    paid: boolean
}

export interface BOOKINGFORM {
    guests: number,
    days: number,
    totalPrice: number,
    checkInDate: string,
    checkOutDate: string,
    homeId: number,
    priceAfterDiscount: number
}

export interface declaredStateBooking {
    booking: BOOKING | {},
    bookings: BOOKING[] | [],
    bookingSuccess: boolean,
    bookingError: boolean,
    message: string | null,
    countDiscount: CountDiscount | null
}

export interface TENANTREVIEW {
    id: number,
    content: string,
    rating: number,
    tenant: USER,
    host: HOST,
    home: HOME,
    bookingId: number,
    createDate: string,
    updateDate: string
}

export interface TenantReviewForm {
    content: string,
    rating: number,
    tenantId: number,
    homeId: number,
    bookingId: number,
}

export interface declaredStateTenantReview {
    tenantReview: TENANTREVIEW | {},
    tenantReviews: TENANTREVIEW[] | [],
    tenantReviewSuccess: boolean,
    tenantReviewError: boolean,
    message: string | null
}

export interface CountDiscount {
    discountPrice: number,
    priceAfterDiscount: number,
    totalPrice: number,
    homeId: number,
    checkIn: string,
    checkOut: string
}

export interface NOTIFICATION {
    id: number,
    status: string,
    dateCreated: string,
    dateUpdated: string,
    tenant: USER,
    host: HOST,
    homeId: number,
    bookingId: number | null,
    bookingCode: string |null,
    read: boolean
}

export interface declaredStateNotification {
    notification: NOTIFICATION | {},
    notifications: NOTIFICATION[] | [],
    notificationSuccess: boolean,
    notificationError: boolean,
    message: string | null
}