"use client";

import { useState } from "react";
import DoorIntro from "./DoorIntro";
import MainSite from "./MainSite";

export default function InvitationExperience() {
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <DoorIntro onRevealed={() => setRevealed(true)} />
      {revealed && <MainSite />}
    </>
  );
}
