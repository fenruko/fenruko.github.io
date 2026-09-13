import React from "react";
import { Helmet } from "react-helmet";
import ScrollReveal from "../components/ScrollReveal";

// TODO: replace with fenruko's actual avatar URL if different from Rift's logo
const FENRUKO_AVATAR =
  "https://media.discordapp.net/attachments/1474919832939135139/1521436358076403742/image.png?ex=6a44d386&is=6a438206&hm=0620e689a26d9a609718a82b64f5ecb42bf9b5253f82d4890bfc77991bc55270&=&format=webp&quality=lossless";

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#08090c] pt-32 pb-24 px-4">
      <Helmet>
        <title>Team - Rift</title>
      </Helmet>
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">The Team</h1>
          <p className="text-white/40 text-[15px] max-w-xl mx-auto leading-relaxed mb-14">
            The person behind Rift.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="inline-block bg-white/[0.02] rounded-2xl border border-white/[0.06] p-8 text-left max-w-sm">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={FENRUKO_AVATAR}
              alt="fenruko"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <div className="text-white font-semibold text-lg">fenruko</div>
              <div className="text-white/40 text-sm">Sole Owner & Lead Developer</div>
            </div>
          </div>
          <p className="text-white/40 text-[14px] leading-relaxed">
            fenruko is the sole owner of Rift and the lead developer behind the project.
          </p>
        </ScrollReveal>
      </div>
    </div>
  );
}
