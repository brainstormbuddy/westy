import type { LandingPage } from '../../sanityTypes';
import PortableText from 'react-portable-text';

export default function HomeHero({
  heroContent,
}: {
  heroContent: LandingPage;
}) {
  if (!heroContent.imageUrl && !heroContent.overlayText1) return null;
  return (
    <div className='grid place-content-center bg-slate-50 w-screen'>
      <img
        className='row-span-full col-span-full w-screen'
        src={heroContent.imageUrl}
      />
      {heroContent.overlayText1 && (
        <div className='grid row-span-full col-span-full relative place-items-center  '>
          <div className='bg-slate-900/50 text-slate-50 w-1/2 p-[3%]'>
            {heroContent.overlayText1.map((blockContent, i) => (
              <PortableText key={i} content={blockContent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
