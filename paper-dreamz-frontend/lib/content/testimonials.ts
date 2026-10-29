/**
 * Homepage testimonials ("The Experience" section). Admin → Testimonials edits
 * the quotes and Admin → Settings → Testimonials Heading edits SECTION; this copy
 * is shown until the API responds, and whenever it is unreachable.
 *
 * Plain data with no imports, so `scripts/export-content.ts` can turn it into
 * the backend seed data.
 */

export type Testimonial = {
  name: string;
  city: string;
  highlight: string;
  body: string[];
};

export const TESTIMONIALS_SECTION = {
  heading: "The Experience",
  subtext: "In the words of those who have gifted, celebrated and trusted us with their most special memories",
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Shradha Inani",
    city: "Hyderabad",
    highlight:
      "Every single piece was absolutely perfect. The cuts were precise, the finishing was flawless, and not even one envelope was faulty.",
    body: [
      "Absolutely loved the customised envelopes made for my baby’s cradle ceremony! The attention to detail was incredible, and every single piece was absolutely perfect. The cuts were precise, the finishing was flawless, and not even one envelope was faulty.",
      "Everyone who received them appreciated the beautiful work and kept asking where I got them from! So happy with the quality, creativity, and effort that went into making these. Highly recommend her for anyone looking for beautifully customised envelopes for special occasions. Thank you for making our celebration even more special!",
    ],
  },
  {
    name: "Rajani Todi",
    city: "Kolkata",
    highlight: "The envelopes looked so pretty, more beautiful than it seemed on the screen, exactly as we had hoped.",
    body: [
      "We liked the envelope a lot in the starting when we saw that reel, it was something different and it was really beautiful but when it finally came to ordering it and that too such a bulk order we were scared of getting scammed, it happens a lot nowadays and with such a big order it was really scary for us, but we trusted her, of course after clearing our doubts and praying to God that everything will be good, but we were scared every day till the courier arrived.",
      "Finally our courier arrived and the envelopes looked so pretty, more beautiful than it seemed on the screen, exactly as we had hoped, and our face lit up when we opened the courier. Everyone appreciated the envelope and asked where to buy it for themselves, it was one gift which was really amazing and successful.",
    ],
  },
  {
    name: "Sheenam",
    city: "Amritsar",
    highlight: "When little details are done with perfection, it can be seen as a whole.",
    body: ["I was actually quite sure about ordering with you, because when little details are done with perfection, it can be seen as a whole."],
  },
  {
    name: "Anju Sahni",
    city: "Mumbai",
    highlight: "I truly appreciate how efficiently and carefully you managed everything. The product is absolutely lovely.",
    body: [
      "Thank you so much for sending the parcel so promptly. I truly appreciate how efficiently and carefully you managed everything. The product is absolutely lovely, and I’m very happy with the quality. Thank you once again for the wonderful service and for making the whole experience so smooth.",
    ],
  },
  {
    name: "Anu",
    city: "Pune",
    highlight: "Ruchi has a wonderful ability to turn memories and emotions into something tangible and beautiful. Her work is not just handmade; it is made from the heart.",
    body: [
      "I have had the pleasure of getting two very special creations made by Ruchi, and both were truly beautiful.",
      "The first was a handmade baby album for my grandson. It was so pretty, unique and beautifully detailed that everyone who saw it kept asking me, “Who made this?” It was clearly made with so much love, patience and attention to detail.",
      "I then got a special message card made for my mom’s 85th birthday, and honestly, it became one of the most meaningful gifts for her. It was personal, thoughtful and beautifully put together — something she will always treasure.",
      "Ruchi has a wonderful ability to turn memories and emotions into something tangible and beautiful. Her work is not just handmade; it is made from the heart. I would highly recommend her to anyone looking for something truly personal and special.",
    ],
  },
  {
    name: "Uma Goel",
    city: "New Delhi",
    highlight: "She instantly understands what I want, how I want and most importantly when I want. Never has she disappointed me.",
    body: [
      "So I’ve known Ruchi since 15 years or so. Her consistency and professionalism impressed me the most. She instantly understands what I want, how I want and most importantly when I want because generally I am always in an urgency mode. But never has she disappointed me, be it with her neat work, or delivering it on time and just the thing I had imagined. Her soft attitude makes her very approachable and her work always makes me happy. Keep up your good work. Shine on.",
    ],
  },
  {
    name: "Renu",
    city: "Delhi",
    highlight: "They are beautifully designed, elegant, and look even more lovely in person. The quality and detailing are amazing.",
    body: [
      "I absolutely loved the envelopes! They are beautifully designed, elegant, and look even more lovely in person. The quality and detailing are amazing. I’m really happy with them and would definitely recommend them to others. Thank you so much!",
    ],
  },
  {
    name: "A Cherished Patron",
    city: "Paper Dreamz Family",
    highlight: "Ruchi has made gifting something to a dear one a special moment for me. Each piece is so beautiful that sometimes it was difficult for me to part with them.",
    body: [
      "Ruchi has made gifting something to a dear one a special moment for me! I have had her put together a lot of stuff for my family and friends, who mean a lot to me and she has always made sure that each item turned out as beautiful and unique as I wanted them to.",
      "She has even made things for me at such a short notice, that it was difficult to even imagine that was possible! The creativity and the passion with which she makes the books, frames, journals is really inspiring. Each piece is so beautiful that sometimes it was difficult for me to part with them and give them away.",
      "She is a gem of a person, always forthcoming when it comes to guidance, any query regarding crafting, never shies away from sharing her knowledge, which makes her a great teacher! I have also undertaken many courses with her and it won’t be an exaggeration when I say that to find a better teacher in crafting than her won’t be possible.",
      "Keep up the great work Ruchi, stay humble, stay your beautiful self. You already are and will always do wonders!",
    ],
  },
];
