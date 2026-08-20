import {
  Facebook,
  Instagram,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import type { Route } from "next";
import kosiceExterierImage from "@/public/images/nico-kosice-ext.jpg";
import presovExterierImage from "@/public/images/nico-presov-ext.jpg";

export const addresses = [
  {
    street: "Kuzmányho 1",
    city: "Košice",
    postalCode: "040 01",
    phone: {
      label: "+421 917 478 034",
      href: "tel:+421917478034" as Route,
    },
    email: {
      label: "nicokosice@kavejo.sk",
      href: "mailto:nicokosice@kavejo.sk" as Route,
    },
    image: kosiceExterierImage,
    map: "https://maps.app.goo.gl/pujLGMJrUzqW17XK6" as Route,
  },
  {
    street: "17. novembra 106",
    city: "Prešov",
    postalCode: "080 01",
    phone: {
      label: "+421 905 830 548",
      href: "tel:+421905830548" as Route,
    },
    email: {
      label: "nicopresov@kavejo.sk",
      href: "mailto:nicopresov@kavejo.sk" as Route,
    },
    image: presovExterierImage,
    map: "https://maps.app.goo.gl/Xeub9XaS2gmkf3W39" as Route,
  },
];

export const aboutItems = [
  {
    year: 2019,
    title: "2019",
    description:
      "V roku 2019 sa v Košiciach otvorila naša druhá pobočka NICO CAFFÉ.",
    image: "/images/about/1.jpg",
  },
  {
    year: 2023,
    title: "2023",
    description:
      "V roku 2023 sme naše priestory pretvorili do dnešnej podoby. Nico, to sú drevené stoličky, veľké presklenné okná a ružovo-fialové neóny.",
    image: "/images/about/2.jpg",
  },

  {
    year: 2025,
    title: "2025",
    description:
      "V roku 2025 nás Gault & Millau zaradili do svojho celosvetovo uznávaného sprievodcu najlepšími gastro spotmi: “NICO CAFFÉ je rušným miestom pre milovníkov života, ktorým pojmy ako smash, cold brew či exotická kuchyňa nie sú cudzie.”",
    image: "/images/about/3.jpg",
  },
];

export const workingHoursData = {
  week: {
    title: "PON · PIA",
    hours: "8 · 22",
    brunch: "8 · 11",
    bistro: "11:30 · 21",
  },
  weekend: {
    title: "SOB · NED",
    hours: "9 · 20",
    brunch: "9 · 12",
    bistro: "12:30 · 19:30",
  },
};

export const footerSections = {
  contacts: {
    title: "Kontakt",
    items: [
      {
        label: "Napište nám",
        icon: MailIcon,
        href: "mailto:nicokosice@kavejo.sk" as Route,
      },
      {
        label: "Zavolajte nám",
        icon: PhoneIcon,
        href: "tel:+421917478034",
      },
      {
        label: "Najdite nás",
        icon: MapPinIcon,
        href: "https://maps.app.goo.gl/pujLGMJrUzqW17XK6" as Route,
      },
    ],
  },
  links: {
    title: "Odkazy",
    items: [
      // { label: "O nás", href: "#about" },
      { label: "Menu", href: "/#menu" as Route },
      { label: "Kontakt", href: "#footer" as Route },
      { label: "O nas", href: "/#about" as Route },
      { label: "Podmienky používania", href: "/#terms" as Route },
      { label: "Ochrana osobných údajov", href: "/#privacy" as Route },
    ],
  },
  socials: {
    title: "Sledujte nás",
    items: [
      //TODO: Update Instagram profile for Košice location
      {
        label: "Instagram",
        href: "https://www.instagram.com/nico_kosice?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" as Route,
        icon: Instagram,
      },
      //TODO: Update Facebook profile for Košice location  
      {
        label: "Facebook",
        href: "https://www.facebook.com/nicokosice" as Route,
        icon: Facebook,
      },
    ],
  },
};
