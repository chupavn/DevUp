export interface Quiz {
    Id: number;
    HostId: string;
    Host: any; // User
    Title: string;
    MetaTitle: string;
    Slug: string;
    Summary: string;
    Type?: number;
    Score: number;
    Published: boolean;
    CreateAt: Date;
    UpdateAt?:Date;
    PublishedAt?:Date;
    StartAt?:Date;
    EndAt?:Date;
    Content:string;
}
