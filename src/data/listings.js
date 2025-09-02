// Central data so both pages import the same thing
import img1 from "../assets/images/home-bg.jpg";
import img2 from "../assets/images/home-bg2.jpg";
import img3 from "../assets/images/home-bg3.jpg";
import img4 from "../assets/images/home-bg4.jpg";
import img5 from "../assets/images/home-bg5.jpg";
import img6 from "../assets/images/home-bg6.jpg";
import img7 from "../assets/images/home-bg7.jpg";
import img8 from "../assets/images/home-bg8.jpg";
import img9 from "../assets/images/home-bg9.jpg";
import img10 from "../assets/images/home-bg10.jpg";

export const LISTINGS = [
  {
    id: "hb-001",
    title: "Rutgers-Ready Studio",
    city: "Newark, NJ",
    university: "Rutgers University – Newark",
    type: "Studio",
    price: 1290,
    rating: 4.8,
    reviews: 212,
    img: img1,
    blurb:
      "Furnished studio 6 mins to campus by light rail. Escrow-ready, utilities capped, flexible lease.",
    tags: ["Furnished", "Near Transit", "Utilities Included"],
  },
  {
    id: "hb-002",
    title: "Columbia Shared Room (F)",
    city: "New York, NY",
    university: "Columbia University",
    type: "Room",
    price: 980,
    rating: 4.6,
    reviews: 167,
    img: img2,
    blurb:
      "Female-only room in 3BR. Walk to 1 train. Verified agent with digital lease & escrow.",
    tags: ["Female-only", "In-Unit Laundry"],
  },
  {
    id: "hb-003",
    title: "Drexel 1BR with Balcony",
    city: "Philadelphia, PA",
    university: "Drexel University",
    type: "1 Bedroom",
    price: 1425,
    rating: 4.9,
    reviews: 98,
    img: img3,
    blurb:
      "Bright 1BR near trolley. Document vault supported (I-20, passport) and watermarked previews.",
    tags: ["Furnished", "Elevator"],
  },
  {
    id: "hb-004",
    title: "NYU East Village Micro-Studio",
    city: "New York, NY",
    university: "NYU – Washington Square",
    type: "Studio",
    price: 1690,
    rating: 4.4,
    reviews: 341,
    img: img4,
    blurb: "Micro-studio near Washington Sq. Escrow and clear refund rules.",
    tags: ["Near Transit", "Utilities Included"],
  },
  {
    id: "hb-005",
    title: "Temple Room w/ Ensuite",
    city: "Philadelphia, PA",
    university: "Temple University",
    type: "Room",
    price: 925,
    rating: 4.5,
    reviews: 126,
    img: img5,
    blurb: "Private room with ensuite bath in 4BR. Verified landlord.",
    tags: ["Ensuite Bathroom", "Desk"],
  },
  {
    id: "hb-006",
    title: "Princeton Graduate Cottage",
    city: "Princeton, NJ",
    university: "Princeton University",
    type: "1 Bedroom",
    price: 1780,
    rating: 4.9,
    reviews: 64,
    img: img6,
    blurb:
      "Quiet 1BR cottage 12 mins by bike. Digital lease & escrow release on move-in.",
    tags: ["Furnished", "Bike Storage"],
  },
  {
    id: "hb-007",
    title: "UPenn Studio by Schuylkill",
    city: "Philadelphia, PA",
    university: "University of Pennsylvania",
    type: "Studio",
    price: 1510,
    rating: 4.7,
    reviews: 204,
    img: img7,
    blurb: "River-adjacent studio, furnished. Utilities capped, elevator.",
    tags: ["Furnished", "Elevator", "Utilities Included"],
  },
  {
    id: "hb-008",
    title: "CUNY Baruch Shared (M)",
    city: "New York, NY",
    university: "CUNY Baruch",
    type: "Room",
    price: 975,
    rating: 4.3,
    reviews: 89,
    img: img8,
    blurb: "Male-only room in 2BR near Lexington Ave. Agent KYC verified.",
    tags: ["Male-only", "Near Transit"],
  },
  {
    id: "hb-009",
    title: "NJIT 1BR Loft",
    city: "Newark, NJ",
    university: "NJIT",
    type: "1 Bedroom",
    price: 1320,
    rating: 4.6,
    reviews: 143,
    img: img9,
    blurb:
      "Industrial loft with high ceilings, near Broad St. station. Escrow-ready.",
    tags: ["Furnished", "Near Transit"],
  },
  {
    id: "hb-010",
    title: "Columbia West Harlem Room",
    city: "New York, NY",
    university: "Columbia University",
    type: "Room",
    price: 890,
    rating: 4.2,
    reviews: 311,
    img: img10,
    blurb:
      "Budget-friendly room in a verified 5BR. Audit trail for every decision.",
    tags: ["Budget", "Verified Agent"],
  },
];
