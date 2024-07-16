import Hero from "@/components/Hero"
import MainProductShow from "@/components/MainProductShow";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <div className=" flex flex-col">
      <Hero />
      <MainProductShow />
      {/*<Newsletter />*/}
    </div>
  );
}
