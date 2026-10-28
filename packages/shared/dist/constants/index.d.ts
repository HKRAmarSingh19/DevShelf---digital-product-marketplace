export declare const USER_ROLES: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
};
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export declare const SELLER_STATUS: {
    readonly NOT_APPLIED: "NOT_APPLIED";
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly SUSPENDED: "SUSPENDED";
};
export type SellerStatus = (typeof SELLER_STATUS)[keyof typeof SELLER_STATUS];
export declare const USER_STATUS: {
    readonly ACTIVE: "ACTIVE";
    readonly SUSPENDED: "SUSPENDED";
    readonly DELETED: "DELETED";
};
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export declare const PRODUCT_TYPES: {
    readonly SOURCE_CODE: "SOURCE_CODE";
    readonly EBOOK: "EBOOK";
    readonly COURSE: "COURSE";
    readonly UI_KIT: "UI_KIT";
    readonly TEMPLATE: "TEMPLATE";
    readonly DEVELOPER_TOOL: "DEVELOPER_TOOL";
    readonly OTHER: "OTHER";
};
export type ProductType = (typeof PRODUCT_TYPES)[keyof typeof PRODUCT_TYPES];
export declare const PRODUCT_STATUS: {
    readonly DRAFT: "DRAFT";
    readonly PENDING_REVIEW: "PENDING_REVIEW";
    readonly PUBLISHED: "PUBLISHED";
    readonly REJECTED: "REJECTED";
    readonly ARCHIVED: "ARCHIVED";
};
export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];
export declare const ORDER_STATUS: {
    readonly PENDING: "PENDING";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
    readonly CANCELLED: "CANCELLED";
    readonly PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED";
    readonly REFUNDED: "REFUNDED";
};
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export declare const PAYMENT_STATUS: {
    readonly CREATED: "CREATED";
    readonly AUTHORIZED: "AUTHORIZED";
    readonly CAPTURED: "CAPTURED";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
};
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export declare const ENTITLEMENT_STATUS: {
    readonly ACTIVE: "ACTIVE";
    readonly REVOKED: "REVOKED";
};
export type EntitlementStatus = (typeof ENTITLEMENT_STATUS)[keyof typeof ENTITLEMENT_STATUS];
export declare const LICENSE_TYPES: {
    readonly STANDARD: "STANDARD";
    readonly COMMERCIAL: "COMMERCIAL";
    readonly EXTENDED: "EXTENDED";
};
export type LicenseType = (typeof LICENSE_TYPES)[keyof typeof LICENSE_TYPES];
export declare const CURRENCY: {
    readonly INR: "INR";
};
export declare const DEFAULT_PLATFORM_FEE_PERCENTAGE = 10;
//# sourceMappingURL=index.d.ts.map