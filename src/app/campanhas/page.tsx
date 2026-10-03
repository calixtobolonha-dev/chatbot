import type { Metadata } from "next";
import { CampaignApp } from "@/components/campaigns/CampaignApp";

export const metadata: Metadata = {
  title: "Campanhas · Chatbot GL",
};

export default function CampaignsPage() {
  return <CampaignApp />;
}
