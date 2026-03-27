import Contents from "./Contents";
import Sections from "./Sections";

export default function UI() {
  return (
    <section className="flex flex-col gap-4">
      <Contents />
      <Sections />
    </section>
  );
}
