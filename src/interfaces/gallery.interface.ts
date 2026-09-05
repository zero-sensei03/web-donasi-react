export interface GalleryRes {
    id: string;
    campaignId: string;
    galleryType: "IMAGE" | "VIDEO";
    imageUrl: string;
    videoUrl: string | null;
    title: string;
    description: string | null;
    timeStamp: string;
}