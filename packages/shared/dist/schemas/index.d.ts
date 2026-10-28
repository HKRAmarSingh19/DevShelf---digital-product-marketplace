import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const resetPasswordSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    token: string;
}, {
    password: string;
    token: string;
}>;
export declare const updateProfileSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    bio?: string | undefined;
    avatarUrl?: string | undefined;
}, {
    name?: string | undefined;
    bio?: string | undefined;
    avatarUrl?: string | undefined;
}>;
export declare const sellerApplicationSchema: z.ZodObject<{
    bio: z.ZodString;
    portfolioUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    githubUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    categoriesInterested: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    bio: string;
    categoriesInterested: string[];
    portfolioUrl?: string | undefined;
    githubUrl?: string | undefined;
}, {
    bio: string;
    categoriesInterested: string[];
    portfolioUrl?: string | undefined;
    githubUrl?: string | undefined;
}>;
export declare const createProductSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    categoryId: z.ZodString;
    productType: z.ZodEnum<["SOURCE_CODE", "EBOOK", "COURSE", "UI_KIT", "TEMPLATE", "DEVELOPER_TOOL", "OTHER"]>;
    priceInRupees: z.ZodNumber;
    thumbnailUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    previewUrls: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    categoryId: string;
    productType: "SOURCE_CODE" | "EBOOK" | "COURSE" | "UI_KIT" | "TEMPLATE" | "DEVELOPER_TOOL" | "OTHER";
    priceInRupees: number;
    previewUrls: string[];
    tags: string[];
    thumbnailUrl?: string | undefined;
}, {
    title: string;
    description: string;
    categoryId: string;
    productType: "SOURCE_CODE" | "EBOOK" | "COURSE" | "UI_KIT" | "TEMPLATE" | "DEVELOPER_TOOL" | "OTHER";
    priceInRupees: number;
    thumbnailUrl?: string | undefined;
    previewUrls?: string[] | undefined;
    tags?: string[] | undefined;
}>;
export declare const updateProductSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodOptional<z.ZodString>;
    productType: z.ZodOptional<z.ZodEnum<["SOURCE_CODE", "EBOOK", "COURSE", "UI_KIT", "TEMPLATE", "DEVELOPER_TOOL", "OTHER"]>>;
    priceInRupees: z.ZodOptional<z.ZodNumber>;
    thumbnailUrl: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    previewUrls: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
} & {
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    categoryId?: string | undefined;
    productType?: "SOURCE_CODE" | "EBOOK" | "COURSE" | "UI_KIT" | "TEMPLATE" | "DEVELOPER_TOOL" | "OTHER" | undefined;
    priceInRupees?: number | undefined;
    thumbnailUrl?: string | undefined;
    previewUrls?: string[] | undefined;
    tags?: string[] | undefined;
}, {
    status?: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED" | undefined;
    title?: string | undefined;
    description?: string | undefined;
    categoryId?: string | undefined;
    productType?: "SOURCE_CODE" | "EBOOK" | "COURSE" | "UI_KIT" | "TEMPLATE" | "DEVELOPER_TOOL" | "OTHER" | undefined;
    priceInRupees?: number | undefined;
    thumbnailUrl?: string | undefined;
    previewUrls?: string[] | undefined;
    tags?: string[] | undefined;
}>;
export declare const createProductVersionSchema: z.ZodObject<{
    version: z.ZodString;
    changelog: z.ZodString;
    storageKey: z.ZodString;
    originalFilename: z.ZodString;
    fileSizeBytes: z.ZodNumber;
    checksum: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    version: string;
    changelog: string;
    storageKey: string;
    originalFilename: string;
    fileSizeBytes: number;
    checksum?: string | undefined;
}, {
    version: string;
    changelog: string;
    storageKey: string;
    originalFilename: string;
    fileSizeBytes: number;
    checksum?: string | undefined;
}>;
export declare const checkoutSchema: z.ZodObject<{
    productIds: z.ZodArray<z.ZodString, "many">;
    licenseType: z.ZodDefault<z.ZodEnum<["STANDARD", "COMMERCIAL", "EXTENDED"]>>;
    couponCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    productIds: string[];
    licenseType: "STANDARD" | "COMMERCIAL" | "EXTENDED";
    couponCode?: string | undefined;
}, {
    productIds: string[];
    licenseType?: "STANDARD" | "COMMERCIAL" | "EXTENDED" | undefined;
    couponCode?: string | undefined;
}>;
export declare const paymentVerifySchema: z.ZodObject<{
    orderId: z.ZodString;
    razorpayOrderId: z.ZodString;
    razorpayPaymentId: z.ZodString;
    razorpaySignature: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}, {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}>;
export declare const createReviewSchema: z.ZodObject<{
    rating: z.ZodNumber;
    comment: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rating: number;
    comment: string;
}, {
    rating: number;
    comment: string;
}>;
export declare const adminSellerDecisionSchema: z.ZodObject<{
    decision: z.ZodEnum<["APPROVED", "REJECTED"]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    decision: "APPROVED" | "REJECTED";
    notes?: string | undefined;
}, {
    decision: "APPROVED" | "REJECTED";
    notes?: string | undefined;
}>;
export declare const adminProductModerationSchema: z.ZodObject<{
    decision: z.ZodEnum<["PUBLISHED", "REJECTED", "ARCHIVED"]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    decision: "REJECTED" | "PUBLISHED" | "ARCHIVED";
    notes?: string | undefined;
}, {
    decision: "REJECTED" | "PUBLISHED" | "ARCHIVED";
    notes?: string | undefined;
}>;
export declare const adminUserStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["ACTIVE", "SUSPENDED"]>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "SUSPENDED" | "ACTIVE";
    reason?: string | undefined;
}, {
    status: "SUSPENDED" | "ACTIVE";
    reason?: string | undefined;
}>;
//# sourceMappingURL=index.d.ts.map