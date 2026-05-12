export interface InspirationItem {
  id: number;
  type: "photo" | "website" | "place" | "quote" | "video" | "book" | "music" | "podcast";
  title: string;
  content: string;
  url?: string;
  imageUrl?: string;
  x: number;
  y: number;
  w: number;
  aspect: number;
  rotate: number;
  transparent?: boolean;
}

const R2 = "https://pub-5c0f4d5b9b8b4bd6869b22a9a8099b3e.r2.dev";
const R2B = "https://pub-0f2ac8ec0d4e41b885a39ae5fd004706.r2.dev";

export const inspirationItems: InspirationItem[] = [
  { id: 1, type: "website", title: "John Provencher", content: "", url: "https://johnprovencher.com/", imageUrl: `${R2}/john_provencherpicture-34-copy.webp`, x: 0, y: 0, w: 19.25, aspect: 1912 / 1982, rotate: 0 },
  { id: 2, type: "music", title: "Mr. Lovebomb", content: "", url: "https://open.spotify.com/artist/1hJx89kEIcAmlZzUWat9w6", imageUrl: `${R2}/lovebomb.jpg`, x: 0, y: 0, w: 17.9, aspect: 1, rotate: 0 },
  { id: 3, type: "place", title: "Hong Kong", content: "", url: "https://www.loc.gov/loc/lcib/9708/hongkong.html", imageUrl: `${R2}/hkmap.webp`, x: 0, y: 0, w: 30.25, aspect: 1.5, rotate: 0 },
  { id: 4, type: "podcast", title: "Search Engine", content: "", url: "https://www.searchengine.show/", imageUrl: `${R2}/1200x1200bf-60.jpg`, x: 0, y: 0, w: 17.9, aspect: 1, rotate: 0 },
  { id: 5, type: "video", title: "Greg Girard", content: "Interview with the photographer of Kowloon Walled City.", imageUrl: `${R2}/newgirard.webp`, url: "https://www.youtube.com/watch?v=Ss1L7SaMnAU", x: 0, y: 0, w: 19.25, aspect: 1128 / 846, rotate: 0 },
  { id: 6, type: "book", title: "I Deliver Parcels in Beijing", content: "", url: "https://theconversation.com/i-deliver-parcels-in-beijing-by-hu-anyan-an-unforgettable-look-at-gig-economy-hardship-269157", imageUrl: `${R2}/parcels.jpg`, x: 0, y: 0, w: 16.5, aspect: 2 / 3, rotate: 0 },
  { id: 7, type: "book", title: "My Year of Rest and Relaxation", content: "", url: "https://www.penguinrandomhouse.com/books/561517/my-year-of-rest-and-relaxation-by-ottessa-moshfegh/", imageUrl: `${R2}/myyearofrest.jpg`, x: 0, y: 0, w: 13.75, aspect: 294 / 450, rotate: 0 },
  { id: 9, type: "website", title: "OpenAI Supply Co.", content: "", url: "https://supplyco.openai.com/", imageUrl: `${R2}/oaisupply.png`, x: 0, y: 0, w: 16.9, aspect: 819 / 1350, rotate: 0, transparent: true },
  { id: 10, type: "music", title: "I'll Finish the Lyrics Later", content: "", url: "https://genius.com/albums/Isaia-huron/Ill-finish-the-lyrics-later", imageUrl: `${R2}/lyricsarentfinished.jpg`, x: 0, y: 0, w: 16, aspect: 1, rotate: 0 },
  { id: 11, type: "video", title: "Tales from the Road", content: "Jack Fitz", url: "https://vimeo.com/1125286551", imageUrl: `${R2}/jackfitz.jpg`, x: 0, y: 0, w: 22, aspect: 16 / 9, rotate: 0 },
  { id: 12, type: "photo", title: "1989 Volvo 240 Wagon", content: "The best car ever made.", url: "https://www.volvoclub.org.uk/prof_200.shtml", imageUrl: `${R2}/volvo_240_brochure_single_picture.webp`, x: 0, y: 0, w: 24, aspect: 1024 / 511, rotate: 0 },
  { id: 14, type: "website", title: "Ricoh GRIIIx", content: "", url: "https://www.ricoh-imaging.co.jp/english/products/gr-3/", imageUrl: `${R2}/grIIIx-hdf4.png`, x: 0, y: 0, w: 36, aspect: 1026 / 721, rotate: 0, transparent: true },
  { id: 15, type: "website", title: "M22 Microadventures", content: "", url: "https://m22.com/pages/m22microadventures?srsltid=AfmBOopJcmgdSW-z_Vit11JFCYE6ZpGThs1n__vtKa3h7zf6_zzcO1Nl", imageUrl: `${R2B}/m22.png`, x: 0, y: 0, w: 17.9, aspect: 1, rotate: 0, transparent: true },
  { id: 16, type: "photo", title: "MI", content: "", url: "https://m22.com/pages/m22microadventures?srsltid=AfmBOooAbcL1v1SszW0GtRNCBxnMjA6DAQpGK08FQftE714eWAXtanKA", imageUrl: `${R2B}/mi.png`, x: 0, y: 0, w: 17.9, aspect: 1, rotate: 0, transparent: true },
  { id: 17, type: "photo", title: "NZ", content: "", url: "https://www.theprow.org.nz/events/", imageUrl: `${R2B}/nz.png`, x: 0, y: 0, w: 17.9, aspect: 1433 / 1643, rotate: 0, transparent: true },
];
