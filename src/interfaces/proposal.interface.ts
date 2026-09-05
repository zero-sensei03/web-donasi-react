export interface ProposalRes {
    id: string;
    campaignId: string;
    title: string;
    description: string;
    proposalPdfUrl: string;
    status: "DRAFT" | "ARCHIVED" | "PUBLISHED";
}