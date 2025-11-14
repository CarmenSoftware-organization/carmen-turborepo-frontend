"use client";

import { Button } from "@/components/ui/button";
import { CampaignDetailDto } from "@/dtos/campaign.dto";
import { formType } from "@/dtos/form.dto";
import { useState } from "react";

interface Props {
  readonly campaignData?: CampaignDetailDto;
  readonly mode: formType;
}

export default function MainForm({ campaignData, mode }: Props) {
  const [currentMode, setCurrentMode] = useState<formType>(mode);

  return (
    <main>
      <h1>{currentMode}</h1>
      <Button onClick={() => setCurrentMode(formType.EDIT)}>Edit</Button>
      <Button onClick={() => setCurrentMode(formType.VIEW)}>View</Button>

      <pre>{JSON.stringify(campaignData, null, 2)}</pre>
    </main>
  );
}
