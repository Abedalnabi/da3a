import InvitationCard from "./sections/InvitationCard";
import Countdown from "./sections/Countdown";
import Venue from "./sections/Venue";
import SaveTheDate from "./sections/SaveTheDate";
import Notes from "./sections/Notes";
import Footer from "./sections/Footer";
import FloatingFlowers from "./ornaments/FloatingFlowers";
import PetalFall from "./ornaments/PetalFall";
import PetalRise from "./ornaments/PetalRise";
import AmbientParticles from "./AmbientParticles";
import MusicToggle from "./MusicToggle";

export default function MainSite() {
  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10">
        <AmbientParticles density={0.00003} />
      </div>
      <PetalFall />
      <PetalRise />
      <FloatingFlowers />
      <MusicToggle />

      <InvitationCard />
      <div className="hairline mx-auto max-w-4xl" />
      <Countdown />
      <div className="hairline mx-auto max-w-4xl" />
      <Venue />
      <div className="hairline mx-auto max-w-4xl" />
      <SaveTheDate />
      <div className="hairline mx-auto max-w-4xl" />
      <Notes />
      <Footer />
    </div>
  );
}
